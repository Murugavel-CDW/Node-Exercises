import { CustomError } from "../error/customError.js";
import { User } from "../models/userSchema.js";
import { fetchUserInWallet } from "../utils/findUser.js";
import { sendEmail } from "../utils/sendMail.js";

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

// Function to approve the approval request of the user and send email
export const acceptApproval = async (employeeID) => {
    const userDetails = await User.findOne({ employeeID });
    if (!userDetails) {
        throw new CustomError("No details found for the employee", 404);
    }
    if (userDetails.approvalStatus) { // if the user is already approved
        throw new CustomError("User is already approved", 400);
    }
    userDetails.approvalStatus = true; // changing the approval status to true (i.e) approved
    await userDetails.save();
    sendEmail(userDetails.email, userDetails.name, "Approved");
}

// Function to reject the approval request of the user and send email
export const rejectApproval = async (employeeID) => {
    const userDetails = await User.findOne({ employeeID });
    if (!userDetails) {
        throw new CustomError("No details found for the employee", 404);
    }
    if (userDetails.approvalStatus) {
        throw new CustomError("Cannot reject since user is already approved", 400);
    }
    const currentDate = new Date();
    // calculating two days from the current time
    const twoDaysLater = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000));
    userDetails.restrictedUntil = twoDaysLater; // setting the restricted until time 
    await userDetails.save(); // updating the document
    sendEmail(userDetails.email, userDetails.name, "Rejected");
}