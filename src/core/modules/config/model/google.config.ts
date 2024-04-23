import { ConfigType, registerAs } from "@nestjs/config";
import * as Joi from 'joi';

export const googleValidationSchema = {
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  GOOGLE_SCOPES: Joi.string().required()
};

/**
 * @warning Only use this if config service is not available
 */
export const googleConfigRaw = () => {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURI: process.env.GOOGLE_CALLBACK_URL!.split(','),
    scopes: process.env.GOOGLE_SCOPES!.split(','),
  };
};

export const googleConfig = registerAs("google", googleConfigRaw);
export type GoogleConfig = ConfigType<typeof googleConfig>;
export const GoogleConfigKey = googleConfig.KEY;
