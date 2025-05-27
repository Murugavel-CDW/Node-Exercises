import path from 'path';
import { createLogger, format, transports } from 'winston';
import { LOGURL } from '../constants/urlConstants.js';

const { combine, printf, timestamp } = format;

// Function that configures the winston logger
export const logger = createLogger({
    format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.File({
            filename: path.resolve(import.meta.dirname, LOGURL.ERROR_LOG),
            level: process.env.LOGGER_ERROR_LEVEL
        }),
        new transports.File({
            filename: path.resolve(import.meta.dirname, LOGURL.INFO_LOG),
            level: process.env.LOGGER_INFO_LEVEL
        })
    ]
}); 