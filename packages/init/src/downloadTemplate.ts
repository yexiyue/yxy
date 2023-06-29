import { printError } from "@yexiyue/utils";
import path from "path";
import { pathExistsSync } from "path-exists";
import { mkdirpSync } from "fs-extra";
import { log } from "@yexiyue/utils";
import ora from "ora";
import {execa} from 'execa'

//下载项目模板
export async function downloadTemplate(template: {
  version: string;
  npmName: string;
  targetPath: string;
}) {
  //创建缓存目录
  makeCacheDir(template.targetPath);
  const spinner = ora("正在下载模板...").start();
  try {
    await downloadAddTemplate(template.targetPath, template);
    spinner.stop();
    log.success("下载成功");
  } catch (error: any) {
    spinner.stop();
    printError(error, "模板下载失败");
  }
}

//创建缓存目录，必须先创建不然后面execa执行npm install不生效
function makeCacheDir(targetPath: string) {
  const cacheDir = getCacheDir(targetPath);
  log.verbose("cacheDir", cacheDir);
  if (!pathExistsSync(cacheDir)) {
    mkdirpSync(cacheDir);
  }
}
//获取缓存目录
function getCacheDir(targetPath: string) {
  return path.resolve(targetPath, "node_modules");
}

//根据目录路径和模板信息下载模板
async function downloadAddTemplate(
	targetPath: string,
	{ npmName, version }: { npmName: string; version: string }
) {
	const installCommand = 'npm'
	const installArgs = ['install', `${npmName}@${version}`]
	const cwd = targetPath
	await execa(installCommand, installArgs, { cwd });
}
