import { printError } from "@yexiyue/utils";


export function exception() {
  printError
  //捕捉常见错误
  process.on("uncaughtException", (e)=>printError(e,'error'));
  //捕捉promise异常
  process.on("unhandledRejection", (e)=>printError(e,'promise'));
}
