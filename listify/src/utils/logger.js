import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint } = format;

export const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.File({ filename: "../../logs/error-log", level: process.env.LOGGER_ERROR_LEVEL }),
        new transports.File({ filename: '../../logs/combined-log', level: process.env.LOGGER_INFO_LEVEL })
    ]
}); 