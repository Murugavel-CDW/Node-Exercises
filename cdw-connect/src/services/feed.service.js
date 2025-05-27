import mongoose from "mongoose";
import { Post } from "../models/postSchema.js";
import { Like } from "../models/likeSchema.js";
import { CustomError } from "../error/customError.js";

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
                '$creator.email': email
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
    const feedList = await Post.aggregate(aggregationPipeline).exec();
    return feedList;
}

// Function to toggle the status of like / unlike
export const toggleLikeStatus = async (employeeDBId, feedID) => {
    // checking if feedID is not a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(feedID)) {
        throw new CustomError("Invalid feed ID format", 400);
    }
    const result = await Like.deleteOne({ likedBy: employeeDBId, postID: feedID });
    // checking if any document has been deleted and if not (i.e first time liking) then create a document in the likes collection
    if (!result.deletedCount == 0) {
        const likeDoc = new Like({
            likedBy: employeeDBId,
            postID: feedID
        });
        await likeDoc.save();
    }
}