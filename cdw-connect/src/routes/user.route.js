import express from 'express';
import { signinUser, signupUser, displayProfile, updateProfile } from '../controllers/user.controller.js';
import { jwtAuth } from '../middlewares/jwtAuth.js';

const userRouter = express.Router();

userRouter.post('/signup', signupUser);

userRouter.post('/signin', signinUser);

userRouter.get('/profile', jwtAuth, displayProfile);

userRouter.patch('/profile', jwtAuth, updateProfile);

export default userRouter;