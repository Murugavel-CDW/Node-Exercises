import express from 'express';
import { signinUser, signupUser, displayProfile, updateProfile } from '../controllers/user.controller.js';
import { jwtAuth } from '../middlewares/jwtAuth.js';
import { validateUserData } from '../middlewares/userValidator.js';

const userRouter = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags:
 *       - Users
 *     summary: User/Admin signup
 *     description: Creates a new user after validating data and marks the approval as pending.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeID:
 *                 type: string
 *                 example: "12345"
 *               name:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 example: "sampleEmail@provider.com"
 *               password:
 *                 type: string
 *                 example: "mypassword"
 *               gender:
 *                 type: string
 *                 example: "male"
 *               profilePic:
 *                 type: string
 *                 example: "https://sample_link.com"
 *               designation:
 *                 type: string
 *                 example: "Intern"
 *               certifications:
 *                 type: array
 *                 items:
 *                    type: string
 *                 example: ["certification1", "certification2"]
 *               yearsOfExperience:
 *                 type: number
 *                 example: 1
 *               BU:
 *                 type: string
 *                 example: "DV"
 *               workLocation:
 *                 type: string
 *                 example: "chennai"
 *               role:
 *                 type: string
 *                 example: "co-worker"
 *     responses:
 *       201:
 *         description: User created successfully and waiting for approval from admin. Incase of admin returns the JWT token.
 *       400:
 *         description: Invalid format of input received from one of the fields in the request body (or) User already exists (or) User re-registers before his cooldown period.
 *       404:
 *         description: No user is found in case of admin signing up.
 *       500:
 *         description: In case of any unexpected error from the server.
 */
userRouter.post('/signup', validateUserData, signupUser);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     tags:
 *       - Users
 *     summary: User/Admin sigin
 *     description: Logs in the user after validating data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "sampleEmail@provider.com"
 *               password:
 *                 type: string
 *                 example: "mypassword"
 *     responses:
 *       200:
 *         description: User Logged in successfully and returns the JWT token.
 *       400:
 *         description: Invalid format of input received from one of the fields in the request body.
 *       404:
 *         description: No user is found.
 *       500:
 *         description: In case of any unexpected error from the server.
 */
userRouter.post('/signin', validateUserData, signinUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Profile Display
 *     description: Displays the profile of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the authenticated user's profile.
 *       500:
 *         description: In case of any unexpected error from the server.
 */
userRouter.get('/profile', jwtAuth, displayProfile);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Profile Updation
 *     description: Updates the profile details of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "sample_user"
 *               profilePic:
 *                 type: string
 *                 example: "https://sample_link.com"
 *               designation:
 *                 type: string
 *                 example: "Intern"
 *               certifications:
 *                 type: array
 *                 items:
 *                    type: string
 *                 example: ["certification1", "certification2"]
 *               yearsOfExperience:
 *                 type: number
 *                 example: 1
 *               workLocation:
 *                 type: string
 *                 example: "chennai"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the authenticated user's profile is updated.
 *       400:
 *         description: Invalid format of input received from one of the fields in the request body (or) unmodifiable field is passed.
 *       500:
 *         description: In case of any unexpected error from the server.
 */
userRouter.patch('/profile', jwtAuth, validateUserData, updateProfile);

export default userRouter;