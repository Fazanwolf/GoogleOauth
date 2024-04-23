import { GlobalConfig } from "./model/global.config";
import { GoogleConfig } from "./model/google.config";

export interface IConfig {
  global: GlobalConfig;
  google: GoogleConfig;
}
