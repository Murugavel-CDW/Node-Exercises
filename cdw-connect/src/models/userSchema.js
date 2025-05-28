import mongoose from "mongoose";

// Schema structure for the users collection
const userSchema = new mongoose.Schema({
    employeeID: String,
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [6, 'Minimum six characters in name is required']
    },
    email: {
        type: String,
        required: [true, 'Enail is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Minimum eight characters in password is required']
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'others'],
            message: '{VALUE} is not supported'
        },
        required: [true, 'Gender is required']
    },
    profilePic: {
        type: String,
        required: [true, 'Profile Pic Link is required']
    },
    designation: {
        type: String,
        required: [true, 'Designation is required']
    },
    certifications: [
        {
            type: String
        }
    ],
    yearsOfExperience: {
        type: Number,
        min: [0, 'Negative values are not supported'],
        required: [true, 'Years of experience is required']
    },
    BU: {
        type: String,
        required: [true, 'BU is required']
    },
    workLocation: {
        type: String,
        required: [true, 'Work Location is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required']
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