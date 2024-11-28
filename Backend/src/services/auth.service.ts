import User from '../models/user.model';
import { tokenTypes } from '../types/token.type';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { Request } from 'express';
import crypto from 'crypto';
import { ethers } from 'ethers';
import ExceptionError from '../utils/exceptionError';
import { StatusCodes } from 'http-status-codes';
import tokenService from './token.service';
import userService from './user.service';
import balanceService from './balance.service';
import { getBalanceOnchain } from '../utils/synchronize';
const getNonce = async () => {
    const nonce = crypto.randomBytes(32).toString('hex');

    return nonce;
};

const signWallet = async (nonce: string, walletAddress: string, signature: string) => {
    const walletCheck = await ethers.verifyMessage(nonce, signature);
    if (walletCheck !== walletAddress) {
        throw new ExceptionError(StatusCodes.BAD_REQUEST, 'Invalid signature');
    }
    let user = await userService.getUserByWalletAddress(walletAddress);

    if (!user) {
        user = await userService.createUser({ walletAddress });
        const { nativeCoinQuantity, tokenAllowQuantity, tokenAllow, blockTimeStamp } = await getBalanceOnchain(
            walletAddress,
        );
        const balance = await balanceService.createBalance(
            user.id,
            'ETH',
            nativeCoinQuantity,

            tokenAllow,
            tokenAllowQuantity,
            'Sepolia Testnet',
            blockTimeStamp,
        );
    }
    const tokens = await tokenService.generateAuthTokens(user.id);

    return tokens;
};

export default { getNonce, signWallet };
