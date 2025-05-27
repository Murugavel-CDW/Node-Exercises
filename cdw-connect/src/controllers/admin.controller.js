import { User } from "../models/userSchema.js";
import { validateUser } from "../services/admin.service.js";
import { sendEmail } from "../utils/sendMail.js";

// Function to fetch the pending approvals
export const fetchPendingApprovals = async (request, response, next) => {
    try {
        const pendingApprovalList = await User.find({approvalStatus: false}, 'employeeID name email');
        if (pendingApprovalList.length == 0) {
            return response.status(200).json({
                message: "No pending approvals to display"
            });
        }
        response.status(200).json({ pendingApprovalList });
    } catch (error) {
        next(error);
    }
}

// Function to fetch a particular pending approval
export const fetchPendingApproval = async (request, response, next) => {
    try {
        const { employeeID } = request.params;
        const pendingApprovalDetails = await User.findOne({ employeeID , approvalStatus: false});
        if (!pendingApprovalDetails) {
            return response.status(404).json({
                message: "No details found for the employee"
            });
        }
        return pendingApprovalDetails;
    } catch (error) {
        next(error);
    }
}

// Function to verify if the user is a valid one or not
export const verifyUser = async (request, response, next) => {
    try {
        const { employeeID } = request.params;
        const isValidUser = await validateUser(employeeID);
        response.status(200).json({ isValidUser });
    } catch (error) {
        next(error);
    }
}

// Function to approve the pending approval of the user 
export const approveUser = async (request, response, next) => {
    try {
        const { employeeID } = request.params;
        const userDetails = await User.findOne({ employeeID });
        if (!userDetails) {
            return response.status(404).json({
                message: "No details found for the employee"
            });
        }
        if (userDetails.approvalStatus) { // if the user is already approved
            return response.status(400).json({
                message: "User is already approved"
            });
        }
        userDetails.approvalStatus = true; // changing the approval status to true (i.e) approved
        await userDetails.save();
        sendEmail(userDetails.email, userDetails.name, "Approved");
        response.status(200).json({
            message: "User approved successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Function to reject the pending approval of the user 
export const rejectUser = async (request, response, next) => {
    try {
        const { employeeID } = request.params;
        const userDetails = await User.findOne({ employeeID });
        if (!userDetails) {
            return response.status(404).json({
                message: "No details found for the employee"
            });
        }
        if (userDetails.approvalStatus) {
            return response.status(400).json({
                message: "Cannot reject since user is already approved"
            });
        }
        const currentDate = new Date();
        // calculating two days from the current time
        const twoDaysLater = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000));
        userDetails.restrictedUntil = twoDaysLater; // setting the restricted until time 
        await userDetails.save(); // updating the document
        sendEmail(userDetails.email, userDetails.name, "Rejected");
        response.status(200).json({
            message: "User rejected successfully"
        });
    } catch (error) {
        next(error);
    }
}