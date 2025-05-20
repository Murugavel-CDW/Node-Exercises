import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRouter from './src/routes/user.route.js';
import taskRouter from './src/routes/task.route.js';
import { logger } from './src/utils/logger.js';
import { CustomError } from './src/errors/customError.js';
import logRequests from './src/middlewares/infoLogger.js';
import jwtTokenAuth from './src/middlewares/jwtAuth.js';

const app = express();
const port = 3000;

app.use(cors()); // enabling the CORS policy

app.use(express.json()); 

app.use(logRequests); // calling middleware to log all requests

app.use('/users', userRouter);

app.use('/tasks', jwtTokenAuth, taskRouter);

// Handling of any error that is encountered by the server
app.use((error, request, response, next) => {
    // Logging the error to the file
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