import React, { useState, useEffect } from "react";
import { WorkflowTree } from "./WorkflowTree";
import { Workflow, Activity } from "./types";

export const App = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetch("/public/workflows.json").then((res) => {
                if (!res.ok) throw new Error("Failed to load workflows.json");
                return res.json();
            }),
            fetch("/public/activities.json").then((res) => {
                if (!res.ok) throw new Error("Failed to load activities.json");
                return res.json();
            }),
        ])
            .then(([workflowsData, activitiesData]) => {
                setWorkflows(workflowsData);
                setActivities(activitiesData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: "20px" }}>Loading workflows and activities...</div>;
    if (error)
        return (
            <div style={{ color: "red", padding: "20px" }}>
                <h2>Error loading data</h2>
                <p>{error}</p>
                <p>Make sure workflows.json and activities.json exist in the public/ directory</p>
            </div>
        );

    return <WorkflowTree workflows={workflows} activities={activities} />;
};
