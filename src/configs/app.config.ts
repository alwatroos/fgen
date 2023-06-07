import { join, basename } from "path";
import { readdirSync, lstatSync, existsSync } from "fs";
import { IAppConfig } from "../models";
import { OptionValues } from "commander";
import { debug } from "../utils";
import { commands } from "../commands";
import {
  DEFAULT_CONFIG_NAME,
  DEFAULT_SRC_DIR_NAME,
  DEFAULT_TEMPLATE_SRC_DIR_NAME,
  WORK_DIR,
} from "./variables.config";

export const appConfig: IAppConfig = {
  workDir: __dirname,
  templateSrc: join(__dirname, DEFAULT_TEMPLATE_SRC_DIR_NAME),
  srcDir: join(__dirname, DEFAULT_SRC_DIR_NAME),
  debugMode: false,
  availableTemplates: [],
  fileNamePattern: "pascal-case",
  contentNamePattern: "camel-case",
};

export const setAppConfigDefaults = () => {
  appConfig.workDir = WORK_DIR;
  appConfig.templateSrc = join(WORK_DIR, DEFAULT_TEMPLATE_SRC_DIR_NAME);
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
