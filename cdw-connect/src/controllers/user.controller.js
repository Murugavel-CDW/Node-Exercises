import { createUser, findUser } from "../services/user.service.js";
import { createJWTToken } from '../utils/generateToken.js';

export const signupUser = async (request, response, next) => {
    try {
        const user = await createUser(request.body);
        if (user.role === 'co-worker') {
            response.status(200).send("You must wait till the admin approves your request");
        } else {
            const token = createJWTToken(user.employeeID, user.role);
            response.status(201).json({
                message: 'Account created successfully',
                token
            });
        }
    } catch (error) {
        next(error);
    }
};

export const signinUser = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        const user = await findUser(email, password);
        const token = createJWTToken(user.employeeID, user.role);
        response.status(200).json({
            message: 'Signed in successfully',
            token
        });
    } catch (error) {
        next(error);
    }
};
