import Joi from 'joi';

export const signWallet = {
    body: Joi.object().keys({
        nonce: Joi.string(),
        walletAddress: Joi.string(),
        signature: Joi.string(),
    }),
};

export default {
    signWallet,
};
