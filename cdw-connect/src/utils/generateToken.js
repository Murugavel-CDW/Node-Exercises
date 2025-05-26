import jwt from 'jsonwebtoken';

export const createJWTToken = (employeeID, role) => {
    const payload = {
        employeeID,
        role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 30 * 60
    });
    return token;
}