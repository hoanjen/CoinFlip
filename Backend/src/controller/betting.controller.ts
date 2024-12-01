import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import ExceptionError from '../utils/exceptionError';
import catchAsync from '../utils/catchAsync';
import response from '../utils/respone';
import { Request, Response } from 'express';
import bettingService from '../services/betting.service';

const queryBetting = catchAsync(async (req: Request, res: Response) => {
    const result = await bettingService.queryBetting(req.query);
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Successfully', result));
});

const getCurrentBetting = catchAsync(async (req: Request, res: Response) => {
    const result = await bettingService.getCurrentBetting();
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Successfully', result));
});

export default { queryBetting, getCurrentBetting };
