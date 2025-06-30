// routes/tasks.js
const express = require('express');
const router = express.Router();
const pool = require('../db');  // เชื่อมต่อ DB (PostgreSQL)
const authMiddleware = require('../middleware/auth'); // middleware ตรวจสอบ token

// ดึงรายการ task ของ user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// เพิ่ม task พร้อม dueDate
router.post('/', authMiddleware, async (req, res) => {
  const { title, dueDate } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, due_date) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, dueDate || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// แก้ไข task (title, dueDate, completed)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, dueDate, completed } = req.body;
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           due_date = COALESCE($2, due_date),
           completed = COALESCE($3, completed)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, dueDate, completed, taskId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ลบ task
router.delete('/:id', authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
