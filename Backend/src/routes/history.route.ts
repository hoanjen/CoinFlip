import express from 'express';
import validate from '../middleware/validate';
import historyController from '../controller/history.controller';
import { auth } from '../middleware/auth';

const historyRouter = express.Router();

historyRouter.route('/claim').get(auth, historyController.getHistoryClaimByToken);
historyRouter.route('/play').get(historyController.getHistoryPlayPublic);
historyRouter.route('/play-auth').get(auth, historyController.getHistoryPlayPublic);

export default historyRouter;
