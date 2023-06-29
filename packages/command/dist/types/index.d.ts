import type { Command } from 'commander';
export declare abstract class CommandInject {
    program: Command;
    constructor(program: Command);
    get command(): string;
    get description(): string;
    abstract action(...args: any[]): void;
    get options(): {
        flags: string;
        description: string;
        defaultValue?: any;
    }[];
    preAction(thisCommand: Command, actionCommand: Command): void;
    postAction(thisCommand: Command, actionCommand: Command): void;
}
