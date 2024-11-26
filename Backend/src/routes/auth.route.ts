import express from 'express';
import validate from '../middleware/validate';
import authController from '../controller/auth.controller';
import authValidation from '../validations/auth.validation';
const authRouter = express.Router();

authRouter.route('/').post(validate(authValidation.signWallet), authController.signWallet);
authRouter.route('/').get(authController.getNonce);

export default authRouter;
