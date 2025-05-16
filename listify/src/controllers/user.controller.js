import bcrypt from 'bcrypt';
import { addNewUser, fetchUserByField, generateToken } from '../services/user.service.js';

export const signupUser = async (request, response, next) => {
    try {
        const { userName, password } = request.body;
        const user = await fetchUserByField('userName', userName);
        if (user) {
            return response.status(409).send("User with name already exists");
        }
        const addedUser = await addNewUser(userName, password);
        const token = generateToken(addedUser.userId); 
        response.status(200).json({
            message: "User signed up successfully",
            token
        });
    } catch (error) {
        next(error);
    }
}

export const signinUser = async (request, response, next) => {
    try {
        if (!request.body || !request.body.userName || !request.body.password) {
            return response.status(400).send("All fields are required");
        }
        const { userName, password } = request.body;
        const user = await fetchUserByField('userName', userName);
        if (!user) {
            return response.status(409).send("User with name doesn't exist");
        }
        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if (!isPasswordEqual) {
            return response.status(409).send("Invalid Password");
        }
        const token = generateToken(user.userId); 
        response.status(200).json({
            message: "User signed in successfully",
            token
        });
    } catch (error) {
        next(error);
    }
}