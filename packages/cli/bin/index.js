#!/usr/bin/env node
import importLocal from "import-local";
import npmLog from "npmlog";
import entry from '../dist/index.js'
import { fileURLToPath } from "url";

if (importLocal(fileURLToPath(import.meta.url))) {
  npmLog.info("cli", "使用本地@yexiyue/cli 版本");
} else {
  entry(process.argv);
}
