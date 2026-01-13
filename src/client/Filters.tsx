import React from "react";
import { Autocomplete, TextField, Chip, Button, Paper, Stack } from "@mui/material";

interface FiltersProps {
    uniqueServices: string[];
    uniqueTaskQueues: string[];
    uniqueNames: string[];
    selectedServices: string[];
    selectedTaskQueues: string[];
    selectedNames: string[];
    onServicesChange: (values: string[]) => void;
    onTaskQueuesChange: (values: string[]) => void;
    onNamesChange: (values: string[]) => void;
    onReset: () => void;
}

export const Filters = ({
    uniqueServices,
    uniqueTaskQueues,
    uniqueNames,
    selectedServices,
    selectedTaskQueues,
    selectedNames,
    onServicesChange,
    onTaskQueuesChange,
    onNamesChange,
    onReset,
}: FiltersProps) => {
    return (
        <Paper sx={{ padding: 3, marginBottom: 4 }} elevation={2}>
            <Stack direction="row" spacing={2} sx={{ marginBottom: 2, flexWrap: "wrap", gap: 2 }}>
                <Autocomplete
                    multiple
                    size="small"
                    options={uniqueServices}
                    value={selectedServices}
                    onChange={(_, newValue) => onServicesChange(newValue)}
                    renderInput={(params) => <TextField {...params} label="Service" placeholder="Select services..." />}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                        ))
                    }
                    sx={{ flex: 1, minWidth: 250 }}
                />

                <Autocomplete
                    multiple
                    size="small"
                    options={uniqueTaskQueues}
                    value={selectedTaskQueues}
                    onChange={(_, newValue) => onTaskQueuesChange(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Task Queue" placeholder="Select task queues..." />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                        ))
                    }
                    sx={{ flex: 1, minWidth: 250 }}
                />

                <Autocomplete
                    multiple
                    size="small"
                    options={uniqueNames}
                    value={selectedNames}
                    onChange={(_, newValue) => onNamesChange(newValue)}
                    renderInput={(params) => <TextField {...params} label="Name" placeholder="Select names..." />}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                        ))
                    }
                    sx={{ flex: 1, minWidth: 250 }}
                />

                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={onReset}
                    sx={{ alignSelf: "center" }}
                >
                    Reset
                </Button>
            </Stack>
        </Paper>
    );
};
