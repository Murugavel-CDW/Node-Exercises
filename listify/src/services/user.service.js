import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileDetailsRead } from "../utils/fileRead.js";
import { fileDetailsWrite } from "../utils/fileWrite.js";

export const fetchUserByField = async (fieldName, value) => {
    const userList = await fileDetailsRead('users'); 
    const userDetails = userList.find((user) => user[fieldName] === value);
    return userDetails;
}

export const addNewUser = async (userName, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        userName,
        password: hashedPassword
    };
    await fileDetailsWrite('users', newUser);
}

export const generateToken = (userName) => {
    const token = jwt.sign({userName}, process.env.JWT_SECRET_KEY, {
        expiresIn: 30 * 60
    });
    return token;
}