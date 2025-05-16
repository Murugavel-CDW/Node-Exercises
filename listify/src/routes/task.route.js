import express from 'express';
import { createTask, deleteTask, fetchTask, fetchTasks, updateTask } from '../controllers/task.controller.js';
import taskValidator from '../middlewares/taskValidator.js';

const taskRouter = express.Router();

taskRouter.post('/', taskValidator, createTask);

taskRouter.get('/', fetchTasks);

taskRouter.get('/:taskId', fetchTask);

taskRouter.put('/:taskId', taskValidator, updateTask);

taskRouter.delete('/:taskId', deleteTask);

export default taskRouter;