import React, { useState } from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import { Header } from "./Header";
import { Filters } from "./Filters";
import { WorkflowItem } from "./WorkflowItem";
import { ActivityBox } from "./ActivityBox";
import { Workflow, Activity } from "./types";

interface WorkflowTreeProps {
    workflows: Workflow[];
    activities: Activity[];
}

export const WorkflowTree = ({ workflows, activities }: WorkflowTreeProps) => {
    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const [selectedTaskQueues, setSelectedTaskQueues] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [expandAllWorkflows, setExpandAllWorkflows] = useState(false);
    const [expandAllActivities, setExpandAllActivities] = useState(false);

    // Get filtered data sets based on current selections for cascading filters
    // Each dropdown shows options relevant to OTHER selected filters (excluding itself)

    // For Services dropdown: filter by taskQueue and name (but not service)
    const getFilteredForServices = () => {
        return {
            workflows: workflows.filter((w) => {
                const taskQueueMatch =
                    selectedTaskQueues.length === 0 || selectedTaskQueues.some((tq) => w.taskQueue.includes(tq));
                const nameMatch = selectedNames.length === 0 || selectedNames.some((name) => w.name.includes(name));
                return taskQueueMatch && nameMatch;
            }),
            activities: activities.filter((a) => {
                const taskQueueMatch =
                    selectedTaskQueues.length === 0 ||
                    selectedTaskQueues.some((tq) => a.taskQueue && a.taskQueue.includes(tq));
                const nameMatch = selectedNames.length === 0 || selectedNames.some((name) => a.name.includes(name));
                return taskQueueMatch && nameMatch;
            }),
        };
    };

    // For TaskQueues dropdown: filter by service and name (but not taskQueue)
    const getFilteredForTaskQueues = () => {
        return {
            workflows: workflows.filter((w) => {
                const serviceMatch =
                    selectedServices.length === 0 ||
                    selectedServices.some((s) => w.serviceName && w.serviceName.includes(s));
                const nameMatch = selectedNames.length === 0 || selectedNames.some((name) => w.name.includes(name));
                return serviceMatch && nameMatch;
            }),
            activities: activities.filter((a) => {
                const serviceMatch =
                    selectedServices.length === 0 ||
                    selectedServices.some((s) => a.serviceName && a.serviceName.includes(s));
                const nameMatch = selectedNames.length === 0 || selectedNames.some((name) => a.name.includes(name));
                return serviceMatch && nameMatch;
            }),
        };
    };

    // For Names dropdown: filter by service and taskQueue (but not name)
    const getFilteredForNames = () => {
        return {
            workflows: workflows.filter((w) => {
                const serviceMatch =
                    selectedServices.length === 0 ||
                    selectedServices.some((s) => w.serviceName && w.serviceName.includes(s));
                const taskQueueMatch =
                    selectedTaskQueues.length === 0 || selectedTaskQueues.some((tq) => w.taskQueue.includes(tq));
                return serviceMatch && taskQueueMatch;
            }),
            activities: activities.filter((a) => {
                const serviceMatch =
                    selectedServices.length === 0 ||
                    selectedServices.some((s) => a.serviceName && a.serviceName.includes(s));
                const taskQueueMatch =
                    selectedTaskQueues.length === 0 ||
                    selectedTaskQueues.some((tq) => a.taskQueue && a.taskQueue.includes(tq));
                return serviceMatch && taskQueueMatch;
            }),
        };
    };

    // Extract unique values for each dropdown based on relevant filters
    const filteredForServices = getFilteredForServices();
    const filteredForTaskQueues = getFilteredForTaskQueues();
    const filteredForNames = getFilteredForNames();

    const uniqueServices = [
        ...new Set([
            ...filteredForServices.workflows.map((w) => w.serviceName).filter((s): s is string => s !== null),
            ...filteredForServices.activities.map((a) => a.serviceName).filter((s): s is string => s !== null),
        ]),
    ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    const uniqueTaskQueues = [
        ...new Set([
            ...filteredForTaskQueues.workflows.map((w) => w.taskQueue),
            ...filteredForTaskQueues.activities.map((a) => a.taskQueue).filter((tq): tq is string => tq !== null),
        ]),
    ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    const uniqueWorkflowNames = [...new Set(filteredForNames.workflows.map((w) => w.name))].sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase()),
    );
    const uniqueActivityNames = [...new Set(filteredForNames.activities.map((a) => a.name))].sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase()),
    );

    const filteredWorkflows = workflows.filter((w) => {
        const nameMatch = selectedNames.length === 0 || selectedNames.some((name) => w.name.includes(name));
        const taskQueueMatch =
            selectedTaskQueues.length === 0 || selectedTaskQueues.some((tq) => w.taskQueue.includes(tq));
        const serviceMatch =
            selectedServices.length === 0 || selectedServices.some((s) => w.serviceName && w.serviceName.includes(s));

        return nameMatch && taskQueueMatch && serviceMatch;
    });

    const filteredActivities = activities.filter((a) => {
        const nameMatch = selectedNames.length === 0 || selectedNames.some((name) => a.name.includes(name));
        const taskQueueMatch =
            selectedTaskQueues.length === 0 || selectedTaskQueues.some((tq) => a.taskQueue && a.taskQueue.includes(tq));
        const serviceMatch =
            selectedServices.length === 0 || selectedServices.some((s) => a.serviceName && a.serviceName.includes(s));

        return nameMatch && taskQueueMatch && serviceMatch;
    });

    // Filter handlers
    const handleFilterByService = (service: string) => {
        if (!selectedServices.includes(service)) {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleFilterByTaskQueue = (taskQueue: string) => {
        if (!selectedTaskQueues.includes(taskQueue)) {
            setSelectedTaskQueues([...selectedTaskQueues, taskQueue]);
        }
    };

    return (
        <Box sx={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
            <Header workflowCount={workflows.length} activityCount={activities.length} />

            <Filters
                uniqueServices={uniqueServices}
                uniqueTaskQueues={uniqueTaskQueues}
                uniqueNames={[...uniqueWorkflowNames, ...uniqueActivityNames]}
                selectedServices={selectedServices}
                selectedTaskQueues={selectedTaskQueues}
                selectedNames={selectedNames}
                onServicesChange={setSelectedServices}
                onTaskQueuesChange={setSelectedTaskQueues}
                onNamesChange={setSelectedNames}
                onReset={() => {
                    setSelectedNames([]);
                    setSelectedTaskQueues([]);
                    setSelectedServices([]);
                }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 4, marginBottom: 2 }}>
                <Typography variant="h5">Workflows ({filteredWorkflows.length})</Typography>
                <IconButton
                    size="small"
                    onClick={() => setExpandAllWorkflows(!expandAllWorkflows)}
                    title={expandAllWorkflows ? "Collapse all workflows" : "Expand all workflows"}
                >
                    {expandAllWorkflows ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                </IconButton>
            </Box>
            <Stack spacing={2}>
                {filteredWorkflows.map((workflow, index) => (
                    <Box key={`${workflow.name}-${workflow.taskQueue}-${index}`}>
                        <WorkflowItem
                            workflow={workflow}
                            workflows={workflows}
                            activities={activities}
                            onFilterByService={handleFilterByService}
                            onFilterByTaskQueue={handleFilterByTaskQueue}
                            expandAll={expandAllWorkflows}
                        />
                    </Box>
                ))}
            </Stack>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 5, marginBottom: 2 }}>
                <Typography variant="h5">Activities ({filteredActivities.length})</Typography>
                <IconButton
                    size="small"
                    onClick={() => setExpandAllActivities(!expandAllActivities)}
                    title={expandAllActivities ? "Collapse all activities" : "Expand all activities"}
                >
                    {expandAllActivities ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                </IconButton>
            </Box>
            <Stack spacing={2}>
                {filteredActivities.map((activity, index) => (
                    <Box key={`${activity.name}-${activity.taskQueue}-${index}`}>
                        <ActivityBox
                            activity={activity}
                            onFilterByService={handleFilterByService}
                            onFilterByTaskQueue={handleFilterByTaskQueue}
                            expandAll={expandAllActivities}
                        />
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};
