import express from 'express';
import { auth } from '../middleware/auth';
import validate from '../middleware/validate';
import userController from '../controller/user.controller';
import userValidation from '../validations/user.validation';

const userRouter = express.Router();

userRouter
    .route('/profile')
    .get(validate(userValidation.getUser), userController.getUser)
    .put(validate(userValidation.updateUser), userController.updateProfile);

userRouter.route('/').post(validate(userValidation.createUser), userController.createUser);

userRouter.route('/:userId');
//   .get(validate(userValidation.getUser), userController.getUser)

export default userRouter;
