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
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const Balance = mongoose.model('Betting', bettingSchema);

export default Balance;
