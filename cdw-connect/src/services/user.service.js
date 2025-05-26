import bcrypt from 'bcrypt';
import { User } from "../models/userSchema.js"
import { fetchUserInWallet } from '../utils/findUser.js';
import { CustomError } from '../error/customError.js';

export const createUser = async (userData) => {
    const { email, password, role, employeeID } = userData;
    if (role !== 'co-worker' && role !== 'admin') {
        throw new CustomError('Invalid role', 400);
    }
    const userWalletDetails = await fetchUserInWallet(email);
    
    // Instant validation for admin
    if (role === 'admin' && (!userWalletDetails || userWalletDetails.id !== employeeID || userWalletDetails.role !== role)) {
        throw new CustomError('No such user found', 404);
    }
    
    const userDetails = await User.findOne({ email });
    if (userDetails) {
        // Checking if the user has been rejected already and if so does the restriction time has passed
        if (userDetails.restrictedUntil) {
            const currentDate = new Date().getTime();
            const restrictedDate = userDetails.restrictedUntil.getTime();
            if (currentDate >= restrictedDate) {
                User.deleteOne({ email });
            } else {
                throw new CustomError(`Cannot register until the cooldown ends. Try after ${userDetails.restrictedUntil.toISOString()}`
                    , 400);
            }
        } else {
            throw new CustomError("User already exists", 400);
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        ...userData,
        password: hashedPassword,
        employeeID,
        role,
        approvalStatus: role === 'admin'
    });

    await user.save();
    return user;
};

export const findUser = async (email, password) => {
    const userDetails = await User.findOne({ email });
    if (!userDetails) {
        throw new CustomError('No such user found', 404);
    }
    const isPasswordEqual = await bcrypt.compare(password, userDetails.password);
    if (!isPasswordEqual) {
        throw new CustomError("Invalid password", 400);
    }
    if (!userDetails.approvalStatus) {
        throw new CustomError("Your account is still waiting for approval", 403);
    }
    return userDetails;
};