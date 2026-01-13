import {
    ActivityDto,
    ActivityInputDto,
    ActivityOutputDto,
    TemporalRegistryResponseDto,
    WorkflowDto,
} from "./temporal-registry-response.dto";

interface WorkflowItem {
    name: string;
    taskQueue: string;
    serviceName: string | null;
    activities: Array<{ name: string; taskQueue: string }>;
    childWorkflows: Array<{ name: string; taskQueue: string }>;
}

interface ActivityItem {
    name: string;
    serviceName: string | null;
    taskQueue?: string;
    usedIn: Array<{ workflowName: string; workflowTaskQueue: string }>;
    input?: ActivityInputDto[];
    output?: ActivityOutputDto | null;
}

export class TemporalRegistryManager {
    readonly name: string = "temporal";
    readonly type: string = "temporal";
    readonly taskQueue: string = "";
    private workflows: WorkflowItem[] = [];
    private activities: ActivityItem[] = [];

    constructor(private temporalRegistryResponses: TemporalRegistryResponseDto[]) {
        this.organize();
    }

    organize() {
        const workflowMap = new Map<string, WorkflowItem>();
        const activitySet = new Map<string, ActivityItem>();

        this.temporalRegistryResponses.forEach((temporalRegistryResponse) => {
            const { serviceName, components: { workflows = [], activities = [] } = {} } = temporalRegistryResponse;

            // Process workflows
            workflows.forEach((workflow: WorkflowDto) => {
                const workflowKey = `${workflow.taskQueue}-${workflow.name}`;

                // Get or create workflow item
                let workflowItem = workflowMap.get(workflowKey);
                if (!workflowItem) {
                    workflowItem = {
                        name: workflow.name ?? "",
                        taskQueue: workflow.taskQueue,
                        serviceName: serviceName,
                        activities: [],
                        childWorkflows: [],
                    };
                    workflowMap.set(workflowKey, workflowItem);
                }

                // Add activities as simple references
                workflow.activities.forEach((activity) => {
                    const taskQueue = activity.taskQueue ? activity.taskQueue : workflow.taskQueue;
                    if (workflowItem) {
                        workflowItem.activities.push({
                            name: activity.name,
                            taskQueue: taskQueue,
                        });
                    }
                });

                // Add child workflows as simple references
                workflow.childWorkflows?.forEach((childWorkflow: WorkflowDto) => {
                    if (workflowItem) {
                        workflowItem.childWorkflows.push({
                            name: childWorkflow.name ?? "",
                            taskQueue: childWorkflow.taskQueue,
                        });
                    }
                });
            });

            // Create activities directly from the activities array
            activities.forEach((activity: ActivityDto) => {
                const activityKey = `${activity.taskQueue}-${activity.name}`;
                if (!activitySet.has(activityKey)) {
                    activitySet.set(activityKey, {
                        name: activity.name,
                        taskQueue: activity.taskQueue,
                        serviceName: serviceName,
                        usedIn: [],
                        input: activity.input,
                        output: activity.output,
                    });
                }
            });
        });

        // Convert workflow map to array
        this.workflows = Array.from(workflowMap.values());

        // Convert activity set to array
        this.activities = Array.from(activitySet.values());

        // Build "usedIn" relationships
        this.workflows.forEach((workflow) => {
            workflow.activities.forEach((activityRef) => {
                const activityKey = `${activityRef.taskQueue}-${activityRef.name}`;
                const activity = this.activities.find((a) => `${a.taskQueue}-${a.name}` === activityKey);
                if (activity) {
                    activity.usedIn.push({
                        workflowName: workflow.name,
                        workflowTaskQueue: workflow.taskQueue,
                    });
                }
            });
        });
    }

    getWorkflows() {
        return this.workflows;
    }

    getActivities() {
        return this.activities;
    }
}
