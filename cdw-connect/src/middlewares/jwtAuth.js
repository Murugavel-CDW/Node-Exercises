import jwt from "jsonwebtoken";
import { CustomError } from "../error/customError.js";

export const jwtAuth = (request, response, next) => {
    const token = request.headers['authorization'];
    if (!token) {
        return next(new CustomError("Invalid request", 400));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        request.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};