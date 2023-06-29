import { CommandInject } from '@yexiyue/command';
import { log, getLatestVersion, makeList, makeInput, printError } from '@yexiyue/utils';
import { homedir } from 'os';
import path from 'path';
import { pathExistsSync } from 'path-exists';
import fse, { mkdirpSync } from 'fs-extra';
import ora from 'ora';
import { execa } from 'execa';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const ADD_TEMPLATE = [
    {
        name: "vue3项目模板",
        value: "template-vue3",
        npmName: "@yexiyue.com/template-vue3",
        version: "1.0.0",
    },
    {
        name: "react18项目模板",
        value: "template-react18",
        npmName: "@yexiyue.com/template-react18",
        version: "1.0.0",
    },
];
const ADD_TYPE_PROJECT = "project";
const ADD_TYPE_PAGE = "page";
const ADD_TYPE = [
    {
        name: "项目",
        value: ADD_TYPE_PROJECT,
    },
    {
        name: "页面",
        value: ADD_TYPE_PAGE,
    },
];
const TEMP_CATCH = ".yxy-temp";
function createTemplate(name, ops) {
    return __awaiter(this, void 0, void 0, function* () {
        let addType;
        //选择创建的类型
        if (ops.type) {
            addType = ops.type;
        }
        else {
            addType = yield getAddType();
        }
        log.verbose("addType", addType);
        if (addType === ADD_TYPE_PROJECT) {
            //创建的目录名称
            let addName;
            if (name) {
                addName = name;
            }
            else {
                addName = yield getAddName();
            }
            log.verbose("addName", addName);
            //要创建的模板
            let selectedTemplate;
            if (ops.template) {
                selectedTemplate = ADD_TEMPLATE.find((item) => item.value === ops.template);
                if (!selectedTemplate) {
                    throw new Error(`项目模板${ops.template}不存在`);
                }
            }
            else {
                //选择项目模板
                const addTemplate = yield getAddTemplate();
                selectedTemplate = ADD_TEMPLATE.find((item) => item.value === addTemplate);
            }
            log.verbose("addTemplate", selectedTemplate);
            log.verbose("selectedTemplate", selectedTemplate);
            //获取该模板最新的版本号
            const latestVersion = yield getLatestVersion(selectedTemplate === null || selectedTemplate === void 0 ? void 0 : selectedTemplate.npmName);
            log.verbose("latestVersion", latestVersion);
            selectedTemplate.version = latestVersion;
            //返回选择的数据
            return {
                type: addType,
                name: addName,
                template: Object.assign(Object.assign({}, selectedTemplate), { targetPath: makeTargetPath() }),
            };
        }
        else {
            throw new Error(`创建的项目类型${addType}不支持 仅支持project/page`);
        }
    });
}
//获取创建类型
function getAddType() {
    return makeList({
        name: "name",
        choices: ADD_TYPE,
        default: ADD_TYPE_PROJECT,
        message: "请选择初始化项目类型",
        type: "list",
    });
}
//获取项目名称
function getAddName() {
    return makeInput({
        name: "name",
        message: "请输入项目名称",
        type: "input",
        validate: (value) => {
            if (value.length) {
                return true;
            }
            return "项目名称不能数为空";
        },
    });
}
//获取选项的项目模板
function getAddTemplate() {
    return makeList({
        name: "name",
        choices: ADD_TEMPLATE,
        default: ADD_TEMPLATE[0],
        message: "请选择项目模板",
        type: "list",
    });
}
//安装的缓存目录
function makeTargetPath() {
    return path.resolve(homedir(), TEMP_CATCH, "addTemplate");
}

//下载项目模板
function downloadTemplate(template) {
    return __awaiter(this, void 0, void 0, function* () {
        //创建缓存目录
        makeCacheDir(template.targetPath);
        const spinner = ora("正在下载模板...").start();
        try {
            yield downloadAddTemplate(template.targetPath, template);
            spinner.stop();
            log.success("下载成功");
        }
        catch (error) {
            spinner.stop();
            printError(error, "模板下载失败");
        }
    });
}
//创建缓存目录，必须先创建不然后面execa执行npm install不生效
function makeCacheDir(targetPath) {
    const cacheDir = getCacheDir(targetPath);
    log.verbose("cacheDir", cacheDir);
    if (!pathExistsSync(cacheDir)) {
        mkdirpSync(cacheDir);
    }
}
//获取缓存目录
function getCacheDir(targetPath) {
    return path.resolve(targetPath, "node_modules");
}
//根据目录路径和模板信息下载模板
function downloadAddTemplate(targetPath, { npmName, version }) {
    return __awaiter(this, void 0, void 0, function* () {
        const installCommand = 'npm';
        const installArgs = ['install', `${npmName}@${version}`];
        const cwd = targetPath;
        yield execa(installCommand, installArgs, { cwd });
    });
}

function installTemplate({ name, targetPath, npmName }, { force = false }) {
    const rootDir = process.cwd();
    fse.ensureDirSync(targetPath);
    const installDir = path.resolve(rootDir, name);
    log.verbose('installDir', installDir);
    if (fse.pathExistsSync(installDir)) {
        if (!force) {
            log.error('当前目录已存在该文件夹', installDir);
            return;
        }
        else {
            fse.removeSync(installDir);
            fse.ensureDirSync(installDir);
        }
    }
    else {
        fse.ensureDirSync(installDir);
    }
    copyFile(targetPath, npmName, installDir);
}
function copyFile(targetPath, npmName, installDir) {
    const originPath = getCacheFilePath(targetPath, npmName);
    log.verbose('originPath', originPath);
    const spinner = ora("拷贝模板中...").start();
    //拷贝模板到安装目录
    fse.copySync(originPath, installDir);
    spinner.stop();
    log.success("模板拷贝成功");
}
function getCacheFilePath(targetPath, npmName) {
    return path.resolve(targetPath, "node_modules", npmName, 'template');
}

class InitCommand extends CommandInject {
    constructor(program) {
        super(program);
    }
    get command() {
        return "init [name]";
    }
    get description() {
        return "init project";
    }
    action(name, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            //1.选择项目模板,生成项目信息
            const selectedTemplate = yield createTemplate(name, opts);
            log.verbose("template", selectedTemplate);
            //2.下载项目模板至缓存目录
            yield downloadTemplate(selectedTemplate.template);
            //3.安装项目模板至项目目录
            installTemplate({
                name: selectedTemplate.name,
                type: selectedTemplate.type,
                targetPath: selectedTemplate.template.targetPath,
                npmName: selectedTemplate.template.npmName,
            }, opts);
        });
    }
    get options() {
        return [
            {
                flags: "-f,--force",
                description: "是否强制更新",
                defaultValue: false,
            },
            {
                flags: "-t,--type <type>",
                description: "项目类型(project/page)",
            },
            {
                flags: "-tp,--template <template>",
                description: "项目模板名称(template-vue3/template-react18)"
            }
        ];
    }
}
function Init(program) {
    return new InitCommand(program);
}

export { Init };
