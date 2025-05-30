import { jest, test, expect, describe, afterEach, beforeEach } from '@jest/globals';
import { CustomError } from '../error/customError.js';
import { FEED_CONTROLLER } from '../constants/testConstants.js';

// Creating a test array for users, comments, feed and likes
let users = [...FEED_CONTROLLER.USERS];

let feedsArray = [...FEED_CONTROLLER.FEEDS];

let commentsArray = [...FEED_CONTROLLER.COMMENTS];

let likesArray = [];

jest.unstable_mockModule('../services/feed.service.js', () => {
    return {
        createAndStoreFeed: jest.fn(),
        fetchFeedWithComments: jest.fn(),
        fetchFeedById: jest.fn(),
        removeFeed: jest.fn(),
        toggleLikeStatus: jest.fn(async (employeeDBId, feedID) => {
            const feedDetails = feedsArray.find((feed) => feed.id === feedID);
            if (!feedDetails) {
                throw new CustomError("No feed is found", 404);
            }
            const likeDetailsIndex = likesArray.findIndex((like) => like.postID === feedID && like.likedBy === employeeDBId);
            if (likeDetailsIndex === -1) {
                likesArray.push({
                    likedBy: employeeDBId,
                    postID: feedID
                });
            } else {
                likesArray.splice(likeDetailsIndex, 1);
            }
            return likeDetailsIndex === -1 ? 0 : 1;
        })
    }
});

jest.unstable_mockModule('../services/comment.service.js', () => {
    return {
        createAndStoreComment: jest.fn(async (employeeDBId, postID, commentData) => {
            const feedDetails = feedsArray.find((feed) => feed.id === postID);
            if (!feedDetails) {
                throw new CustomError("No such post found", 404);
            }
            commentsArray.push({
                ...commentData,
                commentedBy: employeeDBId,
                postID
            });
        }),
        removeComment: jest.fn(async (employeeDBId, commentID) => {
            const commentIndex = commentsArray.findIndex((comment) => comment.id === commentID);
            if (commentIndex === -1) {
                throw new CustomError("No such comment exists", 404);
            }
            const commentDetails = commentsArray[commentIndex];
            if (commentDetails.commentedBy !== employeeDBId) {
                throw new CustomError("Access to delete this comment is denied", 403);
            }
            commentsArray.splice(commentIndex, 1);
        })
    }
});

const { toggleLikeStatus } = await import('../services/feed.service.js');

const { createAndStoreComment, removeComment } = await import('../services/comment.service.js');

describe('Comments and Likes Controllers Integration', () => {
    afterEach(() => {
        jest.clearAllMocks();
        users = [...FEED_CONTROLLER.USERS];
        feedsArray = [...FEED_CONTROLLER.FEEDS];
        commentsArray = [...FEED_CONTROLLER.COMMENTS];
    });

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    const mockNext = jest.fn();

    describe('createComment Controller', () => {
        const mockRequest = {
            user: {
                employeeDBId: '12345'
            },
            params: {
                postID: '0002'
            },
            body: {
                id: '2001',
                comment: 'Sample comment 2'
            }
        };

        test('should create comment comment successfully', async () => {
            const { createComment } = await import('../controllers/comment.controller.js');
            await createComment(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Comment created successfully"
            });
        });

        test('should throw error when no such post with the passed id is found', async () => {
            mockRequest.params.postID = '0005';
            const { createComment } = await import('../controllers/comment.controller.js');
            await createComment(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new CustomError("No such post found", 404));
        });

        test('should call next() when service fails', async () => {
            const error = new Error("Unexpected DB error");
            createAndStoreComment.mockRejectedValueOnce(error);

            const { createComment } = await import('../controllers/comment.controller.js');
            await createComment(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('removeComment Controller', () => {
        const mockRequest = {
            user: {
                employeeDBId: '12346'
            },
            params: {
                commentID: '2000'
            }
        };

        test('should delete comment successfully', async () => {
            const { deleteComment } = await import('../controllers/comment.controller.js');
            await deleteComment(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Comment deleted successfully"
            });
        });

        test("should display permission denied when trying to delete another user's comment", async () => {
            mockRequest.user.employeeDBId = 12345;
            const { deleteComment } = await import('../controllers/comment.controller.js');
            await deleteComment(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new CustomError("Access to delete this comment is denied", 403));
        });

        test('should display comment not found when no such comment with commentID exists', async () => {
            mockRequest.params.commentID = '20001';
            const { deleteComment } = await import('../controllers/comment.controller.js');
            await deleteComment(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new CustomError("No such comment exists", 404));
        });

        test('should call next() when service fails', async () => {
            const error = new Error("Unexpected DB error");
            removeComment.mockRejectedValueOnce(error);

            const { deleteComment } = await import('../controllers/comment.controller.js');
            await deleteComment(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('likeFeed Controller', () => {
        const mockRequest = {
            user: {
                employeeDBId: '12345'
            },
            params: {
                feedID: '0002'
            }
        };

        test('Should like the feed successfully', async () => {
            const { toggleLike } = await import('../controllers/feed.controller.js');
            await toggleLike(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Comment liked successfully"
            });
        });

        test('Should unlike the feed successfully', async () => {
            const { toggleLike } = await import('../controllers/feed.controller.js');
            await toggleLike(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Comment unliked successfully"
            });
        });

        test('should display no feed is found when a feed with the passed id is not present', async () => {
            mockRequest.params.feedID = '0007';
            const { toggleLike } = await import('../controllers/feed.controller.js');
            await toggleLike(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new CustomError("No feed is found", 404));
        });

        test('should call next() when service fails', async () => {
            const error = new Error("Unexpected DB error");
            toggleLikeStatus.mockRejectedValueOnce(error);

            const { toggleLike } = await import('../controllers/feed.controller.js');
            await toggleLike(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
})