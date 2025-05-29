import { User } from "../models/userSchema.js";
import { createUser, findUser } from "../services/user.service.js";
import { createJWTToken } from '../utils/generateToken.js';
import { checkForUnlistedFields } from "../utils/unlistedFieldCheck.js";

// Function to sign up the user into the app 
export const signupUser = async (request, response, next) => {
    try {
        const user = await createUser(request.body);
        if (user.role === 'co-worker') {
            response.status(201).json({
                message: "You must wait till the admin approves your request"
            });
        } else {
            // Create token and register if the user is an admin
            const token = createJWTToken(user.employeeID, user._id, user.role);
            response.status(201).json({
                message: 'Account created successfully',
                token
            });
        }
    } catch (error) {
        next(error);
    }
};

// Function to sign in the user
export const signinUser = async (request, response, next) => {
    try {
        const { email, password } = request.body || {};
        if (!email || !password) {
            return response.status(400).json({
                message: "Both email and password fields are required"
            });
        }
        const user = await findUser(email, password);
        if (!user) {
            return response.status(404).json({
                message: "No such user exist"
            })
        }
        const token = createJWTToken(user.employeeID, user._id, user.role);
        response.status(200).json({
            message: 'Signed in successfully',
            token
        });
    } catch (error) {
        next(error);
    }
};

// Function to display profile information if the user
export const displayProfile = async (request, response, next) => {
    try {
        const { employeeID } = request.user;
        // excluding fields that are irrelevant to display from the user profile
        const userDetails = await User.findOne({ employeeID }, '-email -password -_id -__v -role -approvalStatus');
        response.status(200).json({ userDetails });
    } catch (error) {
        next(error);
    }
}

// Function to update the details in the user profile
export const updateProfile = async (request, response, next) => {
    try {
        const { employeeID } = request.user;
        const userData = request.body;
        if (!userData) {
            return response.status(400).json({
                message: "Request body cannot be empty"
            });
        }
        userData.certifications = userData.certifications || [];
        // specifying the fields that can be updated
        const allowedFields = ['name', 'profilePic', 'designation', 'certifications', 'yearsOfExperience', 'workLocation'];
        const inputDataFields = Object.keys(userData);
        const unsatisfiedField = checkForUnlistedFields(allowedFields, inputDataFields);
        if (unsatisfiedField) { // if any field that does not fall under the allowedFields is identified
            return response.status(400).json({
                message: `${unsatisfiedField} is not allowed to be modified`
            });
        }
        const user = await User.findOne({ employeeID });
        const existingCertifications = user.certifications;
        // Creating a set to avoid duplicate entries
        const mergedCertifications = [...new Set([...existingCertifications, ...userData.certifications])];
        await User.updateOne({ employeeID }, {
            ...userData,
            certifications: mergedCertifications
        });
        response.status(200).json({
            message: "User profile updated"
        });
    } catch (error) {
        next(error);
    }
}
