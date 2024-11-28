import mongoose, { Document, Model } from 'mongoose';

const bettorSchema = new mongoose.Schema(
    {
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
        transactionHash: {
            type: String,
            required: true,
        },
        amount: {
            type: BigInt,
            required: true,
        },
        isHeads: {
            type: Boolean,
            required: true,
        },
        blockTimeStamp: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const Balance = mongoose.model('Bettor', bettorSchema);

export default Balance;
