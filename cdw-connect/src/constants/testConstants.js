export const FEED_CONTROLLER = {
    USERS: [
        {
            id: '12345',
            name: 'testuser1',
            email: 'test123@cdw.com'
        },
        {
            id: '12346',
            name: 'testuser2',
            email: 'test124@cdw.com'
        },
        {
            id: '12347',
            name: 'testuser3',
            email: 'test125@cdw.com'
        }
    ],
    FEEDS: [
        {
            id: '0001',
            title: 'Feed Title 1',
            location: 'chennai',
            feed: 'https://sample_feed_link1.com',
            caption: 'Caption of Feed 1',
            createdBy: '12345'
        },
        {
            id: '0002',
            title: 'Feed Title 2',
            location: 'chennai',
            feed: 'https://sample_feed_link2.com',
            caption: 'Caption of Feed 2',
            createdBy: '12346'
        },
        {
            id: '0003',
            title: 'Feed Title 3',
            location: 'chennai',
            feed: 'https://sample_feed_link3.com',
            caption: 'Caption of Feed 3',
            createdBy: '12347'
        }
    ],
    COMMENTS: [
        {
            id: '2000',
            comment: 'Sample comment 1',
            commentedBy: '12346',
            postID: '0001'
        }
    ]    
};

Object.seal(FEED_CONTROLLER);