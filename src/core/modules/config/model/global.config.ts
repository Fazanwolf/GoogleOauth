import { ConfigType, registerAs } from "@nestjs/config";
import * as Joi from 'joi';

export const globalValidationSchema = {
  HOSTNAME: Joi.string().hostname(),
  PORT: Joi.number(),
  DEPLOY_SWAGGER: Joi.boolean(),
};

/**
 * @warning Only use this if config service is not available
 */
export const globalConfigRaw = () => {
  return {
    hostname: process.env.HOSTNAME || "127.0.0.1",
    port: parseInt(process.env.PORT || "3000", 10),
    deploySwagger: (process.env.DEPLOY_SWAGGER ?? "true") === "true",
  };
};

export const globalConfig = registerAs("global", globalConfigRaw);
export type GlobalConfig = ConfigType<typeof globalConfig>;
export const GlobalConfigKey = globalConfig.KEY;
