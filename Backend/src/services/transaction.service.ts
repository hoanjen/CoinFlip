import { Model } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import pick from '../utils/pick';
import ExceptionError from '../utils/exceptionError';
import Transaction from '../models/transaction.model';

type TransactionBody = {
    contractAddress: string;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    eventName: string;
    sender?: string;
    receiver?: string;
    blockTimeStamp: number;
    synchronize: string;
};

const createTransaction = async (transactionBody: TransactionBody) => {
    return await Transaction.create(transactionBody);
};

const getTransactionById = async (id: string) => {
    return await Transaction.findById(id);
};

export default { createTransaction, getTransactionById };
