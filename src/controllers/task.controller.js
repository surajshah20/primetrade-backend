import { createTask, getTasksByUser, getAllTasks, getTaskById, updateTask, deleteTask } from '../models/task.model.js';
import { validationResult } from 'express-validator';

export const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { title, description } = req.body;
    const task = await createTask(title, description, req.user.id);
    res.status(201).json({ success: true, message: 'Task created.', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getTasks = async (req, res) => {
  try {
    // Admin sees all tasks, user sees only their own
    const tasks = req.user.role === 'admin'
      ? await getAllTasks()
      : await getTasksByUser(req.user.id);
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    // Users can only view their own tasks
    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const { title, description, status } = req.body;
    const updated = await updateTask(req.params.id, title, description, status);
    res.status(200).json({ success: true, message: 'Task updated.', task: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const remove = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    await deleteTask(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};