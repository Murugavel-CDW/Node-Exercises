import jwt from 'jsonwebtoken';
import { CustomError } from '../errors/CustomError.js';

const jwtTokenAuth = (request, response, next) => {
    const jwtToken = request.headers['authorization'];
    if (!jwtToken) {
        return next(new CustomError("Invalid request", 400));
    }
    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        request.userId = decoded.userId;
        next();
    } catch (err) {
        next(err);
    }
}

export default jwtTokenAuth;