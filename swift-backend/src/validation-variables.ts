import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  FRONTEND_HOST: Joi.string().required(),
  FRONTEND_PORT: Joi.number().required(),
  PORT: Joi.number().default(3000)
});