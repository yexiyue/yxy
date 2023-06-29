class CommandInject {
    constructor(program) {
        this.program = program;
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
    get command() {
        throw new Error("command getter must be achieve");
    }
    get description() {
        throw new Error("description getter must be achieve");
    }
    get options() {
        return [];
    }
    preAction(thisCommand, actionCommand) {
    }
    ;
    postAction(thisCommand, actionCommand) {
    }
    ;
}

export { CommandInject };
