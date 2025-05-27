import { User } from "../models/userSchema.js";
import { createUser, findUser } from "../services/user.service.js";
import { createJWTToken } from '../utils/generateToken.js';

// Function to sign up the user into the app 
export const signupUser = async (request, response, next) => {
    try {
        const user = await createUser(request.body);
        if (user.role === 'co-worker') {
            response.status(200).json({
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
        const { email, password } = request.body;
        const user = await findUser(email, password);
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
        await User.updateOne({ employeeID }, userData);
        response.status(200).json({
            message: "User profile updated"
        });
    } catch (error) {
        next(error);
    }
}
