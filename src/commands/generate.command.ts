import { appConfig } from "../configs";
import { AbstractCommand } from "./abstract.command";
import { join, dirname } from "path";
import {
  readdirSync,
  lstatSync,
  readFileSync,
  writeFileSync,
  statSync,
  existsSync,
  mkdirSync,
} from "fs";
import { render } from "ejs";
import { debug } from "../utils";
import { IAppConfig, TNamingPattern } from "../models";

declare global {
  interface String {
    toCamelCase: () => string;
    toPascalCase: () => string;
    toKebabCase: () => string;
  }
}

String.prototype.toCamelCase = function () {
  return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, "");
};

String.prototype.toKebabCase = function () {
  return this.replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

String.prototype.toPascalCase = function () {
  const words = this.match(/[a-z]+/gi);
  if (!words) {
    return "";
  }
  return words
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join("");
};

const convertStringToMatchNaming = (str: string, pattern: TNamingPattern) => {
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

const getAllFiles = function (dirPath: string, arrayOfFiles: string[] = []) {
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

const writeFile = (filePath: string, data: string) => {
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

class GenerateCommnad extends AbstractCommand<string> {
  execute(template: string): void {
    if (!appConfig.availableTemplates.includes(template.toLowerCase())) {
      console.error(
        `Template "${template}" isn't available!\nPlease create proper structure of directories to enable such template!`
      );
    }
    const templatePath = join(appConfig.templateSrc, template);
    const paths = getAllFiles(templatePath);
    debug("Files from template => ", paths);

    let nameForFile: string | null = null;
    let nameInFile: string = "";

    if (appConfig.variables?.name) {
      nameForFile = convertStringToMatchNaming(
        appConfig.variables.name,
        appConfig.fileNamePattern
      );
      nameInFile = convertStringToMatchNaming(
        appConfig.variables.name,
        appConfig.contentNamePattern
      );
    }

    paths.forEach((path) => {
      const rawContent = readFileSync(path, "utf-8");
      const converted = render(rawContent, {
        ...appConfig.variables,
        name: nameInFile || "",
      });
      let newFilePath = path.replaceAll(appConfig.templateSrc, "");
      if (nameForFile) {
        newFilePath = newFilePath.replaceAll("_NAME_", nameForFile);
      }
      newFilePath = join(appConfig.srcDir, newFilePath);
      debug("Writing content to file => ", newFilePath);
      writeFile(newFilePath, converted);
    });
  }
}

export const generateCommand = new GenerateCommnad();
