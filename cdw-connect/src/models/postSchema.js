import mongoose from "mongoose";

// Schema structure for the posts collection
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [5, 'Minimum five characters in title is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    feed: {
        type: String,
        required: [true, 'Feed Link is required']
    },
    caption: {
        type: String,
        required: [true, 'Caption is required'],
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }
}, {
    timestamps: true
});

export const Post = mongoose.model('Posts', postSchema);