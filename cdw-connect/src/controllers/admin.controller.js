import { User } from "../models/userSchema.js";
import { validateUser } from "../services/admin.service.js";
import { sendEmail } from "../utils/sendMail.js";

export const fetchPendingApprovals = async (request, response, next) => {
    try {
        const pendingApprovalList = await User.find({approvalStatus: false}, 'employeeID name email');
        if (pendingApprovalList.length == 0) {
            return response.status(200).send("No pending approvals to display");
        }
        response.status(200).send(pendingApprovalList);
    } catch (error) {
        next(error);
    }
}

export const fetchPendingApproval = async (request, response, next) => {
    try {
        const { employeeID } = request.params;
        const pendingApprovalDetails = await User.findOne({ employeeID , approvalStatus: false});
        if (!pendingApprovalDetails) {
            return response.status(404).send("No details found for the employee");
        }
        return pendingApprovalDetails;
    } catch (error) {
        next(error);
    }
}

export const verifyUser = async (request, response, next) => {
    try {
        const { employeeID } = request.params;
        const isValidUser = await validateUser(employeeID);
        response.status(200).send(isValidUser);
    } catch (error) {
        next(error);
    }
}

export const approveUser = async (request, response, next) => {
    try {
        const { employeeID } = request.params;
        const userDetails = await User.findOne({ employeeID, approvalStatus: false });
        if (!userDetails) {
            return response.status(404).send("No details found for the employee");
        }
        userDetails.approvalStatus = true;
        sendEmail(userDetails.email, userDetails.name, "Approved");
    } catch (error) {
        next(error);
    }
}

export const rejectUser = async (request, response, next) => {
    try {
        const { employeeID } = request.params;
        const userDetails = await User.findOne({ employeeID, approvalStatus: false });
        if (!userDetails) {
            return response.status(404).send("No details found for the employee");
        }
        const currentDate = new Date();
        const twoDaysLater = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000));
        userDetails.restrictedUntil = twoDaysLater;
        await userDetails.save();
        sendEmail(userDetails.email, userDetails.name, "Rejected");
    } catch (error) {
        next(error);
    }
}