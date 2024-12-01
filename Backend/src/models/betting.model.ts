import mongoose, { Document, Model } from 'mongoose';
import paginate from './plugins/paginate.plugin';

interface PaginateOptions {
    sortBy?: string;
    populate?: string;
    limit?: number;
    page?: number;
}

interface PaginateResult<T> {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}

interface BettingDocument extends Document {
    idBettingOnchain: string;
    gameOver: string;
    result?: boolean;
    startBlock: string;
    endBlock?: string;
    blockTimeStamp: string;
}

interface BettingModel extends Model<BettingDocument> {
    paginate(filter: any, options: PaginateOptions): Promise<PaginateResult<BettingDocument>>;
}

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

bettingSchema.plugin(paginate);

const Betting = mongoose.model<BettingDocument, BettingModel>('Betting', bettingSchema);

export default Betting;
