import { join, basename } from "path";
import { readdirSync, lstatSync, existsSync } from "fs";
import { IAppConfig } from "../models";
import { OptionValues } from "commander";
import { debug } from "../utils";
import { commands } from "../commands";
import { DEFAULT_CONFIG_NAME } from "./variables.config";

export const appConfig: IAppConfig = {
  workDir: __dirname,
  templateSrc: join(__dirname, "templates/"),
  srcDir: join(__dirname, "src/"),
  debugMode: false,
  availableTemplates: [],
  fileNamePattern: "pascal-case",
  contentNamePattern: "camel-case"
};

export const completeConfiguration = (options: OptionValues) => {
  appConfig.debugMode = options.debug || false;

  debug("Input params => ", options);

  if (options.config) {
    commands.config?.execute(options.config);
  } else {
    commands.config?.execute(DEFAULT_CONFIG_NAME);
  }

  if (options.variable) {
    appConfig.variables = options.variable;
  }

  if (existsSync(appConfig.templateSrc)) {
    const dirs = readdirSync(appConfig.templateSrc)?.map((path) =>
      join(appConfig.templateSrc, path)
    );
    debug("Available components => ", dirs);
    appConfig.availableTemplates = dirs
      ?.filter((path) => lstatSync(path).isDirectory())
      .map((path) => basename(path).toLowerCase());
  }
  debug("appConfig aftert loading => ", appConfig);
};
