import { createAndStoreComment, removeComment } from "../services/comment.service.js";

// Function to create a comment for a post
export const createComment = async (request, response, next) => {
    try {
        const { employeeDBId } = request.user;
        const { postID } = request.params;
        const commentData = request.body;
        await createAndStoreComment(employeeDBId, postID, commentData);
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
        await removeComment(employeeDBId, commentID);
        response.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}