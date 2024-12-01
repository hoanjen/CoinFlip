import userService from './user.service';
import Betting from '../models/betting.model';
import Bettor from '../models/bettor.model';
import pick from '../utils/pick';

const createBetting = async (
    sender: string,
    gameId: BigInt,
    startBlock: BigInt,
    endBlock: BigInt,
    blockTimeStamp: BigInt,
) => {
    await Betting.create({ gameOver: false, startBlock, endBlock, idBettingOnchain: gameId, blockTimeStamp });
};

const queryBetting = async (bettingQuery: any) => {
    const filter = pick(bettingQuery, ['idBettingOnchain']);
    const options = pick(bettingQuery, ['sortBy', 'limit', 'page', 'populate']);
    if (bettingQuery.createdAt) {
        const dateValue = bettingQuery.createdAt;
        let dateStart = new Date(dateValue.split('/')[0]);
        let dateEnd = new Date(dateValue.split('/')[1]);
        dateEnd.setDate(dateEnd.getDate() + 1);
        filter['createdAt'] = { $gte: dateStart, $lte: dateEnd };
    }
    return await Betting.paginate(filter, options);
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
    await Bettor.create({
        amount,
        blockTimeStamp,
        isHeads,
        transactionHash,
        betting: betting?.id,
        user: user?.id,
        player: sender,
    });
};

const getBettingByIdOnchain = async (gameId: BigInt) => {
    return await Betting.findOne({ idBettingOnchain: gameId });
};

const getCurrentBetting = async () => {
    return await Betting.findOne().sort({ createdAt: -1 });
};

export default { createBetting, createBettor, updateBetting, getBettingByIdOnchain, queryBetting, getCurrentBetting };
