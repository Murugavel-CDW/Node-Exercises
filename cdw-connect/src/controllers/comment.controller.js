import mongoose from "mongoose";
import { Comment } from "../models/commentSchema.js";

// Function to create a comment for a post
export const createComment = async (request, response, next) => {
    try {
        const { employeeDBId } = request.user;
        const { postID } = request.params;
        const commentData = request.body;
        const comment = new Comment({
            ...commentData,
            commentedBy: employeeDBId,
            postID
        });
        await comment.save();
        response.status(201).json({
            message: "Comment created successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Function to delete a comment for a post
export const deleteComment = async (request, response, next) => {
    try {
        const { employeeDBId } = request.user;
        const { commentID } = request.params;
        // if the comment id is not a valid ObjectID
        if (!mongoose.Types.ObjectId.isValid(commentID)) {
            return response.status(400).json({
                message: "Invalid comment ID format"
            });
        }
        const commentDetails = await Comment.findById(commentID);
        if (!commentDetails) {
            return response.status(404).json({
                message: "No such comment exists"
            });
        }
        // checking if the user trying to delete and the created owner are different
        if (commentDetails.commentedBy.toString() !== employeeDBId) {
            return response.status(403).json({
                error: "Access to delete this comment is denied"
            });
        }
        await Comment.deleteOne({ _id: commentID });
        response.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}