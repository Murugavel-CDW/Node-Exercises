// Custom error class to throw status codes along with the error message
export class CustomError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}