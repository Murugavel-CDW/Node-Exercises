import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRouter from './src/routes/user.route.js';
import taskRouter from './src/routes/task.route.js';
import { logger } from './src/utils/logger.js';
import { CustomError } from './src/errors/CustomError.js';
import logRequests from './src/middlewares/infoLogger.js';
import jwtTokenAuth from './src/middlewares/jwtAuth.js';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use(logRequests);

app.use('/users', userRouter);

app.use('/tasks', jwtTokenAuth, taskRouter);

app.use((error, request, response, next) => {
    logger.log({
        level: process.env.LOGGER_ERROR_LEVEL,
        message: `Request URL: ${request.url}; Error message: ${error.message}`
    });
    if (error instanceof CustomError) {
        return response.status(error.statusCode).send(error.message);
    }
    response.status(500).send(`Internal server error: ${error.message}`);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})