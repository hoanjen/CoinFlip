import User from '../models/user.model';
import { tokenTypes } from '../types/token.type';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { Request } from 'express';
import crypto from 'crypto';
import { ethers } from 'ethers';
import ExceptionError from '../utils/exceptionError';
import { StatusCodes } from 'http-status-codes';
const getNonce = async () => {
    const nonce = crypto.randomBytes(32).toString('hex');

    return nonce;
};

const signWallet = async (nonce: string, walletAddress: string, signature: string) => {
    const walletCheck = await ethers.verifyMessage(nonce, signature);
    if (walletCheck !== walletAddress) {
        throw new ExceptionError(StatusCodes.BAD_REQUEST, 'Invalid signature');
    }
    return walletCheck;
};

export default { getNonce, signWallet };
