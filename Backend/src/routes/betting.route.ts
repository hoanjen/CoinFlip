import express from 'express';
import validate from '../middleware/validate';
import bettingController from '../controller/betting.controller';
import bettingValidation from '../validations/betting.validation';

const bettingRouter = express.Router();

bettingRouter.route('/').get(validate(bettingValidation.getBettings), bettingController.queryBetting);
bettingRouter.route('/current').get(bettingController.getCurrentBetting);

export default bettingRouter;
