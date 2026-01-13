import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import FunctionsIcon from "@mui/icons-material/Functions";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ActivityReference, Activity } from "./types";
import { CopyButton } from "./CopyButton";
import { Input } from "./Input";
import { Output } from "./Output";

interface ActivityItemProps {
    activityRef: ActivityReference;
    activities: Activity[];
    onFilterByService?: (service: string) => void;
    onFilterByTaskQueue?: (taskQueue: string) => void;
}

export const ActivityItem = ({
    activityRef,
    activities,
    onFilterByService,
    onFilterByTaskQueue,
}: ActivityItemProps) => {
    const activity = activities.find((a) => a.name === activityRef.name && a.taskQueue === activityRef.taskQueue);

    return (
        <Box sx={{ ml: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 500 }}>
                    <FunctionsIcon fontSize="small" color="action" />
                    {activityRef.name}
                </Typography>
                <CopyButton value={activityRef.name} title="Copy activity name" fontSize={14} sx={{ padding: 0.25 }} />
            </Box>
            <Box sx={{ ml: 3, mt: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        <strong>Service:</strong> {activity?.serviceName || "N/A"}
                    </Typography>
                    {activity?.serviceName && (
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
                                        if (activity?.serviceName) {
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
                    <Typography variant="caption" color="text.secondary">
                        <strong>Task Queue:</strong> {activityRef.taskQueue}
                    </Typography>
                    <CopyButton
                        value={activityRef.taskQueue}
                        title="Copy task queue"
                        fontSize={14}
                        sx={{ ml: 0.5, padding: 0.25 }}
                    />
                    {onFilterByTaskQueue && (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onFilterByTaskQueue(activityRef.taskQueue);
                            }}
                            title="Filter by this task queue"
                            sx={{ ml: 0.5, padding: 0.25 }}
                        >
                            <FilterAltIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    )}
                </Box>
                {activity?.input && activity.input.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                        <Input input={activity.input} />
                    </Box>
                )}
                {activity?.output && (
                    <Box sx={{ mt: 1.5 }}>
                        <Output output={activity.output} />
                    </Box>
                )}
            </Box>
        </Box>
    );
};
