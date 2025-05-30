import { body, validationResult } from "express-validator"

// Set of middlewares to validate the request data and evaluate if any error is produced
export const validateUserData = [
    [
        body('name').optional().isLength({ min: 6 }).withMessage('Minimum six characters in name is required'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('password').optional().isLength({ min: 8 }).withMessage('Minimum eight characters in password is required'),
        body('profilePic').optional().isURL().withMessage('Invalid URL format for profile pic'),
        body('yearsOfExperience').optional().isFloat({ min: 0 }).withMessage('Negative values are not supported')
    ],
    (request, response, next) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                error: errors.array()[0].msg
            });
        }
        next();
    }
]