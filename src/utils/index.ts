import { appConfig } from "../configs";

export const debug = (...args: any) => {
  if (appConfig.debugMode) {
    console.debug("[DEBUG]", ...args);
  }
};
