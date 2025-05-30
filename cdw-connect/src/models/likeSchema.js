import mongoose from "mongoose";

// Schema structure for the likes collection
const likeSchema = new mongoose.Schema({
    likedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    postID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Posts'
    }
}, {
    timestamps: true
});

export const Like = mongoose.model('Likes', likeSchema);