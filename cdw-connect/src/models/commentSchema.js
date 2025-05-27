import mongoose from "mongoose";

// Schema structure for the comments collection
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
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