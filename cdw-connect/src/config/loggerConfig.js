import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, printf, timestamp } = format;

export const logger = createLogger({
    format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.File({
            filename: path.resolve(import.meta.dirname, '../../logs/error.log'),
            level: process.env.LOGGER_ERROR_LEVEL
        }),
        new transports.File({
            filename: path.resolve(import.meta.dirname, '../../logs/combined.log'),
            level: process.env.LOGGER_INFO_LEVEL
        })
    ]
}); 