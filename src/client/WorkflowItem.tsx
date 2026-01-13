import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Divider,
    IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Workflow, Activity } from "./types";
import { ActivityItem } from "./ActivityItem";
import { ChildWorkflowItem } from "./ChildWorkflowItem";
import { CopyButton } from "./CopyButton";

interface WorkflowItemProps {
    workflow: Workflow;
    workflows: Workflow[];
    activities: Activity[];
    visitedWorkflows?: Set<string>;
    onFilterByService?: (service: string) => void;
    onFilterByTaskQueue?: (taskQueue: string) => void;
    expandAll?: boolean;
}

export const WorkflowItem = ({
    workflow,
    workflows,
    activities,
    visitedWorkflows = new Set(),
    onFilterByService,
    onFilterByTaskQueue,
    expandAll = false,
}: WorkflowItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [areChildWorkflowsExpanded, setAreChildWorkflowsExpanded] = useState(false);
    const [areActivitiesExpanded, setAreActivitiesExpanded] = useState(false);

    useEffect(() => {
        setIsExpanded(expandAll);
        setAreChildWorkflowsExpanded(expandAll);
        setAreActivitiesExpanded(expandAll);
    }, [expandAll]);
    const hasContent = workflow.activities.length > 0 || workflow.childWorkflows.length > 0;
    const workflowKey = `${workflow.name}-${workflow.taskQueue}`;

    return (
        <Accordion
            expanded={isExpanded}
            onChange={() => setIsExpanded(!isExpanded)}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                "&:before": { display: "none" },
                boxShadow: 1,
            }}
        >
            <AccordionSummary expandIcon={hasContent ? <ExpandMoreIcon /> : null}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <AccountTreeIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight="bold">
                        {workflow.name || "(unnamed)"}
                    </Typography>
                    <CopyButton value={workflow.name} title="Copy workflow name" />
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={2}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Service:</strong> {workflow.serviceName || "N/A"}
                            </Typography>
                            {workflow.serviceName && (
                                <>
                                    <CopyButton
                                        value={workflow.serviceName}
                                        title="Copy service name"
                                        fontSize={14}
                                        sx={{ ml: 0.5, padding: 0.25 }}
                                    />
                                    {onFilterByService && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onFilterByService(workflow.serviceName!);
                                            }}
                                            title="Filter by this service"
                                            sx={{ ml: 0.5, padding: 0.25 }}
                                        >
                                            <FilterAltIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    )}
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Task Queue:</strong> {workflow.taskQueue}
                            </Typography>
                            <CopyButton
                                value={workflow.taskQueue}
                                title="Copy task queue"
                                fontSize={14}
                                sx={{ ml: 0.5, padding: 0.25 }}
                            />
                            {onFilterByTaskQueue && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFilterByTaskQueue(workflow.taskQueue);
                                    }}
                                    title="Filter by this task queue"
                                    sx={{ ml: 0.5, padding: 0.25 }}
                                >
                                    <FilterAltIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    {workflow.childWorkflows.length > 0 && (
                        <Box>
                            <Divider sx={{ mb: 1 }} />
                            <Accordion
                                expanded={areChildWorkflowsExpanded}
                                onChange={() => setAreChildWorkflowsExpanded(!areChildWorkflowsExpanded)}
                                disableGutters
                                elevation={0}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: "auto", px: 0 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        Child Workflows ({workflow.childWorkflows.length})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 0 }}>
                                    <Stack spacing={1}>
                                        {workflow.childWorkflows.map((childRef, index) => {
                                            const childWorkflow = workflows.find(
                                                (w) => w.name === childRef.name && w.taskQueue === childRef.taskQueue,
                                            );
                                            const childKey = `${childRef.name}-${childRef.taskQueue}`;
                                            const isCircular = visitedWorkflows.has(childKey);

                                            if (isCircular) {
                                                return null;
                                            }

                                            return childWorkflow ? (
                                                <Box
                                                    key={`${childRef.name}-${childRef.taskQueue}-${index}`}
                                                    sx={{ ml: 2 }}
                                                >
                                                    <WorkflowItem
                                                        workflow={childWorkflow}
                                                        workflows={workflows}
                                                        activities={activities}
                                                        visitedWorkflows={new Set([...visitedWorkflows, workflowKey])}
                                                        onFilterByService={onFilterByService}
                                                        onFilterByTaskQueue={onFilterByTaskQueue}
                                                        expandAll={expandAll}
                                                    />
                                                </Box>
                                            ) : (
                                                <Box key={`${childRef.name}-${childRef.taskQueue}-${index}`}>
                                                    <ChildWorkflowItem
                                                        workflowRef={childRef}
                                                        workflows={workflows}
                                                        onFilterByService={onFilterByService}
                                                        onFilterByTaskQueue={onFilterByTaskQueue}
                                                    />
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    )}

                    {workflow.activities.length > 0 && (
                        <Box>
                            <Divider sx={{ mb: 1 }} />
                            <Accordion
                                expanded={areActivitiesExpanded}
                                onChange={() => setAreActivitiesExpanded(!areActivitiesExpanded)}
                                disableGutters
                                elevation={0}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: "auto", px: 0 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        Activities ({workflow.activities.length})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 0 }}>
                                    <Stack spacing={1}>
                                        {workflow.activities.map((activityRef, index) => (
                                            <Box key={`${activityRef.name}-${activityRef.taskQueue}-${index}`}>
                                                <ActivityItem
                                                    activityRef={activityRef}
                                                    activities={activities}
                                                    onFilterByService={onFilterByService}
                                                    onFilterByTaskQueue={onFilterByTaskQueue}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    )}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
};
