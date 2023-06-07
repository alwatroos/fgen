import { FILE_NAME_VARIABLE, appConfig } from "../configs";
import { AbstractCommand } from "./abstract.command";
import { join } from "path";
import { readFileSync } from "fs";
import { render } from "ejs";
import {
  convertStringToMatchNaming,
  debug,
  getAllFiles,
  writeFile,
} from "../utils";

class GenerateCommnad extends AbstractCommand<string> {
  override execute(template: string): void {
    if (!appConfig.availableTemplates.includes(template.toLowerCase())) {
      console.error(
        `Template "${template}" isn't available!\nPlease create proper structure of directories to enable such template!`
      );
    }
    const templatePath = join(appConfig.templateSrc, template);
    const paths = getAllFiles(templatePath);
    debug("Files from template => ", paths);

    this.writeFiles(paths);
  }

  private get nameInFile() {
    if (appConfig.variables?.name) {
      return convertStringToMatchNaming(
        appConfig.variables.name,
        appConfig.contentNamePattern
      );
    }
    return null;
  }

  private get nameForFile() {
    if (appConfig.variables?.name) {
      return convertStringToMatchNaming(
        appConfig.variables.name,
        appConfig.fileNamePattern
      );
    }
    return null;
  }

  private writeFiles = (paths: string[]) => {
    paths.forEach((path) => {
      const rawContent = readFileSync(path, "utf-8");
      const converted = render(rawContent, {
        ...appConfig.variables,
        name: this.nameInFile || "",
      });
      let newFilePath = path.replaceAll(appConfig.templateSrc, "");
      if (this.nameForFile) {
        newFilePath = newFilePath.replaceAll(
          FILE_NAME_VARIABLE,
          this.nameForFile
        );
      }
      newFilePath = join(appConfig.srcDir, newFilePath);
      debug("Writing content to file => ", newFilePath);
      writeFile(newFilePath, converted);
    });
  };
}

export const generateCommand = new GenerateCommnad();
