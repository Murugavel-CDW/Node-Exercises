import { CustomError } from "../error/customError.js";
import { User } from "../models/userSchema.js";
import { fetchUserInWallet } from "../utils/findUser.js";

// Function to validate if the details of employeeID is present and is same in the wallet as well as in the DB
export const validateUser = async (employeeID) => {
    const employeeDetails = await User.findOne({ employeeID, approvalStatus: false });
    if (!employeeDetails) {
        throw new CustomError("No such employee found", 404);
    }
    const employeeWalletDetails = await fetchUserInWallet(employeeDetails.email);
    if (!employeeWalletDetails || employeeWalletDetails.id !== employeeDetails.employeeID) {
        return false;
    }
    return true;
};