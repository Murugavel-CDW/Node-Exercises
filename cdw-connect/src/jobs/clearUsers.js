import { logger } from "../config/loggerConfig.js";
import { User } from "../models/userSchema.js"
import { fetchUserInWallet } from "../utils/findUser.js";

export const clearLeftUsersFromDb = async () => {
    try {
        const userListDB = await User.find({ approvalStatus: true });
        // Mapping over the list
        await Promise.all(
            userListDB.map(async (user) => {
                const { email } = user;
                const userDetails = await fetchUserInWallet(email);
                // if the user is not present in the wallet then remove them from the DB
                if (!userDetails) {
                    await User.deleteOne({ email });
                }
            })
        );
    } catch (error) {
        logger.log({
            level: process.env.LOGGER_ERROR_LEVEL,
            message: `Error occured in the scheduler: ${error.message}`
        });
    }
}