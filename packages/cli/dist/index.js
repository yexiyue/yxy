import { program } from 'commander';
import { Init } from '@yexiyue/init';
import { log, printError } from '@yexiyue/utils';
import semver from 'semver';
import chalk from 'chalk';

var name = "@yexiyue/cli";
var version = "1.0.1";
var description = "a cli study demo by monorepo";
var main = "bin/index.js";
var bin = {
	yxy: "bin/index.js"
};
var scripts = {
	build: "node ../../build.js src/index.ts dist/index.js",
	dev: "pnpm -r run build && node ./bin/index.js",
	test: "vitest"
};
var keywords = [
];
var author = "yexiyue666";
var license = "ISC";
var files = [
	"bin",
	"dist"
];
var dependencies = {
	"@types/import-local": "^3.1.0",
	"@types/npmlog": "^4.1.4",
	"@types/semver": "^7.5.0",
	"@yexiyue/init": "workspace:*",
	"@yexiyue/utils": "workspace:*",
	chalk: "^5.2.0",
	commander: "^11.0.0",
	"import-local": "^3.1.0",
	npmlog: "^7.0.1",
	semver: "^7.5.3"
};
var type = "module";
var devDependencies = {
	execa: "^7.1.1"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	bin: bin,
	scripts: scripts,
	keywords: keywords,
	author: author,
	license: license,
	files: files,
	dependencies: dependencies,
	type: type,
	devDependencies: devDependencies
};

function createCli(argv) {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage("<command> [options]")
        .version(pkg.version)
        .option("-d, --debug", "是否开启调试模式", false)
        .hook("preAction", preAction);
    //监听debug属性
    program.on('option:debug', function () {
        if (program.opts().debug) {
            log.verbose('debug', 'debug模式启动');
        }
    });
    //监听未注册的命令
    program.on("command:*", function (ojb) {
        log.error("未知的命令：", ojb[0]);
    });
    Init(program);
    program.parse(argv);
}
//启动逻辑
function preAction() {
    checkNodeVersion();
}
var LOWEST_VERSION = "16.0.0";
//node 版本检查
function checkNodeVersion() {
    log.verbose("node version", process.version);
    if (!semver.gte(process.version, LOWEST_VERSION)) {
        throw new Error(chalk.red("yxy cli \u6700\u4F4E\u9700\u8981\u5B89\u88C5".concat(LOWEST_VERSION, "\u4EE5\u4E0A\u7248\u672C\u7684node")));
    }
}

function exception() {
    //捕捉常见错误
    process.on("uncaughtException", function (e) { return printError(e, 'error'); });
    //捕捉promise异常
    process.on("unhandledRejection", function (e) { return printError(e, 'promise'); });
}

function entry(argv) {
    exception();
    createCli(argv);
}

export { entry as default };
