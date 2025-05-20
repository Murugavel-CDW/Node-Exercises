import express from 'express';
import { signinUser, signupUser } from '../controllers/user.controller.js';
import validateUser from '../middlewares/userValidator.js';

const userRouter = express.Router();

userRouter.post('/signup', validateUser, signupUser);

userRouter.post('/signin', validateUser, signinUser);

export default userRouter;