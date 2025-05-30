import mongoose from "mongoose";
import { Comment } from "../models/commentSchema.js";
import { Post } from "../models/postSchema.js";
import { CustomError } from "../error/customError.js";

// Function to create and store the comment in the DB
export const createAndStoreComment = async (employeeDBId, postID, commentData) => {
    // checking if the postID is not a valid ObjectID
    if (!mongoose.Types.ObjectId.isValid(postID)) {
        throw new CustomError("Invalid post ID format", 400);
    }
    const postDetails = await Post.findById(postID);
    if (!postDetails) {
        throw new CustomError("No such post found", 404);
    }
    const comment = new Comment({
        ...commentData,
        commentedBy: employeeDBId,
        postID
    });
    await comment.save();
}

// Function to remove the comment from the DB
export const removeComment = async (employeeDBId, commentID) => {
    if (!mongoose.Types.ObjectId.isValid(commentID)) {
        throw new CustomError("Invalid comment ID format", 400);
    }
    const commentDetails = await Comment.findById(commentID);
    if (!commentDetails) {
        throw new CustomError("No such comment exists", 404);
    }
    // checking if the user trying to delete and the created owner are different
    if (commentDetails.commentedBy.toString() !== employeeDBId) {
        throw new CustomError("Access to delete this comment is denied", 403);
    }
    await Comment.deleteOne({ _id: commentID });
}