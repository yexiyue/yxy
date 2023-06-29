import { expect, test,assert } from 'vitest'
import {execa} from 'execa'
import path from 'path'
import {version} from '../package.json'

const CLI = path.join(__dirname, '../bin/index.js');
const bin = () => (...args:any[]) => execa(CLI,args);

test("run error command", async () => {
    const {stderr} =await bin()('iii')
    expect(stderr).toContain("未知的命令： iii");
})

test("should not throw error when use --help", async() => {
    let error = null;
    try {
        await bin()('--help')
    } catch (err) {
        error=err
    }

    expect(error).toBe(null);
})

test("show correct version", async () => {
    const { stdout } = await bin()("-V")
    
    expect(stdout).toContain(version)
})

test("open debug mode", async () => {
    let e = null;
    try {
        await bin()("-d");
    } catch (error:any) {
        e=error
    }
    expect(e.message).toContain("debug模式启动");
}) 