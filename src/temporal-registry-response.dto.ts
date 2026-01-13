/**
 * Type definition for activity parameter types
 * Can be a simple string type or a complex object type
 */
export type ActivityInputType =
    | string
    | {
          className: string;
          properties: Record<
              string,
              {
                  type: string;
                  optional?: boolean;
              }
          >;
      };

/**
 * Data Transfer Object for Activity parameter definitions
 */
export interface ActivityInputDto {
    /** The name of the parameter */
    name: string;
    /** The type of the parameter (can be a string or complex object) */
    type: ActivityInputType;
}

/**
 * Type definition for activity output types
 */
export interface ActivityOutputDto {
    className: string;
    properties?: Record<
        string,
        {
            type: string;
            optional?: boolean;
            elementType?: any;
        }
    >;
}

/**
 * Data Transfer Object for Activity definitions
 * Note: taskQueue is optional as workflow activities may inherit from their parent workflow's taskQueue
 */
export interface ActivityDto {
    /** The name of the activity */
    name: string;
    /** The task queue where this activity is executed (optional, may inherit from workflow) */
    taskQueue?: string;
    /** The parameters accepted by this activity */
    input?: ActivityInputDto[];
    /** The return type of this activity */
    output?: ActivityOutputDto | null;
}

/**
 * Data Transfer Object for Workflow definitions
 */
export interface WorkflowDto {
    /** The name of the workflow (optional, some workflows may be unnamed) */
    name?: string;
    /** The list of activities that make up this workflow */
    activities: ActivityDto[];

    childWorkflows: WorkflowDto[];
    /** The task queue where this workflow is executed */
    taskQueue: string;
}

/**
 * Data Transfer Object for the complete Temporal Registry response
 */
export interface TemporalRegistryResponseDto {
    /** The name of the service */
    serviceName: string;
    /** List of all available activities */
    components: {
        activities: ActivityDto[];
        workflows: WorkflowDto[];
    };
}
