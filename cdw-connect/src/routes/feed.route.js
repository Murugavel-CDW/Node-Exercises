import express from 'express';
import { fetchFeeds, fetchFeed, createFeed, deleteFeed, toggleLike } from '../controllers/feed.controller.js';
import { validateFeedData } from '../middlewares/feedValidator.js';

const feedRouter = express.Router();

feedRouter.post('/', validateFeedData, createFeed);

feedRouter.get('/', fetchFeeds);

feedRouter.get('/:feedID', fetchFeed);

/**
 * @swagger
 * /feeds:
 *   delete:
 *     summary: Feed Removal
 *     description: Deletes the feed with it's id matching to the id passed in the params.
 *     parameters:
 *       - in: path
 *         name: feedID
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the feed to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The Feed is deleted successfully.
 *       400:
 *         description: Invalid feedID format received.
 *       403:
 *          description: The user does not have the permission to delete the feed.
 *       404:
 *         description: The specified feed is not found.
 *       500:
 *         description: In case of any unexpected error from the server.
 */
feedRouter.delete('/:feedID', deleteFeed);

feedRouter.get('/toggleLike/:feedID', toggleLike);

export default feedRouter;