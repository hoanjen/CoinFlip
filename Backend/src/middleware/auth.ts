import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import config from '../config/config';
import tokenService from '../services/token.service';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import ExceptionError from '../utils/exceptionError';
import { PayLoad } from '../types/user.interface';

declare global {
    namespace Express {
        interface Request {
            user: PayLoad;
        }
    }
}

const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = tokenService.extractTokenFromHeader(req);
    if (!token) {
        throw new ExceptionError(StatusCodes.UNAUTHORIZED, 'Not authorized');
    }
    try {
        const payload = jwt.verify(token, config.jwt.secret) as PayLoad;
        req.user = payload;
    } catch (error) {
        throw new ExceptionError(StatusCodes.UNAUTHORIZED, 'Token has expired');
    }

    next();
});

// authorize with role
// const authorize = (rolesAllow: number[]) => async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//         return next(new ExceptionError(StatusCodes.UNAUTHORIZED, 'Not authorized'));
//     }

//     for (const role of rolesAllow) {
//         const roleNow = await Role.findOne({ roleIndex: role });
//         const roleId = roleNow?._id.toString();
//         if (req.user.roles.includes(roleId)) {
//             return next();
//         }
//     }

//     return next(new ExceptionError(StatusCodes.FORBIDDEN, 'Not authorized'));
// };

export { auth };
