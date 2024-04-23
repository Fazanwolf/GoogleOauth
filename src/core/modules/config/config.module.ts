import { Global, Module } from "@nestjs/common";
import { CoreConfigService } from "./config.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from 'joi';
import { globalConfig, globalValidationSchema } from "./model/global.config";
import { googleConfig, googleValidationSchema } from "./model/google.config";

const validConfigSchema = Joi.object({
  ...globalValidationSchema,
  ...googleValidationSchema,
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      cache: true,
      isGlobal: true,
      envFilePath: [".env"],
      load: [globalConfig, googleConfig],
      validationSchema: validConfigSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
        convert: true,
        presence: "required",
        debug: true,
      } as Joi.ValidationOptions,
    }),
  ],
  providers: [CoreConfigService, ConfigService],
  exports: [CoreConfigService, ConfigService],
})
export class CoreConfigModule {}
