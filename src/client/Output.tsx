import React from "react";
import { Box } from "@mui/material";
import { ActivityOutput } from "./types";
import { Metadata } from "./Metadata";
import { TypeRenderer } from "./TypeRenderer";

interface OutputProps {
    output?: ActivityOutput | null;
}

interface TypeMetadata {
    type?: string;
    className?: string;
    optional?: boolean;
    elementType?: unknown;
    properties?: Record<string, TypeMetadata>;
    enum?: string[];
}

export const Output: React.FC<OutputProps> = ({ output }) => {
    if (!output) {
        return null;
    }

    return (
        <Metadata title="Output" data={output} copyTitle="Copy output as JSON">
            <Box
                sx={{
                    p: 1,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.200",
                }}
            >
                <TypeRenderer metadata={output as TypeMetadata} colorScheme="success" />
            </Box>
        </Metadata>
    );
};
