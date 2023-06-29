import {rollup} from 'rollup'
import path from 'path';
import commonJs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json'

async function build() {
  //获取入口和输出文件位置
  const args = process.argv.slice(2);
  const dir = process.cwd();
  
	const bundle = await rollup({
    input: path.resolve(dir, args[0] || "src/index.ts"),
    plugins: [
      typescript(),
      json()
      /* commonJs({
				extensions:[".js",".ts"]
			}), */
      //nodeResolve(),
    ],
    /* external: [
      "commander"
    ], */
    
  });

	await bundle.write({
		format: 'esm',
    file: path.relative(dir, args[1] || "dist/index.js"),
		//banner:"#!/usr/bin/env node"
	})
}

build()