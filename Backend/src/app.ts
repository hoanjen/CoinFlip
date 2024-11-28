import express, { Request, Response } from 'express';
import router from './routes';
import helmet from 'helmet';
import morganMiddleware from './config/morgan';
import cors from 'cors';
import config from './config/config';
import ExceptionError from './utils/exceptionError';
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import { errorConverter, errorHandler } from './middleware/error';
import { getContractEvents } from './utils/synchronize';

const app = express();

if (config.env !== 'test') {
    app.use(morganMiddleware);
}

getContractEvents(7127342, 7127358);

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Express with TypeScript!');
});

app.use('/api', router);

app.use((req, res, next) => {
    next(new ExceptionError(StatusCodes.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
