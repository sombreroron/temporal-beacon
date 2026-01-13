import React from "react";
import { Box, Typography } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { CopyButton } from "./CopyButton";
import { Metadata } from "./Metadata";

interface UsedInProps {
    usedIn: Array<{ workflowName: string; workflowTaskQueue: string }>;
}

export const UsedIn: React.FC<UsedInProps> = ({ usedIn }) => {
    if (!usedIn || usedIn.length === 0) {
        return null;
    }

    return (
        <Metadata title="Used in" count={usedIn.length} data={usedIn} copyTitle="Copy workflows as JSON">
            <Box>
                {usedIn.map((usage, index) => (
                    <Box
                        key={`${usage.workflowName}-${usage.workflowTaskQueue}-${index}`}
                        sx={{
                            mb: 1.5,
                            p: 1,
                            bgcolor: "grey.50",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "grey.200",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccountTreeIcon fontSize="small" color="primary" />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                }}
                            >
                                {usage.workflowName}
                            </Typography>
                            <CopyButton
                                value={usage.workflowName}
                                title="Copy workflow name"
                                fontSize={14}
                                sx={{ padding: 0.25 }}
                            />
                        </Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 3, display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <strong>Task Queue:</strong> {usage.workflowTaskQueue}
                            <CopyButton
                                value={usage.workflowTaskQueue}
                                title="Copy task queue"
                                fontSize={12}
                                sx={{ padding: 0.25 }}
                            />
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Metadata>
    );
};
