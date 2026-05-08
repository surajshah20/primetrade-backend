import pool from '../config/db.js';

export const createUser = async (name, email, hashedPassword, role = 'user') => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email, role, created_at FROM users');
  return result.rows;
};