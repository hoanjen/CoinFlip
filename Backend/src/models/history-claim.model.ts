import mongoose, { Document, Model } from 'mongoose';

const bettorSchema = new mongoose.Schema(
    {
        idBettingOnchain: {
            type: BigInt,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        betting: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Betting',
            required: true,
        },
        amount: {
            type: BigInt,
            required: true,
        },
        blockTimeStamp: {
            type: BigInt,
            required: true,
        },
    },
    { timestamps: true },
);

const Balance = mongoose.model('Bettor', bettorSchema);

export default Balance;