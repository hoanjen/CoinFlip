import User from '../models/user.model';
import { tokenTypes } from '../types/token.type';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { Request } from 'express';

interface PayLoad {
    userId: string;
    expires: Date;
    type: string;
}

interface AuthTokens {
    access: {
        token: string;
    };
    refresh: {
        token: string;
    };
}

const generateToken = (userId: string, expires: number, type: string, secret: string = config.jwt.secret): string => {
    const payload = {
        sub: userId,
        iat: Date.now(),
        exp: Date.now() + expires * 24 * 60 * 60,
        type,
    };
    return jwt.sign(payload, secret);
};

const verifyToken = async (token: string, type: string): Promise<PayLoad> => {
    const payload = jwt.verify(token, config.jwt.secret) as PayLoad;

    if (!payload) {
        throw new Error('Token not found');
    }
    return payload;
};

const generateAuthTokens = async (user: { id: string }): Promise<AuthTokens> => {
    const accessToken = generateToken(user.id, config.jwt.accessExpirationDays, tokenTypes.ACCESS_TOKEN);
    const refreshToken = generateToken(user.id, config.jwt.refreshExpirationDays, tokenTypes.REFRESH_TOKEN);

    return {
        access: {
            token: accessToken,
        },
        refresh: {
            token: refreshToken,
        },
    };
};

const extractTokenFromHeader = (request: Request): string | undefined => {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
};

export { generateToken, verifyToken, generateAuthTokens, extractTokenFromHeader };
