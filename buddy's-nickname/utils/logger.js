import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint } = format;
// Defining our logger
export const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.File({
            filename: path.resolve(import.meta.dirname, '../logs/error.log'),
            level: process.env.LOGGER_LEVEL
        })
        // If needed for some info and error logs both combined
        // new transports.File({
        //     filename: path.join(__dirname, '../utils/combined.log')
        // })
    ]
});