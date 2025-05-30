import { jest, test, expect, describe, afterEach, beforeEach } from '@jest/globals';
import { CustomError } from '../error/customError.js';
import { FEED_CONTROLLER } from '../constants/testConstants.js';

// Creating a test array for users, comments, feed and likes
let users = [...FEED_CONTROLLER.USERS];

let feedsArray = [...FEED_CONTROLLER.FEEDS];

let commentsArray = [...FEED_CONTROLLER.COMMENTS];

let likesArray = [];

// Mocking the service module that contains the DB operations
jest.unstable_mockModule('../services/feed.service.js', () => {
    return {
        createAndStoreFeed: jest.fn(async (feedData, employeeDBId) => {
            const newFeed = { ...feedData, createdBy: employeeDBId };
            feedsArray.push(newFeed);
        }),
        fetchFeedWithComments: jest.fn(async (email) => {
            let feeds = feedsArray;
            feeds = feeds.map((feed) => {
                const userDetails = users.find((user) => user.id === feed.createdBy);
                const comments = commentsArray.filter((comment) => comment.postID === feed.id);
                return { ...feed, creator: { ...userDetails }, comments };
            });
            if (email) {
                feeds = feeds.filter((feed) => feed.creator.email === email);
            }
            return feeds;
        }),
        fetchFeedById: jest.fn(async (feedID) => {
            const feedDetails = feedsArray.find((feed) => feed.id === feedID);
            return feedDetails;
        }),
        removeFeed: jest.fn(async (employeeDBId, feedID) => {
            const feedIndex = feedsArray.findIndex((feed) => feed.id === feedID);
            if (feedIndex === -1) {
                throw new CustomError("No feed is found", 404);
            }
            const feedDetails = feedsArray[feedIndex];
            if (feedDetails.createdBy !== employeeDBId) {
                throw new CustomError("Access to delete this post is denied", 403);
            }
            commentsArray = commentsArray.filter((comment) => comment.postID !== feedDetails.id);
            likesArray = likesArray.filter((like) => like.postID !== feedDetails.id);
            feedsArray.splice(feedIndex, 1);
        }),
        toggleLikeStatus: jest.fn()
    }
});

const { createAndStoreFeed, fetchFeedWithComments, fetchFeedById, removeFeed, toggleLikeStatus } =
    await import('../services/feed.service.js');

