import express from 'express';
import { searchGlobally } from '../controllers/search.controller.js';

const searchRouter = express.Router();

searchRouter.get('/', searchGlobally);

export default searchRouter;