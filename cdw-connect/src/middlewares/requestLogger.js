import { logger } from "../config/loggerConfig.js";

export const logRequests = (request, response, next) => {
    const { url, method } = request;
    const startTime = Date.now();
    response.on('finish', () => {
        const responseDuration = Date.now() - startTime;
        logger.log({
            level: process.env.LOGGER_INFO_LEVEL,
            message: `URL: ${url} Method: ${method} StatusCode: ${response.statusCode} Duration: ${responseDuration}ms`
        });
    });
    next();
}