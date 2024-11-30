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
import Betting from '../models/betting.model';
import Bettor from '../models/bettor.model';

const createBetting = async (
    sender: string,
    gameId: BigInt,
    startBlock: BigInt,
    endBlock: BigInt,
    blockTimeStamp: BigInt,
) => {
    await Betting.create({ gameOver: false, startBlock, endBlock, idBettingOnchain: gameId, blockTimeStamp });
};

const updateBetting = async (gameId: BigInt) => {
    await Betting.updateOne({ idBettingOnchain: gameId }, { $set: { gameOver: true } });
};

const createBettor = async (
    sender: string,
    gameId: BigInt,
    amount: BigInt,
    isHeads: boolean,
    blockTimeStamp: BigInt,
    transactionHash: string,
) => {
    const betting = await Betting.findOne({ idBettingOnchain: gameId });
    const user = await userService.getUserByWalletAddress(sender);
    await Bettor.create({ amount, blockTimeStamp, isHeads, transactionHash, betting: betting?.id, user: user?.id });
};

export default { createBetting, createBettor, updateBetting };
