import nodemailer from 'nodemailer';
import { CustomError } from '../error/customError.js';

export const sendEmail = async (email, userName, status) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });
    
        const messageOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "CDW-Connect approval status update",
            text: `Hi ${userName}, your status has been ${status} by the admin. ${status === 'Approved' ? "You can now login and use the app" : "You should wait for 2 days before trying to register again"}.\nThanks and Regards,\nCDW-Connect`
        };
    
        await transport.sendMail(messageOptions);
    } catch (error) {
        throw new CustomError(error.message, 500);
    }
}