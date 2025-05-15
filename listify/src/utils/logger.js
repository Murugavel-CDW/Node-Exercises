import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

export const logger = createLogger({
    format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.File({
            filename: path.resolve(import.meta.dirname, "../../logs/error.log"),
            level: process.env.LOGGER_ERROR_LEVEL
        }),
        new transports.File({
            filename: path.resolve(import.meta.dirname, '../../logs/combined.log'),
            level: process.env.LOGGER_INFO_LEVEL
        })
    ]
}); 