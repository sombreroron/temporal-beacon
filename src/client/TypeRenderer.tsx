import React from "react";
import { Box, Typography, Chip } from "@mui/material";

interface TypeMetadata {
    type?: string;
    className?: string;
    optional?: boolean;
    elementType?: any;
    properties?: Record<string, TypeMetadata>;
    enum?: string[];
}

interface TypeRendererProps {
    metadata: TypeMetadata;
    colorScheme: "primary" | "success";
    depth?: number;
}

export const TypeRenderer: React.FC<TypeRendererProps> = ({ metadata, colorScheme, depth = 0 }) => {
    const chipStyles = {
        fontSize: depth === 0 ? "0.75rem" : "0.70rem",
        height: depth === 0 ? "20px" : "18px",
        bgcolor: `${colorScheme}.50`,
        color: `${colorScheme}.700`,
        fontFamily: "monospace",
        ml: depth > 0 ? 0.5 : 0,
    };
    const typeName = metadata.className || metadata.type;

    // Handle Array type with elementType
    const isArray = metadata.type === "Array" || metadata.className === "Array";
    const elementType = metadata.elementType || metadata.properties?.elementType;

    if (isArray && elementType) {
        const elementTypeName = typeof elementType === "string" ? elementType : elementType.type || "unknown";

        return (
            <Box sx={{ ml: depth > 0 ? 2 : 0, mt: 0.5 }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: "monospace",
                        color: "text.secondary",
                        fontWeight: 500,
                    }}
                >
                    Array&lt;{elementTypeName}&gt;
                </Typography>
                {typeof elementType === "object" && elementType.properties && (
                    <Box sx={{ ml: 2, mt: 0.5, borderLeft: "2px solid", borderColor: "grey.300", pl: 1 }}>
                        {Object.entries(elementType.properties).map(([propName, propDef]) => (
                            <PropertyRenderer
                                key={propName}
                                propName={propName}
                                propDef={propDef as TypeMetadata}
                                colorScheme={colorScheme}
                                depth={depth + 1}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        );
    }

    // Handle complex types with properties
    if (metadata.properties) {
        return (
            <Box sx={{ ml: depth > 0 ? 2 : 0, mt: 0.5 }}>
                {typeName && (
                    <Typography
                        variant="caption"
                        sx={{
                            fontFamily: "monospace",
                            color: "text.secondary",
                            fontWeight: 500,
                        }}
                    >
                        {typeName}
                    </Typography>
                )}
                <Box sx={{ ml: 2, mt: 0.5, borderLeft: "2px solid", borderColor: "grey.300", pl: 1 }}>
                    {Object.entries(metadata.properties).map(([propName, propDef]) => (
                        <PropertyRenderer
                            key={propName}
                            propName={propName}
                            propDef={propDef as TypeMetadata}
                            colorScheme={colorScheme}
                            depth={depth}
                        />
                    ))}
                </Box>
            </Box>
        );
    }

    // Simple type with just a type property
    if (typeName) {
        return (
            <>
                <Chip label={typeName} size="small" sx={chipStyles} />
                {metadata.enum && metadata.enum.length > 0 && (
                    <Box sx={{ ml: depth > 0 ? 2 : 0, mt: 0.5 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: "monospace",
                                color: "text.secondary",
                                display: "block",
                                mb: 0.25,
                            }}
                        >
                            enum:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {metadata.enum.map((value, index) => (
                                <Chip
                                    key={index}
                                    label={`"${value}"`}
                                    size="small"
                                    sx={{
                                        fontSize: "0.65rem",
                                        height: "16px",
                                        bgcolor: "grey.100",
                                        color: "text.primary",
                                        fontFamily: "monospace",
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </>
        );
    }

    return null;
};

interface PropertyRendererProps {
    propName: string;
    propDef: TypeMetadata;
    colorScheme: "primary" | "success";
    depth: number;
}

const PropertyRenderer: React.FC<PropertyRendererProps> = ({ propName, propDef, colorScheme, depth }) => {
    return (
        <Box sx={{ mb: 0.5 }}>
            <Typography
                variant="caption"
                sx={{
                    fontFamily: "monospace",
                    display: "inline",
                }}
            >
                {propName}
                {propDef.optional && (
                    <Typography component="span" variant="caption" sx={{ color: "text.secondary", ml: 0.5 }}>
                        (optional)
                    </Typography>
                )}
                :{" "}
            </Typography>
            {typeof propDef.type === "string" ? (
                <>
                    <Chip
                        label={propDef.type}
                        size="small"
                        sx={{
                            fontSize: "0.70rem",
                            height: "18px",
                            bgcolor: `${colorScheme}.50`,
                            color: `${colorScheme}.700`,
                            fontFamily: "monospace",
                            ml: 0.5,
                        }}
                    />
                    {propDef.enum && propDef.enum.length > 0 && (
                        <Box sx={{ ml: 2, mt: 0.5 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: "monospace",
                                    color: "text.secondary",
                                    display: "block",
                                    mb: 0.25,
                                }}
                            >
                                enum:
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {propDef.enum.map((value, index) => (
                                    <Chip
                                        key={index}
                                        label={`"${value}"`}
                                        size="small"
                                        sx={{
                                            fontSize: "0.65rem",
                                            height: "16px",
                                            bgcolor: "grey.100",
                                            color: "text.primary",
                                            fontFamily: "monospace",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </>
            ) : (
                <TypeRenderer metadata={propDef} colorScheme={colorScheme} depth={depth + 1} />
            )}
        </Box>
    );
};
