import mongoose from "mongoose";
import { Post } from "../models/postSchema.js";
import { Like } from "../models/likeSchema.js";
import { Comment } from "../models/commentSchema.js";
import { CustomError } from "../error/customError.js";

// Function to create and store the feed in the DB
export const createAndStoreFeed = async (feedData, employeeDBId) => {
    const feed = new Post({
        ...feedData,
        createdBy: employeeDBId
    });
    await feed.save();
}

// Function to fetch the posts along with its comments
export const fetchFeedWithComments = async (email) => {
    // Dynamically constructing our aggregation pipeline for mongoDB query
    const aggregationPipeline = [
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'creator'
            }
        },
        { $unwind: '$creator' }
    ];
    if (email) {
        aggregationPipeline.push({
            $match: {
                'creator.email': email
            }
        });
    }
    aggregationPipeline.push({
        $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'postID',
            as: 'comments'
        }
    });
    // executing the dynamically built aggregation pipeline to fetch the final list
    return await Post.aggregate(aggregationPipeline).exec();
}

// Function to retrieve a feed by it's feedID
export const fetchFeedById = async (feedID) => {
    // checking if the feedID is not a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(feedID)) {
        throw new CustomError("Invalid feed ID format", 400);
    }
    return await Post.findById(feedID);
}

// Function to remove a feed
export const removeFeed = async (employeeDBId, feedID) => {
    if (!mongoose.Types.ObjectId.isValid(feedID)) {
        throw new CustomError("Invalid feed ID format", 400);
    }
    const postDetails = await Post.findById(feedID);
    if (!postDetails) {
        throw new CustomError("No feed is found", 404);
    }
    // checking if the created user is different from the current user
    if (postDetails.createdBy.toString() !== employeeDBId) {
        throw new CustomError("Access to delete this post is denied", 403);
    }
    await Comment.deleteMany({ postID: feedID }); // deleting the comments associated with the post
    await Like.deleteMany({ postID: feedID }); // deleting the likes associated with the post
    await Post.deleteOne({ _id: feedID });
}

// Function to toggle the status of like / unlike
export const toggleLikeStatus = async (employeeDBId, feedID) => {
    if (!mongoose.Types.ObjectId.isValid(feedID)) {
        throw new CustomError("Invalid feed ID format", 400);
    }
    const postDetails = await Post.findById(feedID);
    if (!postDetails) {
        throw new CustomError("No feed is found", 404);
    }
    const result = await Like.deleteOne({ likedBy: employeeDBId, postID: feedID });
    // checking if any document has been deleted and if not (i.e first time liking) then create a document in the likes collection
    if (result.deletedCount == 0) {
        const likeDoc = new Like({
            likedBy: employeeDBId,
            postID: feedID
        });
        await likeDoc.save();
    }
    return result.deletedCount;
}