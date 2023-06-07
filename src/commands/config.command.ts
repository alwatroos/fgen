import { appConfig } from "../configs";
import { AbstractCommand } from "./abstract.command";
import { join } from "path";
import { existsSync } from "fs";
import { debug, preparePath } from "../utils";
import { IAppConfig } from "../models";

class ConfigCommnad extends AbstractCommand<string> {
  execute(configPath: string): void {
    const customConfigPath = this.resolveConfigPath(configPath);

    if (existsSync(customConfigPath)) {
      return this.proceedCustomConfig(customConfigPath);
    }
    console.error(
      `\nConfig path "${customConfigPath}" doesn't exists!\nUsing default config!\n`
    );
  }

  private proceedCustomConfig = (customConfigPath: string) => {
    const customConfig = require(customConfigPath);
    Object.keys(customConfig).forEach(
      (key) => ((appConfig as any)[key] = customConfig[key])
    );
    appConfig.configPath = customConfigPath;
    this.proceedTemplateSrc(customConfig);
    this.proceedSrcDir(customConfig);
  };

  private resolveConfigPath = (configPath: string) => {
    if (configPath.startsWith("/")) {
      return configPath;
    }
    debug("Joining path => ", { workDir: appConfig.workDir, configPath });
    return join(appConfig.workDir, configPath);
  };

  private proceedTemplateSrc = (config: IAppConfig) =>
    preparePath("templateSrc", config);

  private proceedSrcDir = (config: IAppConfig) => preparePath("srcDir", config);
}

export const configCommand = new ConfigCommnad();
