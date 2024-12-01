import Joi from 'joi';

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string(),
    }),
};

const updateUser = {
    body: Joi.object().keys({
        email: Joi.string().email(),
        username: Joi.string(),
        profileImage: Joi.string(),
    }),
};

const getUsers = {
    query: Joi.object().keys({
        email: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const deleteUser = {
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
