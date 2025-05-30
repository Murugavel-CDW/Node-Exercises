import jwt from "jsonwebtoken";

// Middleware function to authenticate the user via JWT token
export const jwtAuth = (request, response, next) => {
    const token = request.headers['authorization'];
    if (!token) { // if no credentials is passed to the request
        return response.status(401).send("Invalid credentials");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        request.user = decoded; // assigning the cred values to the request object in the user field
        next();
    } catch (error) {
        next(error);
    }
};