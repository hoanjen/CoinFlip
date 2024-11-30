import mongoose, { Document, Model, Schema } from 'mongoose';

const transactionSchema = new Schema(
    {
        contractAddress: {
            type: String,
            required: true,
        },
        transactionHash: {
            type: String,
            required: true,
        },
        blockHash: {
            type: String,
            required: true,
        },
        blockNumber: {
            type: BigInt,
            required: true,
        },
        eventName: {
            type: String,
            required: true,
        },
        sender: {
            type: String,
        },
        receiver: {
            type: String,
        },
        blockTimeStamp: {
            type: BigInt,
            required: true,
        },
        synchronize: {
            type: Schema.Types.ObjectId,
            ref: 'Synchronize',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
