import express from 'express';
import { fetchFeeds, fetchFeed, createFeed, deleteFeed, toggleLike } from '../controllers/feed.controller.js';

const feedRouter = express.Router();

feedRouter.post('/', createFeed);

feedRouter.get('/', fetchFeeds);

feedRouter.get('/:feedID', fetchFeed);

feedRouter.delete('/:feedID', deleteFeed);

feedRouter.get('/toggleLike/:feedID', toggleLike);

export default feedRouter;