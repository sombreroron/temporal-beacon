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
import FunctionsIcon from "@mui/icons-material/Functions";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Activity } from "./types";
import { CopyButton } from "./CopyButton";
import { Input } from "./Input";
import { Output } from "./Output";
import { UsedIn } from "./UsedIn";

interface ActivityBoxProps {
    activity: Activity;
    onFilterByService?: (service: string) => void;
    onFilterByTaskQueue?: (taskQueue: string) => void;
    expandAll?: boolean;
}

export const ActivityBox = ({
    activity,
    onFilterByService,
    onFilterByTaskQueue,
    expandAll = false,
}: ActivityBoxProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsExpanded(expandAll);
    }, [expandAll]);

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
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <FunctionsIcon color="action" />
                    <Typography variant="subtitle1" fontWeight="bold">
                        {activity.name || "(unnamed)"}
                    </Typography>
                    <CopyButton value={activity.name} title="Copy activity name" />
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={2}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Service:</strong> {activity.serviceName || "N/A"}
                            </Typography>
                            {activity.serviceName && (
                                <>
                                    <CopyButton
                                        value={activity.serviceName}
                                        title="Copy service name"
                                        fontSize={14}
                                        sx={{ ml: 0.5, padding: 0.25 }}
                                    />
                                    {onFilterByService && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (activity.serviceName) {
                                                    onFilterByService(activity.serviceName);
                                                }
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
                                <strong>Task Queue:</strong> {activity.taskQueue || "N/A"}
                            </Typography>
                            {activity.taskQueue && (
                                <>
                                    <CopyButton
                                        value={activity.taskQueue}
                                        title="Copy task queue"
                                        fontSize={14}
                                        sx={{ ml: 0.5, padding: 0.25 }}
                                    />
                                    {onFilterByTaskQueue && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (activity.taskQueue) {
                                                    onFilterByTaskQueue(activity.taskQueue);
                                                }
                                            }}
                                            title="Filter by this task queue"
                                            sx={{ ml: 0.5, padding: 0.25 }}
                                        >
                                            <FilterAltIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>

                    {activity.input && activity.input.length > 0 && (
                        <Box>
                            <Divider sx={{ mb: 1 }} />
                            <Input input={activity.input} />
                        </Box>
                    )}

                    {activity.output && (
                        <Box>
                            <Divider sx={{ mb: 1 }} />
                            <Output output={activity.output} />
                        </Box>
                    )}

                    {activity.usedIn && activity.usedIn.length > 0 && (
                        <Box>
                            <Divider sx={{ mb: 1 }} />
                            <UsedIn usedIn={activity.usedIn} />
                        </Box>
                    )}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
};
