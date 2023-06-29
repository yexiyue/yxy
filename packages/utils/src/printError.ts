import { log } from "./log";
import { isDebug } from "./isDebug";

export function printError(error: any, type: string) {
  if (isDebug()) {
    log.error(type, error);
  } else {
    log.error(type, error.message);
  }
}
