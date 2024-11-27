import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import ExceptionError from '../utils/exceptionError';
import catchAsync from '../utils/catchAsync';
import response from '../utils/respone';
import authService from '../services/auth.service';
import { Request, Response } from 'express';

const getNonce = catchAsync(async (req: Request, res: Response) => {
    const nonce = await authService.getNonce();
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Get Nonce Successfully', nonce));
});

const signWallet = catchAsync(async (req: Request, res: Response) => {
    const tokens = await authService.signWallet(req.body.nonce, req.body.walletAddress, req.body.signature);
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Login Successfully', tokens));
});

export default { signWallet, getNonce };
