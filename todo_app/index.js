const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const pool = require('./db');
const authenticateToken = require('./authMiddleware');

dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Hello Todo App!'));

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already registered' });
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.user_id;
  const { oldPassword, newPassword, newEmail } = req.body;

  try {
    if (newEmail) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [newEmail]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });
      await pool.query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, userId]);
      return res.json({ message: 'Email updated successfully' });
    }

    if (oldPassword && newPassword) {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = result.rows[0];
      if (!await bcrypt.compare(oldPassword, user.password)) {
        return res.status(403).json({ error: 'Old password is incorrect' });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);
      return res.json({ message: 'Password updated successfully' });
    }

    res.status(400).json({ error: 'Invalid request: Provide email or password fields' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/tasks', authenticateToken, async (req, res) => {
  const { title, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'Please provide title' });

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, due_date, user_id) VALUES ($1, $2, $3) RETURNING id, title, completed, due_date',
      [title, dueDate || null, req.user.user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, completed, dueDate } = req.body;
  const userId = req.user.user_id;

  if (title === undefined && completed === undefined && dueDate === undefined) {
    return res.status(400).json({ error: 'Provide at least one field to update' });
  }

  try {
    const check = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) return res.status(403).json({ error: 'Forbidden: Not your task' });

    const updates = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) { updates.push(`title = $${idx++}`); values.push(title); }
    if (completed !== undefined) { updates.push(`completed = $${idx++}`); values.push(completed); }
    if (dueDate !== undefined) { updates.push(`due_date = $${idx++}`); values.push(dueDate || null); }

    values.push(id);

    const result = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const check = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) return res.status(403).json({ error: 'Forbidden: Not your task' });

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    res.json({ message: 'Task deleted successfully', deletedTask: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Start Server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
