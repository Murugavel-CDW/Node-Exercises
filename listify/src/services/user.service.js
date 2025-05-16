import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileDetailsRead } from "../utils/fileRead.js";
import { fileDetailsWrite } from "../utils/fileWrite.js";
import generateUniqueID from '../utils/generateID.js';

export const fetchUserByField = async (fieldName, value) => {
    const userList = await fileDetailsRead('users'); 
    const userDetails = userList.find((user) => user[fieldName] === value);
    return userDetails;
}

export const addNewUser = async (userName, password) => {
    const userId = generateUniqueID();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        userId,
        userName,
        password: hashedPassword
    };
    await fileDetailsWrite('users', newUser);
    return newUser;
}

export const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: 30 * 60
    });
    return token;
}