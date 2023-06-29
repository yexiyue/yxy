import type { Command } from "commander";
import { CommandInject } from "@yexiyue/command";
declare class InitCommand extends CommandInject {
    constructor(program: Command);
    get command(): string;
    get description(): string;
    action(name: string, opts: any): Promise<void>;
    get options(): ({
        flags: string;
        description: string;
        defaultValue: boolean;
    } | {
        flags: string;
        description: string;
        defaultValue?: undefined;
    })[];
}
export declare function Init(program: Command): InitCommand;
export {};
