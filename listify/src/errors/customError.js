// A custom error class to throw message along with status code
export class CustomError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}