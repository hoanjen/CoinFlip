import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import ExceptionError from '../utils/exceptionError';
import catchAsync from '../utils/catchAsync';
import response from '../utils/respone';
import authService from '../services/auth.service';
import { Request, Response } from 'express';
import balanceService from '../services/balance.service';

const getBalance = catchAsync(async (req: Request, res: Response) => {
    const balance = await balanceService.getBalanceByToken(req.user.userId);
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Get Balance Successfully', balance));
});

export default { getBalance };
