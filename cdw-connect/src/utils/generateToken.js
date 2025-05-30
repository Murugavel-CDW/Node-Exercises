import jwt from 'jsonwebtoken';

// Function to create payload from the arguments passed and generating a jwt token
export const createJWTToken = (employeeID, employeeDBId, role) => {
    const payload = {
        employeeID,
        employeeDBId,
        role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 30 * 60
    });
    return token;
}