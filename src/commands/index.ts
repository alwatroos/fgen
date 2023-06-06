import { ICommands } from "../models";
import { configCommand } from "./config.command";
import { generateCommand } from "./generate.command";
import { listCommand } from "./list.command";

export const commands: ICommands = {
  config: configCommand,
  generate: generateCommand,
  list: listCommand,
};
