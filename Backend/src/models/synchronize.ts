import mongoose, { Document, Model } from 'mongoose';

const synchronizeSchema = new mongoose.Schema(
    {
        fromBlock: {
            type: BigInt,
            required: true,
        },
        toBlock: {
            type: BigInt,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Synchronize = mongoose.model('Synchronize', synchronizeSchema);

export default Synchronize;
