import mongoose from 'mongoose';
import Logger from './logger';
import config from './config';
export default async function connect() {
    try {
        await mongoose.connect(config.mongoose.url);
        Logger.info('Connected to MongoDB');
    } catch (error) {
        Logger.info('Can not connected to MongoDB ');
    }
}
