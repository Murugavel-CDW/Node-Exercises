import express from 'express';
import BuddyController from '../controller/buddyController.js';

const buddyRouter = express.Router();

const buddyController = new BuddyController();

buddyRouter.get('/', (request, response, next) => buddyController.fetchBuddies(request, response, next));

buddyRouter.get('/:employeeID', (request, response, next) => buddyController.fetchBuddy(request, response, next));

buddyRouter.post('/', (request, response, next) => buddyController.addBuddy(request, response, next));

buddyRouter.patch('/:employeeID', (request, response, next) => buddyController.updateBuddy(request, response, next));

buddyRouter.delete('/:employeeID', (request, response, next) => buddyController.removeBuddy(request, response, next));

export default buddyRouter;