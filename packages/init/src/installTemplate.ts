import { log } from '@yexiyue/utils';
import fse from 'fs-extra'
import path from 'path';
import ora from 'ora';

export function installTemplate(
  {name,targetPath,npmName}: {
    type: string;
    name: string;
		targetPath: string;
		npmName: string;
  },
  { force = false }: { force: boolean }
) {
  const rootDir=process.cwd();
	fse.ensureDirSync(targetPath);
	const installDir = path.resolve(rootDir, name);
	log.verbose('installDir', installDir);

	if (fse.pathExistsSync(installDir)) {
		if (!force) {
			log.error('当前目录已存在该文件夹', installDir);
			return;
		} else {
			fse.removeSync(installDir);
			fse.ensureDirSync(installDir);
		}
	} else {
		fse.ensureDirSync(installDir);
	}

	copyFile(targetPath, npmName,installDir)
}

function copyFile(targetPath: string, npmName: string,installDir:string) {
	const originPath = getCacheFilePath(targetPath, npmName);
	log.verbose('originPath', originPath);

	const spinner=ora("拷贝模板中...").start();
	//拷贝模板到安装目录
	fse.copySync(originPath, installDir);
	spinner.stop();
	log.success("模板拷贝成功");
}

function getCacheFilePath(targetPath: string, npmName: string) {
	return path.resolve(targetPath,"node_modules", npmName,'template');
}
