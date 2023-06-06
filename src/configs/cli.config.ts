import { Command } from "commander";
import { IVariables } from "../models";

const packageJson = require("../../package.json");


const collectVariables = (value: string, previous: IVariables) => {
  const splitted = (value || "").split("=");
  const result: IVariables = {};
  if (splitted.length < 2) {
    return previous;
  }
  if (splitted.length == 2) {
    result[splitted[0]] = splitted[1];
  } else {
    result[splitted[0]] = splitted.slice(1).join("=");
  }
  return { ...previous, ...result };
};

export const program = new Command()
  .version(packageJson.version)
  .description(
    "FGEN is a CLI created with passion to make developer's life easier and make possibility to create files with commands using predefined files by him/her!"
  )
  .option("-d, --debug", "Debug mode")
  .option(
    "-c, --config <path>",
    "Path to fgen config => fgen.config.json (if not passed then using default config)"
  )
  .option("-g, --generate <template>", "List directory contents")
  .option("-ls, --list", "Lists all available templates")
  .option("-v, --variable <value>", "repeatable value", collectVariables, {});
