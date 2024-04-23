import { ConfigModule, ConfigService } from "@nestjs/config";
import { IConfig } from "./config.interface";
import { Injectable, Logger} from "@nestjs/common";
import { GlobalConfig } from "./model/global.config";
import { GoogleConfig } from "./model/google.config";

@Injectable()
export class CoreConfigService {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(public readonly configService: ConfigService<IConfig, true>) {
    ConfigModule.envVariablesLoaded.then(() => {
      this.logger.debug("Environment variables loaded");
    });
  }

  public get global(): GlobalConfig {
    return this.configService.get<GlobalConfig>("global");
  }

  public get google(): GoogleConfig {
    return this.configService.get<GoogleConfig>("google");
  }
}
