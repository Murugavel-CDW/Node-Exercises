import mongoose from "mongoose";
import { CustomError } from "../error/customError.js";

export const connectDb = () => {
    mongoose.connect(process.env.DB_CONNECTION_URL)
        .then(() => {
            console.log("Connected to DB successfully");
        }).catch((error) => {
            throw new CustomError(error.message, 500);
        });
};
