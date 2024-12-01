import History from '../models/history-claim.model';
import ExceptionError from '../utils/exceptionError';
import { StatusCodes } from 'http-status-codes';
import bettingService from './betting.service';
import userService from './user.service';
import Bettor from '../models/bettor.model';

const createHistoryClaim = async (
    walletAddress: string,
    gameId: BigInt,
    amount: BigInt,
    blockTimeStamp: BigInt,
    transactionHash: string,
) => {
    const betting = await bettingService.getBettingByIdOnchain(gameId);
    const user = await userService.getUserByWalletAddress(walletAddress);
    const historyClaim = await History.create({
        amount,
        betting,
        blockTimeStamp,
        user,
        idBettingOnchain: gameId,
        transactionHash,
    });
    return historyClaim;
};

const getHistoryClaimByToken = async (userId: string) => {
    return await History.find({ user: userId }).sort({ createAt: -1 });
};

const getHistoryPlayPublic = async () => {
    const bettors = await Bettor.find().sort({ createAt: -1 }).limit(10);

    const bettorBlinds = bettors.map((bettor) => {
        const addressBlind = bettor.player.replace(bettor.player.slice(20), '********************');
        const transactionHash = bettor.transactionHash.replace(
            bettor.transactionHash.slice(20),
            '********************************************',
        );
        return { ...bettor.toObject(), player: addressBlind, transactionHash };
    });
    console.log(bettorBlinds);
    return bettorBlinds;
};

const getHistoryPlay = async (userId: string) => {
    const bettors = await Bettor.find({ user: userId }).sort({ createAt: -1 });

    return bettors;
};

export default { createHistoryClaim, getHistoryClaimByToken, getHistoryPlayPublic, getHistoryPlay };
