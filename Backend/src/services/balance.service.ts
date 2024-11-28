import crypto from 'crypto';
import { ethers } from 'ethers';
import ExceptionError from '../utils/exceptionError';
import { StatusCodes } from 'http-status-codes';
import tokenService from './token.service';
import userService from './user.service';
import Balance from '../models/balance.model';
import config from '../config/config';
const getBalanceByToken = async (userId: string) => {
    const balance = await Balance.findOne({ user: userId });
    return balance;
};

const createBalance = async (
    userId: string,
    nativeCoin: string,
    nativeCoinQuantity: BigInt,
    tokenAllow: string,
    tokenAllowQuantity: BigInt,
    network: string,
    blockTimeStamp: number,
) => {
    return await Balance.create({
        blockTimeStamp,
        nativeCoinQuantity,
        nativeCoin,
        network,
        tokenAllow,
        tokenAllowQuantity,
        user: userId,
    });
};

export default { getBalanceByToken, createBalance };
