import express from 'express';
import { create, getTasks, getTask, update, remove } from '../controllers/task.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

// All task routes require authentication
router.use(verifyToken);

router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
], create);

router.get('/', getTasks);
router.get('/:id', getTask);

router.put('/:id', [
  body('title').notEmpty().withMessage('Title is required'),
  body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
], update);

router.delete('/:id', remove);

export default router;