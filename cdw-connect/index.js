import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRouter from './src/routes/user.route.js';
import adminRouter from './src/routes/admin.route.js';
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

app.use((error, request, response, next) => {
    logger.log({
        level: process.env.LOGGER_ERROR_LEVEL,
        message: `Request URL: ${request.url} Error message: ${error.message}`
    });
    if (error instanceof CustomError) {
        response.status(error.statusCode).send(error.message);
    } else {
        response.status(500).send(`Internal server error: ${error.message}`);
    }
})

app.listen(process.env.SERVER_PORT, () => {
    connectDb();
    console.log(`Starting up the express server`);
});
