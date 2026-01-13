import React, { useState } from "react";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface CopyButtonProps {
    value: string;
    title?: string;
    size?: "small" | "medium" | "large";
    fontSize?: number;
    sx?: any;
    onClick?: (e: React.MouseEvent) => void;
}

export const CopyButton = ({
    value,
    title = "Copy to clipboard",
    size = "small",
    fontSize,
    sx,
    onClick,
}: CopyButtonProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setSnackbarOpen(true);
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <>
            <IconButton size={size} onClick={handleCopy} title={title} sx={sx}>
                <ContentCopyIcon sx={fontSize ? { fontSize } : undefined} fontSize={fontSize ? undefined : "small"} />
            </IconButton>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message="Copied to clipboard"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </>
    );
};
