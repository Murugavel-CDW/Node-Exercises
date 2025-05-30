import { logger } from "../config/loggerConfig.js";

// Middleware function that logs all the requests that hit the server
export const logRequests = (request, response, next) => {
    const { url, method } = request;
    const startTime = Date.now();
    // when the response is ready to be sent back 
    response.on('finish', () => {
        const responseDuration = Date.now() - startTime;
        logger.log({
            level: process.env.LOGGER_INFO_LEVEL,
            message: `URL: ${url} Method: ${method} StatusCode: ${response.statusCode} Duration: ${responseDuration}ms`
        });
    });
    next();
}