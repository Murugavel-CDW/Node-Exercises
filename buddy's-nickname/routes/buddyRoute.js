import express from 'express';
import jwthTokenAuth from '../middlewares/jwtAuth.js';
import BuddyController from '../controller/buddyController.js';

const buddyRouter = express.Router();

const buddyController = new BuddyController();

buddyRouter.get('/', jwthTokenAuth, (request, response, next) => buddyController.fetchBuddies(request, response, next));

buddyRouter.post('/signup', (request, response, next) => buddyController.signUpUser(request, response, next));

buddyRouter.post('/signin', (request, response, next) => buddyController.signinUser(request, response, next));

buddyRouter.get('/:employeeID', jwthTokenAuth, (request, response, next) => buddyController.fetchBuddy(request, response, next));

buddyRouter.patch('/:employeeID', jwthTokenAuth, (request, response, next) => buddyController.updateBuddy(request, response, next));

buddyRouter.delete('/:employeeID', jwthTokenAuth, (request, response, next) => buddyController.removeBuddy(request, response, next));

export default buddyRouter;