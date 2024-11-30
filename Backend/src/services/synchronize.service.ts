import { Model } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import pick from '../utils/pick';
import ExceptionError from '../utils/exceptionError';
import Synchronize from '../models/synchronize'; // Assume this is the correct import

const createSynchronize = async (synchronizeBody: { fromBlock: number; toBlock: number }) => {
    return await Synchronize.create(synchronizeBody);
};

const getSynchronizeById = async (id: string) => {
    return await Synchronize.findById(id);
};

const getLastSynchronize = async () => {
    return await Synchronize.findOne().sort({ createdAt: -1 });
};

export default { createSynchronize, getLastSynchronize, getSynchronizeById };
