import pool from '../config/db.js';

export const createTask = async (title, description, userId) => {
  const result = await pool.query(
    'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
    [title, description, userId]
  );
  return result.rows[0];
};

export const getTasksByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

export const getAllTasks = async () => {
  const result = await pool.query(
    'SELECT tasks.*, users.name as owner FROM tasks JOIN users ON tasks.user_id = users.id ORDER BY created_at DESC'
  );
  return result.rows;
};

export const getTaskById = async (id) => {
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateTask = async (id, title, description, status) => {
  const result = await pool.query(
    'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
    [title, description, status, id]
  );
  return result.rows[0];
};

export const deleteTask = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
};