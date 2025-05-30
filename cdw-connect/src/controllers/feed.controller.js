import { createAndStoreFeed, fetchFeedById, fetchFeedWithComments, removeFeed, toggleLikeStatus } from "../services/feed.service.js";

// Function to create a post 
export const createFeed = async (request, response, next) => {
    try {
        const { employeeDBId } = request.user;
        const feedData = request.body;
        await createAndStoreFeed(feedData, employeeDBId);
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
        const feedDetails = await fetchFeedById(feedID);
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
        await removeFeed(employeeDBId, feedID);
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
        const deletedCount = await toggleLikeStatus(employeeDBId, feedID);
        response.status(200).json({
            message: `${deletedCount === 0 ? "Comment liked successfully" : "Comment unliked successfully"}`
        });
    } catch (error) {
        next(error);
    }
}