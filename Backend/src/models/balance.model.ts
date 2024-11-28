import mongoose, { Document, Model } from 'mongoose';
import { StringDecoder } from 'string_decoder';
import validator from 'validator';

const balanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        network: {
            type: String,
            required: true,
        },
        tokenAllow: {
            type: String,
            required: true,
        },
        tokenAllowQuantity: {
            type: String,
            required: true,
        },
        nativeCoin: {
            type: String,
            default: 'ETH',
            required: false,
        },
        nativeCoinQuantity: {
            type: BigInt,
            required: true,
        },
        blockTimeStamp: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const Balance = mongoose.model('Balance', balanceSchema);

export default Balance;
