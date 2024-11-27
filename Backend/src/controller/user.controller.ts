import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import ExceptionError from '../utils/exceptionError';
import catchAsync from '../utils/catchAsync';
import response from '../utils/respone';
import userService from '../services/user.service';
import { Request, Response } from 'express';

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'User created Successfully', user));
});

const getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.user.userId);
    if (!user) {
        throw new ExceptionError(StatusCodes.NOT_FOUND, 'User not found');
    }
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Successfully', user));
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updateUserById(req.user.userId, req.body);
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Successfully', user));
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.deleteUserById(req.params.userId);
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Successfully', user));
});

export default {
    createUser,
    getUser,
    updateUser,
    deleteUser,
};
