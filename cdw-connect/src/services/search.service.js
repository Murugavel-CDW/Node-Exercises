import { Post } from "../models/postSchema.js";
import { User } from "../models/userSchema.js";

// Function to fetch records from users and posts based on the searchQuery argument
export const searchRecords = async (searchQuery) => {
    const userList = await User.find({
        $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { designation: { $regex: searchQuery, $options: 'i' } }
        ]
    });
    const postList = await Post.find({
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { caption: { $regex: searchQuery, $options: 'i' } }
        ]
    });
    return { userList, postList };
}