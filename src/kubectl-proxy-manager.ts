import { spawn, ChildProcess } from "child_process";
import { createServer } from "net";

export class KubectlProxyManager {
    private proxyProcess: ChildProcess | null = null;
    private readonly port: number;

    constructor(port = 8001) {
        this.port = port;
    }

    /**
     * Checks if the port is already in use.
     * Returns true if the port is taken, false otherwise.
     */
    private isPortInUse(): Promise<boolean> {
        return new Promise((resolve) => {
            const server = createServer();

            server.once("error", (err: any) => {
                if (err.code === "EADDRINUSE") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });

            server.once("listening", () => {
                server.close();
                resolve(false);
            });

            server.listen(this.port);
        });
    }

    /**
     * Starts the kubectl proxy if it's not already running on the specified port.
     */
    public async start(): Promise<void> {
        if (await this.isPortInUse()) {
            console.log(`Port ${this.port} is already in use. Assuming kubectl proxy is running.`);
            return;
        }

        console.log(`Starting kubectl proxy on port ${this.port}...`);
        this.proxyProcess = spawn("kubectl", ["proxy", "--port", this.port.toString()]);

        this.proxyProcess.stdout?.on("data", (data) => {
            console.log(`[kubectl proxy]: ${data}`);
        });

        this.proxyProcess.stderr?.on("data", (data) => {
            console.error(`[kubectl proxy error]: ${data}`);
        });

        this.proxyProcess.on("error", (err) => {
            console.error(`Failed to start kubectl proxy: ${err.message}`);
        });

        // Give it a moment to start up
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("kubectl proxy started successfully.");
    }

    /**
     * Stops the managed kubectl proxy process.
     */
    public stop(): void {
        if (this.proxyProcess) {
            console.log("Stopping kubectl proxy...");
            this.proxyProcess.kill();
            this.proxyProcess = null;
            console.log("kubectl proxy stopped.");
        } else {
            console.log("No managed kubectl proxy to stop.");
        }
    }
}
