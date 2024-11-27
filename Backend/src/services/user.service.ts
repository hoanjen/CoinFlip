import User from '../models/user.model';
import config from '../config/config';
import logger from '../config/logger';
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import pick from '../utils/pick';
import ExceptionError from '../utils/exceptionError';

const createUser = async (userBody: any) => {
    if (userBody.email && (await User.isEmailTaken(userBody.email))) {
        throw new ExceptionError(StatusCodes.BAD_REQUEST, 'Email already exists');
    }
    if (userBody.username && (await User.isUsernameTaken(userBody.username))) {
        throw new ExceptionError(StatusCodes.BAD_REQUEST, 'Username already exists');
    }

    return User.create({ ...userBody });
};

const getUserById = async (id: string) => {
    return User.findById(id);
};

const getUserByWalletAddress = async (walletAddress: string) => {
    return User.findOne({ walletAddress });
};

const getUserByEmail = async (email: string) => {
    return User.findOne({ email });
};

const updateUserById = async (userId: string, updateBody: any) => {
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

const deleteUserById = async (userId: string) => {
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
    getUserByWalletAddress,
};
