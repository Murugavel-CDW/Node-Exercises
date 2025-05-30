import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cron from 'node-cron';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
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
import { scheduleJobWithMaintenance, getMaintenanceStatus } from './src/utils/maintenance.js';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // OpenAPI 3.0 specification
    info: {
      title: "CDW-Connect",      
      version: "1.0.0", 
      description: "API Documentation for CDW's internal social media REST APIs", // A short description of your API
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        }
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "Endpoints for user registration, login, profile management, etc.",
      },
      {
        name: "Feeds",
        description: "Endpoints for creating and retrieving feed posts.",
      },
    ],
  },
  // Paths to files containing OpenAPI definitions in JSDoc comments
  apis: ["./src/routes/*.js"],
};

const swaggerDoc = swaggerJSDoc(swaggerOptions);

const app = express();

// Enabling the CORS policy
app.use(cors());

app.use(express.json());

// Securing our response headers
app.use(helmet());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(logRequests);

// Checks if the status of the app is currently under maintenance
app.use((request, response, next) => {
  const isUnderMaintenance = getMaintenanceStatus();
  if (isUnderMaintenance) {
    return response.status(503).json({
      message: "App is currently under maintenance. Try again later."
    });
  }
  next();
});

app.use('/users', userRouter);

app.use('/admin', jwtAuth, verifyAdmin, adminRouter);

app.use('/feeds', jwtAuth, feedRouter);

app.use('/comments', jwtAuth, commentRouter);

app.use('/search', jwtAuth, searchRouter);

// Error handler for our server
app.use((error, request, response, next) => {
    // if the error is from mongoose validation
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        error.message = messages[0];
    }
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
        const errorMessage = error.name === 'ValidationError' ? error.message : `Internal server error: ${error.message}`;
        response.status(error.name === 'ValidationError' ? 400 : 500).json({
            error: errorMessage
        });
    }
})

app.listen(process.env.SERVER_PORT, () => {
    connectDb();
    // scheduler for app maintenance by removing left users from the DB
    cron.schedule('0 20 * * *', () => {
        scheduleJobWithMaintenance(clearLeftUsersFromDb);
    });
    // scheduler to remove users whose restricted time has ended so that they can register again
    cron.schedule('0 0 * * *', () => {
        scheduleJobWithMaintenance(clearPassedRestrictedTimeUsers);
    });
    console.log(`Starting up the express server`);
});
