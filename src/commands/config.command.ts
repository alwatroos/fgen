import { appConfig } from "../configs";
import { AbstractCommand } from "./abstract.command";
import { join } from "path";
import { existsSync } from "fs";
import { debug } from "../utils";
import { IAppConfig } from "../models";

class ConfigCommnad extends AbstractCommand<string> {
  execute(configPath: string): void {
    let customConfigPath = "";
    if (configPath.startsWith("/")) {
      customConfigPath = configPath;
    } else {
      debug("Joining path => ", { workDir: appConfig.workDir, configPath });
      customConfigPath = join(appConfig.workDir, configPath);
    }
    if (existsSync(customConfigPath)) {
      const customConfig = require(customConfigPath);
      Object.keys(customConfig).forEach(
        (key) => ((appConfig as any)[key] = customConfig[key])
      );
      appConfig.configPath = customConfigPath;
      this.proceedTemplateSrc(customConfig);
      this.proceedSrcDir(customConfig);
    } else {
      console.error(
        `\nConfig path "${customConfigPath}" doesn't exists!\nUsing default config!\n`
      );
    }
  }

  private proceedTemplateSrc = (config: IAppConfig) =>
    this.preparePath("templateSrc", config);

  private proceedSrcDir = (config: IAppConfig) =>
    this.preparePath("srcDir", config);

  private preparePath = (key: string, config: any) => {
    const value = config[key];
    if (value && typeof value === "string") {
      if (value.startsWith("/")) {
        (appConfig as any)[key] = value;
      } else {
        (appConfig as any)[key] = join(appConfig.workDir, value);
      }
    } else {
      (appConfig as any)[key] = join(appConfig.workDir, "templates/");
    }
  };
}

export const configCommand = new ConfigCommnad();
