export interface WorkflowReference {
    name: string;
    taskQueue: string;
}

export interface ActivityReference {
    name: string;
    taskQueue: string;
}

export type ActivityInputType =
    | string
    | {
          className: string;
          properties: Record<
              string,
              {
                  type: string;
                  optional?: boolean;
                  enum?: string[];
              }
          >;
      };

export interface ActivityInput {
    name: string;
    type: ActivityInputType;
    enum?: string[];
    optional?: boolean;
}

export interface ActivityOutput {
    className: string;
    properties?: Record<
        string,
        {
            type: string;
            optional?: boolean;
            elementType?: any;
            enum?: string[];
        }
    >;
}

export interface Workflow {
    name: string;
    taskQueue: string;
    serviceName: string | null;
    activities: ActivityReference[];
    childWorkflows: WorkflowReference[];
}

export interface Activity {
    name: string;
    taskQueue: string | null;
    serviceName: string | null;
    usedIn: Array<{ workflowName: string; workflowTaskQueue: string }>;
    input?: ActivityInput[];
    output?: ActivityOutput | null;
}
