import User from '../models/user.model';
import config from '../config/config';
import logger from '../config/logger';
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import pick from '../utils/pick';
import ExceptionError from '../utils/exceptionError';

interface UserBody {
    email: string;
    username?: string;
    password?: string;
    roles?: string[];
}

export const createUser = async (userBody: UserBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ExceptionError(StatusCodes.BAD_REQUEST, 'Email already exists');
    }

    return User.create({ ...userBody });
};

export const getUserById = async (id: string) => {
    return User.findById(id);
};

export const getUserByEmail = async (email: string) => {
    return User.findOne({ email });
};

export const updateUserById = async (userId: string, updateBody: UserBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ExceptionError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ExceptionError(StatusCodes.BAD_REQUEST, 'Email already exists');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

export const deleteUserById = async (userId: string) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ExceptionError(StatusCodes.NOT_FOUND, 'User not found');
    }
    await user.deleteOne();
    return user;
};

export default {
    createUser,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
