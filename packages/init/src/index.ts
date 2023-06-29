import type { Command } from "commander";
import { CommandInject } from "@yexiyue/command";
import { createTemplate } from "./createTemplate";
import { log } from "@yexiyue/utils";
import { downloadTemplate } from "./downloadTemplate";
import { installTemplate } from "./installTemplate";

/**
 * examples:
 * yxy init
 * yxy init zhangsan  -f -t project -tp template-vue3
 */

class InitCommand extends CommandInject {
  constructor(program: Command) {
    super(program);
  }
  get command(): string {
    return "init [name]";
  }

  get description(): string {
    return "init project";
  }
  async action(name: string, opts: any) {
    //1.选择项目模板,生成项目信息
    const selectedTemplate = await createTemplate(name, opts)
    log.verbose("template", selectedTemplate as any);
    //2.下载项目模板至缓存目录
    await downloadTemplate(selectedTemplate!.template as any);
    //3.安装项目模板至项目目录
    installTemplate({
      name: selectedTemplate!.name,
      type: selectedTemplate!.type,
      targetPath: selectedTemplate!.template.targetPath,
      npmName: selectedTemplate!.template.npmName!,
    },opts)
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
        description:"项目模板名称(template-vue3/template-react18)"
      }
    ];
  }
}

export function Init(program: Command) {
  return new InitCommand(program);
}
