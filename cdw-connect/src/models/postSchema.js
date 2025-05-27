import mongoose from "mongoose";

// Schema structure for the posts collection
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    feed: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    }
}, {
    timestamps: true
});

export const Post = mongoose.model('Posts', postSchema);