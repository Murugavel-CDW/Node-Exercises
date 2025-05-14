import fs from 'fs';
import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { logger } from './utils/logger.js';
import buddyRouter from './routes/buddyRoute.js';
import CustomError from './customError.js';

const port = 3000;
const app = express();
// Enabling CORS policy
app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
    response.send("Welcome to express app");
});

app.use('/buddies', buddyRouter);

app.use((error, request, response, next) => {
    // Logging the error to our log file
    logger.log({
        level: process.env.LOGGER_LEVEL,
        message: `Request URL: ${request.url} ; Error: ${error.message}`,
    });
    if (error instanceof CustomError) { // if the err is an instance of the CustomError class
        response.status(error.statusCode).send(error.message);
        return;
    }
    response.status(500).send(`Internal server error: ${err.message}`);
})

app.listen(port, () => {
    fs.writeFile('./data/cdw_ace25_buddies.json', '[]', err => {
        if (err) {
            console.log(`Error while reading into the file. ${err.message}`);
        }
    });
    console.log(`Listening on port: ${port}`);
});