describe('Feed controller Integration', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    const mockNext = jest.fn();

    describe('createFeed Controller', () => {
        const mockRequest = {
            user: {
                employeeDBId: '12345'
            },
            body: {
                id: '0005',
                title: 'Feed Title 5',
                location: 'chennai',
                feed: 'https://sample_feed_link5.com',
                caption: 'Caption of Feed 5'
            }
        };
        
        test('should return succesfull message when the feed is created', async () => {
            const { createFeed } = await import('../controllers/feed.controller.js');
            await createFeed(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Feed created successfully"
            });
        });

        test('should call next with an error when the service fails', async () => {
            const error = new Error("Post Link is required");
            createAndStoreFeed.mockRejectedValueOnce(error);

            const { createFeed } = await import('../controllers/feed.controller.js');
            await createFeed(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('fetchFeeds Controller', () => {

        const mockRequest = {
            query: {}
        };

        test('should return feeds along with its comments', async () => {
            feedsArray = [...FEED_CONTROLLER.FEEDS];
            const expectedResult = [
                {
                    id: '0001',
                    title: 'Feed Title 1',
                    location: 'chennai',
                    feed: 'https://sample_feed_link1.com',
                    caption: 'Caption of Feed 1',
                    createdBy: '12345',
                    creator: {
                        id: '12345',
                        name: 'testuser1',
                        email: 'test123@cdw.com'
                    },
                    comments: [
                        {
                            id: '2000',
                            comment: 'Sample comment 1',
                            commentedBy: '12346',
                            postID: '0001'
                        }
                    ]
                },
                {
                    id: '0002',
                    title: 'Feed Title 2',
                    location: 'chennai',
                    feed: 'https://sample_feed_link2.com',
                    caption: 'Caption of Feed 2',
                    createdBy: '12346',
                    creator: {
                        id: '12346',
                        name: 'testuser2',
                        email: 'test124@cdw.com'
                    },
                    comments:[]
                },
                {
                    id: '0003',
                    title: 'Feed Title 3',
                    location: 'chennai',
                    feed: 'https://sample_feed_link3.com',
                    caption: 'Caption of Feed 3',
                    createdBy: '12347',
                    creator: {
                        id: '12347',
                        name: 'testuser3',
                        email: 'test125@cdw.com'
                    },
                    comments:[]
                }
            ];
            const { fetchFeeds } = await import('../controllers/feed.controller.js');
            await fetchFeeds(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                feedList: expectedResult
            });
        });

        test('should return feeds that match the query filter', async () => {
            mockRequest.query.email = 'test123@cdw.com';
            const expectedResult = [
                {
                    id: '0001',
                    title: 'Feed Title 1',
                    location: 'chennai',
                    feed: 'https://sample_feed_link1.com',
                    caption: 'Caption of Feed 1',
                    createdBy: '12345',
                    creator: {
                        id: '12345',
                        name: 'testuser1',
                        email: 'test123@cdw.com'
                    },
                    comments: [
                        {
                            id: '2000',
                            comment: 'Sample comment 1',
                            commentedBy: '12346',
                            postID: '0001'
                        }
                    ]
                }
            ];

            const { fetchFeeds } = await import('../controllers/feed.controller.js');
            await fetchFeeds(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                feedList: expectedResult
            });
        })

        test("should return no feeds to display when there's no feeds", async () => {
            feedsArray = [];
            const { fetchFeeds } = await import('../controllers/feed.controller.js');
            await fetchFeeds(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "No feeds to display"
            });
        });

        test('should call next with an error when the service fails', async () => {
            const error = new Error("Unexpected DB Error");
            fetchFeedWithComments.mockRejectedValueOnce(error);

            const { fetchFeeds } = await import('../controllers/feed.controller.js');
            await fetchFeeds(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('fetchFeed Controller', () => {
        const mockRequest = {
            params: {
                feedID: '0001'
            }
        };

        test('should return the feed not found when no feed with the id is found', async () => {
            const { fetchFeed } = await import('../controllers/feed.controller.js');
            await fetchFeed(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "No such feed found"
            });
        });

        test('should return the feed that has the id passed in the params', async () => {
            feedsArray = [...FEED_CONTROLLER.FEEDS];
            const expectedResult = {
                id: '0001',
                title: 'Feed Title 1',
                location: 'chennai',
                feed: 'https://sample_feed_link1.com',
                caption: 'Caption of Feed 1',
                createdBy: '12345'
            };
            const { fetchFeed } = await import('../controllers/feed.controller.js');
            await fetchFeed(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                feedDetails: expectedResult
            });
        });

        test('should call next with an error when the service fails', async () => {
            const error = new Error("Unexpected DB Error");
            fetchFeedById.mockRejectedValueOnce(error);

            const { fetchFeed } = await import('../controllers/feed.controller.js');
            await fetchFeed(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe("deleteFeed Controller", () => {
        const mockRequest = {
            user: {
                employeeDBId: '12345'
            },
            params: {
                feedID: '0003'
            }
        };

        test('should deny permission to delete when the user is not same', async () => {
            const { deleteFeed } = await import('../controllers/feed.controller.js');
            await deleteFeed(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new CustomError("Access to delete this post is denied", 403));
        });

        test('should delete the feed successfully', async () => {
            mockRequest.params.feedID = '0001';
            const { deleteFeed } = await import('../controllers/feed.controller.js');
            await deleteFeed(mockRequest, mockResponse, mockNext);
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Post deleted successfully"
            });
        });

        test('should return feed not found when there is no feed with the given id', async () => {
            const { deleteFeed } = await import('../controllers/feed.controller.js');
            await deleteFeed(mockRequest, mockResponse, mockNext);
            
            expect(mockNext).toHaveBeenCalledWith(new CustomError("No feed is found", 404));
        });

        test('should call next with an error when the service fails', async () => {
            const error = new Error("Unexpected DB Error");
            removeFeed.mockRejectedValueOnce(error);

            const { deleteFeed } = await import('../controllers/feed.controller.js');
            await deleteFeed(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
})
