import React from "react";
import { Box, Typography } from "@mui/material";

interface HeaderProps {
    workflowCount: number;
    activityCount: number;
}

export const Header = ({ workflowCount, activityCount }: HeaderProps) => {
    return (
        <Box sx={{ marginBottom: 3, display: "flex", alignItems: "baseline", gap: 1.5 }}>
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
            >
                Beacon
            </Typography>
            <Typography variant="h6" color="text.secondary">
                -
            </Typography>
            <Typography variant="h6" color="text.secondary">
                Temporal Registry
            </Typography>
            <Typography variant="h6" color="text.secondary">
                -
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {workflowCount} workflows · {activityCount} activities
            </Typography>
        </Box>
    );
};
