import { logger } from "../config/loggerConfig.js";
import { User } from "../models/userSchema.js";

// Function to remove the users whose restricted time has passed so they can register again
export const clearPassedRestrictedTimeUsers = async () => {
    try {
        const currentTime = new Date();
        await User.deleteMany({
            restrictedUntil: { $lte: currentTime }
        });
    } catch (error) {
        logger.log({
            level: process.env.LOGGER_ERROR_LEVEL,
            message: `Error occured in the scheduler: ${error.message}`
        });
    }
}