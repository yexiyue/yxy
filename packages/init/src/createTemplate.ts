import { log, makeInput, makeList, getLatestVersion } from "@yexiyue/utils";
import { homedir } from "os";
import path from "path";
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

export async function createTemplate(
  name: string,
  ops: { force: boolean; type?: string; template?: string }
) {
  let addType:string;
  //选择创建的类型
  if (ops.type) {
    addType = ops.type;
  } else {
    addType = await getAddType();
  }
  log.verbose("addType", addType);

  if (addType === ADD_TYPE_PROJECT) {
    //创建的目录名称
    let addName: string;
    if (name) {
      addName = name;
    } else {
      addName= await getAddName();
    }
    log.verbose("addName", addName);

    //要创建的模板

    let selectedTemplate
    if (ops.template) {
      selectedTemplate = ADD_TEMPLATE.find(
        (item) => item.value === ops.template
      )
      if (!selectedTemplate) {
        throw new Error(`项目模板${ops.template}不存在`)
      }
    } else {
      //选择项目模板
      const addTemplate = await getAddTemplate();
      selectedTemplate = ADD_TEMPLATE.find(
        (item) => item.value === addTemplate
      );
    }
    log.verbose("addTemplate", selectedTemplate);
    

    
    log.verbose("selectedTemplate", selectedTemplate as any);

    //获取该模板最新的版本号
    const latestVersion = await getLatestVersion(selectedTemplate?.npmName!);
    log.verbose("latestVersion", latestVersion);
    selectedTemplate!.version = latestVersion;

    //返回选择的数据
    return {
      type: addType,
      name: addName,
      template: {
        ...selectedTemplate,
        targetPath: makeTargetPath(),
      },
    };
  } else {
    throw new Error(`创建的项目类型${addType}不支持 仅支持project/page`)
    
  }
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
