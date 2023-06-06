import { AbstractCommand } from "../commands/abstract.command";

export type TNamingPattern = "kebab-case" | "camel-case" | "pascal-case";

export interface IVariables {
  [key: string]: string;
}

export interface ICommands {
  [key: string]: AbstractCommand<any>;
}

export interface IAppConfig {
  workDir: string;
  srcDir: string;
  templateSrc: string;
  configPath?: string;
  debugMode: boolean;
  variables?: IVariables;
  availableTemplates: string[];
  fileNamePattern: TNamingPattern;
  contentNamePattern: TNamingPattern;
}
