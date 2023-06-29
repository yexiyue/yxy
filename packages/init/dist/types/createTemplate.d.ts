export declare function createTemplate(name: string, ops: {
    force: boolean;
    type?: string;
    template?: string;
}): Promise<{
    type: string;
    name: string;
    template: any;
}>;
