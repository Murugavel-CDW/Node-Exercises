import express from 'express';
import { signinUser, signupUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/signup', signupUser);

userRouter.post('/signin', signinUser);

export default userRouter;