const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_app',
  password: '', // Your PostgreSQL Password
  port: , // Your PostgreSQL Port
});

// ทดสอบการเชื่อมต่อครั้งแรก
pool.connect()
  .then(() => {
    console.log('✅ Connected to database at:', new Date().toISOString());
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

module.exports = pool;
