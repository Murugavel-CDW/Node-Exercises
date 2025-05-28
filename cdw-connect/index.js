// The implementation of middlewares to validate the urls and other format data sent from the user for creation is pending
// Creation of indexes for specific fields in db is also pending

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cron from 'node-cron';
import userRouter from './src/routes/user.route.js';
import adminRouter from './src/routes/admin.route.js';
import feedRouter from './src/routes/feed.route.js';
import commentRouter from './src/routes/comment.route.js';
import searchRouter from './src/routes/search.route.js';
import { CustomError } from './src/error/customError.js';
import { logger } from './src/config/loggerConfig.js';
import { connectDb } from './src/config/mongooseConnect.js';
import { jwtAuth } from './src/middlewares/jwtAuth.js';
import { verifyAdmin } from './src/middlewares/adminAuthorize.js';
import { logRequests } from './src/middlewares/requestLogger.js';
import { clearLeftUsersFromDb } from './src/jobs/clearUsers.js';
import { clearPassedRestrictedTimeUsers } from './src/jobs/clearRestrictedUsers.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use(logRequests);

app.use('/users', userRouter);

app.use('/admin', jwtAuth, verifyAdmin, adminRouter);

app.use('/feeds', jwtAuth, feedRouter);

app.use('/comments', jwtAuth, commentRouter);

app.use('/search', jwtAuth, searchRouter);

// Error handler for our server
app.use((error, request, response, next) => {
    // logging the error into the error.log file
    logger.log({
        level: process.env.LOGGER_ERROR_LEVEL,
        message: `Request URL: ${request.url} Error message: ${error.message}`
    });
    if (error instanceof CustomError) {
        response.status(error.statusCode).json({
            error: error.message
        });
    } else {
        // if the error is from mongoose validation
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            error.message = messages[0];
        }
        response.status(500).json({
            error: `Internal server error: ${error.message}`
        });
    }
})

app.listen(process.env.SERVER_PORT, () => {
    connectDb();
    // scheduler for app maintenance by removing left users from the DB
    cron.schedule('0 20 * * *', async () => {
        clearLeftUsersFromDb();
    });
    // scheduler to remove users whose restricted time has ended so that they can register again
    cron.schedule('0 0 * * *', async () => {
        clearPassedRestrictedTimeUsers();
    });
    console.log(`Starting up the express server`);
});
