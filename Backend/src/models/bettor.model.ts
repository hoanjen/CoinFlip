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
        player: {
            type: String,
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
            type: BigInt,
            required: true,
        },
    },
    { timestamps: true },
);

bettorSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.amount = ret.amount.toString();
        ret.blockTimeStamp = ret.blockTimeStamp.toString();
        return ret;
    },
});

const Bettor = mongoose.model('Bettor', bettorSchema);

export default Bettor;
