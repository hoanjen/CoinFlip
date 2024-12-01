import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import response from '../utils/respone';
import { Request, Response } from 'express';
import historyClaimService from '../services/history-claim.service';

const getHistoryClaimByToken = catchAsync(async (req: Request, res: Response) => {
    const result = await historyClaimService.getHistoryClaimByToken(req.user.userId);
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Successfully', result));
});

const getHistoryPlayPublic = catchAsync(async (req: Request, res: Response) => {
    const result = await historyClaimService.getHistoryPlayPublic();
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Successfully', result));
});

const getHistoryPlay = catchAsync(async (req: Request, res: Response) => {
    const result = await historyClaimService.getHistoryPlay(req.user.userId);
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Successfully', result));
});

export default { getHistoryClaimByToken, getHistoryPlayPublic, getHistoryPlay };
