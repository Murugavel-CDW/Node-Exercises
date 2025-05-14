import express from 'express';
import BuddyController from '../controller/buddyController.js';

const buddyRouter = express.Router();

const buddyController = new BuddyController();

buddyRouter.get('/', (request, response) => buddyController.fetchBuddies(request, response));

buddyRouter.get('/:employeeID', (request, response) => buddyController.fetchBuddy(request, response));

buddyRouter.post('/', (request, response) => buddyController.addBuddy(request, response));

buddyRouter.patch('/:employeeID', (request, response) => buddyController.updateBuddy(request, response));

buddyRouter.delete('/:employeeID', (request, response) => buddyController.removeBuddy(request, response));

export default buddyRouter;