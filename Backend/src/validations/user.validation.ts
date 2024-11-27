import Joi from 'joi';

export const createUser = {
    body: Joi.object().keys({
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string(),
    }),
};

export const updateUser = {
    body: Joi.object().keys({
        email: Joi.string().email(),
        username: Joi.string(),
        profileImage: Joi.string(),
    }),
};

export const getUsers = {
    query: Joi.object().keys({
        email: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

export const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string(),
    }),
};

export default {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
};
