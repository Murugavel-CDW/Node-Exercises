import mongoose from "mongoose";
import { Post } from "../models/postSchema.js"
import { fetchFeedWithComments, toggleLikeStatus } from "../services/feed.service.js";
import { Comment } from "../models/commentSchema.js";

// Function to create a post 
export const createFeed = async (request, response, next) => {
    try {
        const { employeeDBId } = request.user;
        const feedData = request.body;
        const feed = new Post({
            ...feedData,
            createdBy: employeeDBId
        });
        await feed.save();
        response.status(201).json({
            message: "Feed created successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Function to fetch all posts created in the app
export const fetchFeeds = async (request, response, next) => {
    try {
        const { email } = request.query;
        const feedList = await fetchFeedWithComments(email);
        if (feedList.length == 0) {
            return response.status(200).json({
                message: "No feeds to display"
            });
        }
        response.status(200).json({ feedList });
    } catch (error) {
        next(error);
    }
}

// Function to fetch a specific post by it's post id
export const fetchFeed = async (request, response, next) => {
    try {
        const { feedID } = request.params;
        const feedDetails = await Post.findById(feedID);
        if (!feedDetails) {
            return response.status(404).json({
                message: "No such feed found"
            });
        }
        response.status(200).json({ feedDetails });
    } catch (error) {
        next(error);
    }
}

// Function to delete a post
export const deleteFeed = async (request, response, next) => {
    try {
        const { employeeDBId } = request.user;
        const { feedID } = request.params;
        // checking if the feedID is not a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(feedID)) {
            return response.status(400).json({
                message: "Invalid feed ID format"
            });
        }
        const postDetails = await Post.findById(feedID);
        if (!postDetails) {
            return response.status(404).json({
                message: "No feed is found"
            });
        }
        // checking if the created user is different from the current user
        if (postDetails.createdBy.toString() !== employeeDBId) {
            return response.status(403).json({
                error: "Access to delete this post is denied"
            });
        }
        await Comment.deleteMany({ postID: feedID }); // deleting the comments associated with the post
        await Post.deleteOne({ _id: feedID });
        response.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

// Function to replicate the like / unlike functionality for a post
export const toggleLike = async (request, response, next) => {
    try {
        const { employeeDBId } = request.user;
        const { feedID } = request.params;
        await toggleLikeStatus(employeeDBId, feedID);
        response.status(200).json({
            message: "Comment liked successfully"
        });
    } catch (error) {
        next(error);
    }
}