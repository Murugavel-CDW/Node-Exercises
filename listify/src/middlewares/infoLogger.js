import { logger } from "../utils/logger.js";

const logRequests = (request, response, next) => {
    const { url, method } = request; 
    const start = Date.now();
    response.on('finish', () => {
        const responseDuration = Date.now() - start;
        const logMessage = `URL: ${url} Method: ${method} StatusCode: ${response.statusCode} Duration: ${responseDuration}ms`;
        logger.info(logMessage);
    });
    next();
}

export default logRequests;