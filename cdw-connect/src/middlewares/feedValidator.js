import { body, validationResult } from 'express-validator';

// Set of middlewares to validate the request data and evaluate if any error is produced
export const validateFeedData = [
    body('feed').isURL().withMessage('Invalid URL format for feed link'), // returns a middleware
    (request, response, next) => {
        const errors = validationResult(request); // validating the request from the previous middleware
        if (!errors.isEmpty()) { // if errors are present
            return response.status(400).json({
                error: errors.array()[0].msg // converting the errors field into an array and sending the first error message
            });
        }
        next();
    }
];