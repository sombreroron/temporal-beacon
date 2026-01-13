import React, { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CopyButton } from "./CopyButton";

interface MetadataProps {
    title: string;
    count?: number;
    data: any;
    copyTitle: string;
    children: React.ReactNode;
}

export const Metadata: React.FC<MetadataProps> = ({ title, count, data, copyTitle, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const dataAsJson = JSON.stringify(data, null, 2);

    return (
        <Accordion
            expanded={isExpanded}
            onChange={() => setIsExpanded(!isExpanded)}
            disableGutters
            elevation={0}
            sx={{
                "&:before": { display: "none" },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    minHeight: "auto",
                    "& .MuiAccordionSummary-content": {
                        my: 1,
                        alignItems: "center",
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                        {title}
                        {count !== undefined && ` (${count})`}
                    </Typography>
                    <CopyButton value={dataAsJson} title={copyTitle} fontSize={14} sx={{ padding: 0.25 }} />
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>{children}</AccordionDetails>
        </Accordion>
    );
};
