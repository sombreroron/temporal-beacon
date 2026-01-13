#!/usr/bin/env node

import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "node:child_process";
import axios from "axios";
import { TemporalRegistryManager } from "./temporal-registry-manager";
import { ServiceDiscovery } from "./service-discovery";
import { KubectlProxyManager } from "./kubectl-proxy-manager";
import { TemporalRegistryResponseDto } from "./temporal-registry-response.dto";

const PORT = 7237;

const NAMESPACES_TO_IGNORE = [
    "kube-system",
    "kube-public",
    "kube-node-lease",
    "kubernetes-dashboard",
    "ingress-nginx",
    "cert-manager",
    "istio-system",
    "linkerd",
    "monitoring",
    "observability",
    "argocd",
    "flux-system",
    "gatekeeper-system",
    "kyverno",
    "external-secrets",
    "sealed-secrets",
    "gke-system",
    "gke-managed-system",
];

async function runDiscovery(publicDir: string): Promise<void> {
    const kubectlProxyManager = new KubectlProxyManager(8001);
    const serviceDiscovery = new ServiceDiscovery({ namespacesToIgnore: NAMESPACES_TO_IGNORE });

    try {
        console.log("🔍 Starting service discovery...");
        await kubectlProxyManager.start();
        const successfulUrls = await serviceDiscovery.discover();

        const promises: Promise<TemporalRegistryResponseDto>[] = [];
        for (const url of successfulUrls) {
            promises.push(axios.get(url).then((response) => response.data));
        }

        const responses = await Promise.all(promises);
        const filteredResponses = responses.filter(
            (response) => !!response.serviceName && response?.components?.activities?.length > 0,
        );

        const temporalRegistryManager = new TemporalRegistryManager(filteredResponses);
        const workflows = temporalRegistryManager.getWorkflows();
        const activities = temporalRegistryManager.getActivities();

        const workflowsJson = JSON.stringify(workflows, null, 2);
        const activitiesJson = JSON.stringify(activities, null, 2);

        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        fs.writeFileSync(path.join(publicDir, "workflows.json"), workflowsJson);
        fs.writeFileSync(path.join(publicDir, "activities.json"), activitiesJson);

        console.log(`✅ Generated ${workflows.length} workflows and ${activities.length} activities`);
    } catch (error: any) {
        console.error("❌ Error fetching registry data:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
    } finally {
        await kubectlProxyManager.stop();
    }
}

function startServer(clientDir: string, publicDir: string): http.Server {
    const server = http.createServer((req, res) => {
        let filePath: string;

        // Serve JSON data files
        if (req.url?.startsWith("/public/")) {
            filePath = path.join(publicDir, req.url.replace("/public/", ""));

            if (fs.existsSync(filePath)) {
                res.setHeader("Content-Type", "application/json");
                fs.createReadStream(filePath).pipe(res);
                return;
            }
        }

        // Serve static client files
        if (req.url === "/" || req.url === "/index.html") {
            filePath = path.join(clientDir, "index.html");
        } else if (req.url?.startsWith("/assets/")) {
            filePath = path.join(clientDir, req.url);
        } else {
            // Default to index.html for client-side routing
            filePath = path.join(clientDir, "index.html");
        }

        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
        }

        // Set appropriate content type
        const ext = path.extname(filePath);
        const contentTypes: Record<string, string> = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".svg": "image/svg+xml",
        };

        res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
        fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, () => {
        const url = `http://localhost:${PORT}`;
        console.log(`📊 Beacon is running on: ${url}`);
        console.log(`\nPress Ctrl+C to stop the server`);

        // Open the URL in the default browser
        const openCommand =
            process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
        exec(`${openCommand} ${url}`, (error) => {
            if (error) {
                console.error(`\n⚠️  Could not open browser: ${error.message}`);
            }
        });
    });

    return server;
}

(async () => {
    // When run from the built dist, __dirname will be dist/packages/beacon/src
    const clientDir = path.join(__dirname, "client");
    const publicDir = path.join(__dirname, "..", "public");

    // Check if client directory exists
    if (!fs.existsSync(clientDir)) {
        console.error("❌ Client directory not found. Make sure the package was built correctly.");
        console.error(`Expected location: ${clientDir}`);
        process.exit(1);
    }

    // Run discovery to generate data files
    await runDiscovery(publicDir);

    // Start the web server
    const server = startServer(clientDir, publicDir);

    // Handle graceful shutdown
    process.on("SIGINT", () => {
        console.log("\n👋 Shutting down...");
        server.close(() => {
            console.log("✅ Server closed");
            process.exit(0);
        });
    });

    process.on("SIGTERM", () => {
        console.log("\n👋 Shutting down...");
        server.close(() => {
            console.log("✅ Server closed");
            process.exit(0);
        });
    });
})();
