import log from 'npmlog';
export { default as log } from 'npmlog';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

function isDebug() {
    return process.argv.includes("--debug") || process.argv.includes("-d");
}

if (isDebug()) {
    log.level = "verbose";
}
else {
    log.level = "info";
}
log.heading = "yxy";
log.addLevel("success", 2000, {
    fg: "green",
    bold: true,
});

function getDirnameAndFilename(str) {
    const filename = fileURLToPath(import.meta.url);
    return {
        filename,
        dirname: path.dirname(filename)
    };
}

function make(options) {
    const { name = "name" } = options;
    return inquirer.prompt(options).then(answer => answer[name]);
}
function makeList(params) {
    return make(params);
}
function makeInput(params) {
    return make(params);
}

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

//使用fetch获取输入包名在npm上最新的版本号
function getLatestVersion(npmName) {
    return __awaiter(this, void 0, void 0, function* () {
        //对包名进行url编码
        const encodedName = encodeURIComponent(npmName);
        //进行请求获取包相关信息
        const res = yield fetch(`https://registry.npmjs.org/${encodedName}`);
        if (!res.ok) {
            log.error('error', `Failed to fetch latest version for ${npmName}`);
            throw new Error(`Failed to fetch latest version for ${npmName}`);
        }
        //请求成功把json数据进行解析
        const res_1 = yield res.json();
        if (!res_1 || !res_1["dist-tags"] || !res_1["dist-tags"].latest) {
            log.error('error', `Failed to get latest version for ${npmName}`);
            throw new Error(`Failed to get latest version for ${npmName}`);
        }
        return res_1["dist-tags"].latest;
    });
}

function printError(error, type) {
    if (isDebug()) {
        log.error(type, error);
    }
    else {
        log.error(type, error.message);
    }
}

export { getDirnameAndFilename, getLatestVersion, isDebug, makeInput, makeList, printError };
