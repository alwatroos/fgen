import { dirname, join } from "path";
import { DEFAULT_TEMPLATE_SRC_DIR_NAME, appConfig } from "../configs";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { TNamingPattern } from "../models";

export const debug = (...args: any) => {
  if (appConfig.debugMode) {
    console.debug("[DEBUG]", ...args);
  }
};

export const preparePath = (key: string, config: any) => {
  const value = config[key];
  if (value && typeof value === "string") {
    if (value.startsWith("/")) {
      (appConfig as any)[key] = value;
    } else {
      (appConfig as any)[key] = join(appConfig.workDir, value);
    }
  } else {
    (appConfig as any)[key] = join(appConfig.workDir, DEFAULT_TEMPLATE_SRC_DIR_NAME);
  }
};

export const convertStringToMatchNaming = (str: string, pattern: TNamingPattern) => {
  switch (pattern) {
    case "camel-case":
      return str.toCamelCase();
    case "kebab-case":
      return str.toKebabCase();
    case "pascal-case":
      return str.toPascalCase();
    default:
      return str;
  }
};

export const getAllFiles = function (dirPath: string, arrayOfFiles: string[] = []) {
  const files = readdirSync(dirPath);

  files.forEach(function (file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

export const writeFile = (filePath: string, data: string) => {
  try {
    const _dirname = dirname(filePath);
    const exist = existsSync(_dirname);
    if (!exist) {
      mkdirSync(_dirname, { recursive: true });
    }

    writeFileSync(filePath, data, "utf8");
  } catch (err: any) {
    throw new Error(err);
  }
};
