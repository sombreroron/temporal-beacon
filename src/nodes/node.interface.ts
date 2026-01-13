export interface INode {
    name: string;
    type: "taskQueue" | "service" | "workflow" | "activity";
    taskQueueName: string | null;
    serviceName: string | null;
    addChild(node: INode): void;
    getChildren(): INode[];
    toJSON(): any;
}

export interface Edge {
    id: string;
    from: INode;
    to: INode;
    type: string;
    metadata: {
        [key: string]: any;
    };
}
