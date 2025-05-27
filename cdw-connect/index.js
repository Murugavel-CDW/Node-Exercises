// The whole logic now assumes that the passed data from the user is valid (for any document creation purpose in DB)
// The implementation of middlewares to validate the data sent from the user for creation is pending
// Implementation of search and app maintenance feature is pending
// Creation of indexes for specific fields in db is also pending

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRouter from './src/routes/user.route.js';
import adminRouter from './src/routes/admin.route.js';
import feedRouter from './src/routes/feed.route.js';
import commentRouter from './src/routes/comment.route.js';
import { CustomError } from './src/error/customError.js';
import { logger } from './src/config/loggerConfig.js';
import { connectDb } from './src/config/mongooseConnect.js';
import { jwtAuth } from './src/middlewares/jwtAuth.js';
import { verifyAdmin } from './src/middlewares/adminAuthorize.js';
import { logRequests } from './src/middlewares/requestLogger.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use(logRequests);

app.use('/users', userRouter);

app.use('/admin', jwtAuth, verifyAdmin, adminRouter);

app.use('/feeds', jwtAuth, feedRouter);

app.use('/comments', jwtAuth, commentRouter);

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
        response.status(500).json({
            error: `Internal server error: ${error.message}`
        });
    }
})

app.listen(process.env.SERVER_PORT, () => {
    connectDb();
    console.log(`Starting up the express server`);
});
