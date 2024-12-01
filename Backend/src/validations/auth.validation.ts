import Joi from 'joi';

const signWallet = {
    body: Joi.object().keys({
        nonce: Joi.string(),
        walletAddress: Joi.string(),
        signature: Joi.string(),
    }),
};

export default {
    signWallet,
};
