import jwt from 'jsonwebtoken';
import CustomError from "../customError.js";

const jwthTokenAuth = (request, response, next) => {
    const jwtToken = request.header("x-authorization-token");
    if (!jwtToken) { // if no such value present in the header
        return next(new CustomError("Invalid request", 400));
    }
    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        const { employeeId } = decoded;
        request.userID = employeeId; // adding the userID to the request object
        next();
    } catch (err) {
        next(err);
    }
}

export default jwthTokenAuth;