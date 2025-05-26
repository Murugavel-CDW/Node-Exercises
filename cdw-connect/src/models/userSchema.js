import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    employeeID: String,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'others']
        },
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    certifications: [
        {
            type: String
        }
    ],
    BU: {
        type: String,
        required: true
    },
    workLocation: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    approvalStatus: {
        type: Boolean,
        required: true
    },
    restrictedUntil: {
        type: Date
    }
});

export const User = mongoose.model('Users', userSchema);