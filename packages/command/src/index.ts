import type {Command} from 'commander'
export abstract class CommandInject {
  constructor(public program: Command) {
    if (!program) {
      throw new Error("command instance must not be none");
    }
    let cmd = program.command(this.command);
    cmd.hook("preAction", this.preAction);
    cmd.hook("postAction", this.postAction);

    if (this.options.length > 0) {
      this.options.forEach((value) => {
        cmd.option(value.flags, value.description, value.defaultValue);
      });
    }
    cmd.description(this.description);
    cmd.action(this.action);
  }

  get command(): string {
    throw new Error("command getter must be achieve");
  }

  get description(): string {
    throw new Error("description getter must be achieve");
  }

  abstract action(...args: any[]): void;

  get options(): { flags: string; description: string; defaultValue?: any }[] {
    return [];
  }

  preAction(thisCommand: Command, actionCommand: Command): void{

  };
  postAction(thisCommand: Command, actionCommand: Command): void{
    
  };
}
