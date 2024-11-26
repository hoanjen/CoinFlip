import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import config from '../config/config';
import logger from '../config/logger';
import ExceptionError from '../utils/exceptionError';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction): void => {
    const statusCode: number =
        err.statusCode || (err instanceof mongoose.Error ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR);
    const message = err.message || getReasonPhrase(statusCode) || 'Internal Server Error';

    next(err instanceof ExceptionError ? err : new ExceptionError(statusCode, message, false, err.stack));
};

const errorHandler = (err: ExceptionError, req: Request, res: Response, _: NextFunction): void => {
    const statusCode =
        config.env === 'production' && !err.isOperational ? StatusCodes.INTERNAL_SERVER_ERROR : err.statusCode;

    const message =
        config.env === 'production' && !err.isOperational
            ? getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) || 'Internal Server Error'
            : err.message;

    res.locals.errorMessage = err.message;

    if (config.env === 'development') logger.error(err);

    res.status(statusCode).send({
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    });
};

export { errorConverter, errorHandler };
