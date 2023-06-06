#! /usr/bin/env node
import { textSync as figletTextSync } from "figlet";
import { WORK_DIR, appConfig, completeConfiguration, program } from "./configs";
import { commands } from "./commands";
import { join } from "path";

appConfig.workDir = WORK_DIR;
appConfig.templateSrc = join(WORK_DIR, "templates");
console.log(
  figletTextSync(
    "_________________\n\n| FGEN  BY  ALWATROOS |\n_________________\n"
  )
);

program.parse(process.argv);

const options = program.opts();

completeConfiguration(options);

Object.keys(commands)
  .filter((key) => !["config", "generate"].includes(key))
  .forEach((key) => options[key] && commands[key]?.execute(options[key]));

if (!options.list) {
  commands.generate.execute(options.generate);
}
