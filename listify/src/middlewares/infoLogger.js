import { logger } from "../utils/logger.js";

const logRequests = (request, response, next) => {
    const { url, method } = request; 
    const start = Date.now();
    response.on('finish', () => { // logging when the response is received and sent back
        const responseDuration = Date.now() - start; // calculating the duration between the request and the response
        const logMessage = `URL: ${url} Method: ${method} StatusCode: ${response.statusCode} Duration: ${responseDuration}ms`;
        logger.info(logMessage);
    });
    next();
}

export default logRequests;