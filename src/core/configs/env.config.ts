import { registerAs, ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import {
  CommonConfigs,
  DatabaseConfigs,
  EmailConfigs,
  RedisConfigs,
} from '../types';

const common = registerAs<CommonConfigs>('common', () => ({
  port: +process.env.PORT,
  env: process.env.NODE_ENV,
  secret: process.env.JWT_SECRET,
}));

const database = registerAs<DatabaseConfigs>('db', () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
}));

const redis = registerAs<RedisConfigs>('redis', () => ({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
}));

const email = registerAs<EmailConfigs>('email', () => ({
  host: process.env.EMAIL_HOST,
  port: +process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
}));

export const EnvConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.string().required(),
    DB_TYPE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    NODE_ENV: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    EMAIL_USER: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
  }),
  load: [common, database, redis, email],
};
