import express from 'express';
import { createComment, deleteComment } from '../controllers/comment.controller.js';

const commentRouter = express.Router();

commentRouter.post('/:postID', createComment);

commentRouter.delete('/:commentID', deleteComment);

export default commentRouter;