import React from "react";
import { Box, Typography } from "@mui/material";
import { ActivityInput } from "./types";
import { Metadata } from "./Metadata";
import { TypeRenderer } from "./TypeRenderer";

interface InputProps {
    input?: ActivityInput[];
}

interface TypeMetadata {
    type?: string;
    className?: string;
    optional?: boolean;
    elementType?: unknown;
    properties?: Record<string, TypeMetadata>;
    enum?: string[];
}

export const Input: React.FC<InputProps> = ({ input }) => {
    if (!input || input.length === 0) {
        return null;
    }

    return (
        <Metadata title="Input" count={input.length} data={input} copyTitle="Copy parameters as JSON">
            <Box>
                {input.map((param, index) => {
                    const metadata: TypeMetadata =
                        typeof param.type === "string"
                            ? { type: param.type, enum: param.enum }
                            : { ...param.type, enum: param.enum };

                    return (
                        <Box
                            key={`${param.name}-${index}`}
                            sx={{
                                mb: 1.5,
                                p: 1,
                                bgcolor: "grey.50",
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: "grey.200",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                    mb: 0.5,
                                }}
                            >
                                {param.name}
                                {param.optional && (
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{ color: "text.secondary", ml: 0.5, fontWeight: 400 }}
                                    >
                                        (optional)
                                    </Typography>
                                )}
                            </Typography>
                            <Box sx={{ ml: 1 }}>
                                <TypeRenderer metadata={metadata} colorScheme="primary" />
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Metadata>
    );
};
