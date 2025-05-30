import express from 'express';
import { approveUser, fetchPendingApproval, fetchPendingApprovals, rejectUser, verifyUser } from '../controllers/admin.controller.js';

const adminRouter = express.Router();

adminRouter.get('/pending', fetchPendingApprovals);

adminRouter.get('/pending/:employeeID', fetchPendingApproval);

adminRouter.get('/verify/:employeeID', verifyUser);

adminRouter.get('/approve/:employeeID', approveUser);

adminRouter.get('/reject/:employeeID', rejectUser);

export default adminRouter;