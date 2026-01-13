export class Node {
    readonly name: string;
    readonly type: "taskQueue" | "service" | "workflow" | "activity" | "temporal";
    taskQueueName: string | null;
    serviceName: string | null;

    private children?: Node[];

    constructor(
        name: string,
        type: "taskQueue" | "service" | "workflow" | "activity" | "temporal",
        taskQueueName: string | null,
        serviceName: string | null,
    ) {
        this.name = name;
        this.type = type;
        this.taskQueueName = taskQueueName;
        this.serviceName = serviceName;
    }

    setServiceName(serviceName: string | null) {
        this.serviceName = serviceName;
    }

    addChild(node: Node | undefined = undefined) {
        if (node) {
            this.children = [...(this.children ?? []), node];
        }
    }

    getChildren(): Node[] {
        return this.children ?? [];
    }

    toJSON(): any {
        return {
            name: this.name,
            type: this.type,
            taskQueueName: this.taskQueueName,
            serviceName: this.serviceName,
            children: this.children?.map((child) => child.toJSON()) ?? [],
        };
    }
}
