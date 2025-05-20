import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileDetailsRead, fileDetailsWrite } from '../utils/fileOperations.js'; 
import generateUniqueID from '../utils/generateID.js';

// Fetching the details of user based on the user name
export const fetchUserByName = async (userName) => {
    const userList = await fileDetailsRead('users'); 
    const userDetails = userList.find((user) => user.userName === userName);
    return userDetails;
}

// Function to create a new user
export const addNewUser = async (userName, password) => {
    const userId = generateUniqueID(); // generating a unique id for the user
    const hashedPassword = await bcrypt.hash(password, 10); // hashing the password
    const newUser = {
        userId,
        userName,
        password: hashedPassword
    };
    await fileDetailsWrite('users', newUser); // writing the new user to the file
    return newUser;
}

// Function to generate a new jwt token
export const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: 30 * 60
    });
    return token;
}