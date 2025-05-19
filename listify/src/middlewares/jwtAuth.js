import jwt from 'jsonwebtoken';
import { CustomError } from '../errors/customError.js';

const jwtTokenAuth = (request, response, next) => {
    const jwtToken = request.headers['authorization']; 
    // Checking if the token is not present
    if (!jwtToken) {
        return next(new CustomError("Invalid request", 400));
    }
    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        request.userId = decoded.userId; // assigning the value of userID to the request object
        next();
    } catch (err) {
        next(err);
    }
}

export default jwtTokenAuth;