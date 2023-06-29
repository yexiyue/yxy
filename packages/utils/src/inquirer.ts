import inquirer from 'inquirer';
import type { QuestionMap } from "inquirer"

function make(options:any) {
    const { name = "name" } = options;
    
    return inquirer.prompt(options).then(answer=>answer[name])
}

export function makeList(params:QuestionMap["list"]) {
    return make(params)
}

export function makeInput(params: QuestionMap["input"]) {
  return make(params);
}
