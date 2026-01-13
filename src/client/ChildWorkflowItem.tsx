import React, { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { WorkflowReference, Workflow } from "./types";
import { CopyButton } from "./CopyButton";

interface ChildWorkflowItemProps {
    workflowRef: WorkflowReference;
    workflows: Workflow[];
    onFilterByService?: (service: string) => void;
    onFilterByTaskQueue?: (taskQueue: string) => void;
}

export const ChildWorkflowItem = ({
    workflowRef,
    workflows,
    onFilterByService,
    onFilterByTaskQueue,
}: ChildWorkflowItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const workflow = workflows.find((w) => w.name === workflowRef.name && w.taskQueue === workflowRef.taskQueue);

    return (
        <Accordion
            expanded={isExpanded}
            onChange={() => setIsExpanded(!isExpanded)}
            sx={{
                ml: 2,
                border: "1px solid",
                borderColor: "blue.100",
                borderRadius: 2,
                "&:before": { display: "none" },
                boxShadow: 1,
                bgcolor: "blue.50",
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <AccountTreeIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">
                        {workflowRef.name}
                    </Typography>
                    <CopyButton value={workflowRef.name} title="Copy workflow name" />
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Service:</strong> {workflow?.serviceName || "N/A"}
                        </Typography>
                        {workflow?.serviceName && (
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
                            <strong>Task Queue:</strong> {workflowRef.taskQueue}
                        </Typography>
                        <CopyButton
                            value={workflowRef.taskQueue}
                            title="Copy task queue"
                            fontSize={14}
                            sx={{ ml: 0.5, padding: 0.25 }}
                        />
                        {onFilterByTaskQueue && (
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFilterByTaskQueue(workflowRef.taskQueue);
                                }}
                                title="Filter by this task queue"
                                sx={{ ml: 0.5, padding: 0.25 }}
                            >
                                <FilterAltIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};
