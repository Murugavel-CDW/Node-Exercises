import validator from 'validator';

// Middleware to validate the user
const validateUser = (request, response, next) => {
    const { userName, password} = request.body || {};
    if (!userName || !password) {
        return response.status(400).send("All fields are required");
    }

    if (!validator.isAlpha(userName)) {
        return response.status(400).send("Username cannot contain numbers");
    }

    next();
}

export default validateUser;