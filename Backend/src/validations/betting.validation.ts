import Joi from 'joi';

const getBettings = {
    query: Joi.object().keys({
        idBettingOnchain: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export default { getBettings };
