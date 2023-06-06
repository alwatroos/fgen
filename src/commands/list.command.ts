import { appConfig } from "../configs";
import { AbstractCommand } from "./abstract.command";

class ListCommand extends AbstractCommand<void> {
  execute(): void {
    console.log(
      `\nList of available templates: [${appConfig.availableTemplates.join(
        ", "
      )}]\n`
    );
  }
}

export const listCommand = new ListCommand();
