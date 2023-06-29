import { program } from "commander";
import pkg from "../package.json";
import { Init } from "@yexiyue/init";
import { log } from "@yexiyue/utils";
import semver from "semver";
import chalk from "chalk";

export function createCli(argv: string[]) {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .hook("preAction", preAction);

  //监听debug属性
  program.on('option:debug', () => {
    if (program.opts().debug) {
      log.verbose('debug','debug模式启动')
    }
  })
  
  //监听未注册的命令
  program.on("command:*",  (ojb)=>{
    log.error("未知的命令：",ojb[0])
  })
  
  Init(program);

  program.parse(argv);
}
//启动逻辑
function preAction() {
	checkNodeVersion()
}

const LOWEST_VERSION = "16.0.0";

//node 版本检查
function checkNodeVersion() {
  log.verbose("node version", process.version);
  if (!semver.gte(process.version, LOWEST_VERSION)) {
    throw new Error(
      chalk.red(`yxy cli 最低需要安装${LOWEST_VERSION}以上版本的node`)
    );
  }
}