import express from 'express';
import { auth } from '../middleware/auth';
import validate from '../middleware/validate';
import userController from '../controller/user.controller';
import userValidation from '../validations/user.validation';

const userRouter = express.Router();

userRouter
    .route('/user')
    .get(auth, userController.getUser)
    .put(validate(userValidation.updateUser), auth, userController.updateUser);

userRouter.route('/').get(auth, userController.getUser);

export default userRouter;
