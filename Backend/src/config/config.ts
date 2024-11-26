import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    BASE_URL: Joi.string().default('http://localhost:8000'),
    PORT: Joi.number().default(8000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_DAYS: Joi.number().default(1).description('days after which which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(14).description('days after which refresh tokens expire'),
    BLOCK_NUMBER_START: Joi.number(),
    NETWORK_RPC_URL: Joi.string(),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

interface Config {
    env: string;
    base_url: string;
    port: number;
    mongoose: {
        url: string;
    };
    jwt: {
        secret: string;
        accessExpirationDays: number;
        refreshExpirationDays: number;
    };
    onchain?: {
        block_number_start?: number;
        network_rpc_url?: string;
    };
}

const config: Config = {
    env: envVars.NODE_ENV,
    base_url: envVars.BASE_URL,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    onchain: {
        block_number_start: envVars.BLOCK_NUMBER_START,
        network_rpc_url: envVars.NETWORK_RPC_URL,
    },
};

export default config;
