import mongoose from "mongoose";

// Schema structure for the comments collection
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        minLength: [2, 'Minimum two characters in comment is required']
    },
    commentedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
    },
    postID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Posts'
    }
}, {
    timestamps: true
});

export const Comment = mongoose.model('Comments', commentSchema);