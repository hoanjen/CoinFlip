import mongoose, { Document, Model } from 'mongoose';

const bettingSchema = new mongoose.Schema(
    {
        idBettingOnchain: {
            type: BigInt,
            required: true,
        },
        gameOver: {
            type: String,
            required: true,
        },
        result: {
            type: Boolean,
            required: false,
        },
        startBlock: {
            type: BigInt,
            required: true,
        },
        endBlock: {
            type: BigInt,
            required: false,
        },
        blockTimeStamp: {
            type: BigInt,
            required: true,
        },
    },
    { timestamps: true },
);

const Betting = mongoose.model('Betting', bettingSchema);

export default Betting;
