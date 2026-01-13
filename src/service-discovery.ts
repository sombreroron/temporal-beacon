import { KubeConfig, CoreV1Api, V1Service } from "@kubernetes/client-node";
import axios from "axios";
import * as http from "node:http";

interface ServiceDiscoveryOptions {
    proxyPort?: number;
    namespacesToIgnore?: string[];
}

export class ServiceDiscovery {
    private k8sApi: CoreV1Api | null = null;
    private readonly proxyPort: number;
    private readonly namespacesToIgnore: string[];
    private readonly registryPath: string = "/temporal-registry";
    private httpAgent = new http.Agent({ keepAlive: true });

    constructor(options: ServiceDiscoveryOptions = {}) {
        this.proxyPort = options.proxyPort ? options.proxyPort : 8001;
        this.namespacesToIgnore = options.namespacesToIgnore ? options.namespacesToIgnore : [];
    }

    private _initializeKubeClient(): void {
        try {
            const kubeConfig = new KubeConfig();
            kubeConfig.loadFromDefault();
            this.k8sApi = kubeConfig.makeApiClient(CoreV1Api);
            console.log("✅ Kubernetes config loaded successfully.");
        } catch (error) {
            console.error("❌ Failed to load Kubernetes configuration.");
            console.error("Ensure you have a valid kubeconfig file or are running inside a cluster.");
            throw error;
        }
    }

    private async _checkServiceEndpoint(url: string): Promise<boolean> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s timeout

        try {
            const { status } = await axios.head(url, {
                signal: controller.signal,
                httpAgent: this.httpAgent,
            });

            clearTimeout(timeoutId);

            if (status === 200) {
                console.log(`  ✅ SUCCESS! Status Code: ${status}`);
                return true;
            } else {
                console.log(`  ❌ FAILED. Status Code: ${status}`);
                return false;
            }
        } catch (error: any) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                console.log(`  ❌ FAILED. Error: Request timed out.`);
            } else if (error.code === "ECONNREFUSED") {
                console.log(`  ❌ FAILED. Error: Connection refused.`);
            } else {
                console.log(`  ❌ FAILED. Error: ${error.message}`);
            }
            return false;
        }
    }

    public async discover(): Promise<string[]> {
        this._initializeKubeClient();

        if (!this.k8sApi) {
            throw new Error("Kubernetes API client not initialized.");
        }

        try {
            const res = await this.k8sApi.listServiceForAllNamespaces();
            const services: V1Service[] = res.items; // Direct access for newer client versions
            const successfulUrls: string[] = [];

            await Promise.all(
                services.map(async (service) => {
                    const name = service.metadata?.name;
                    const namespace = service.metadata?.namespace;

                    // Skip non-relevant services (optional filtering)
                    if (!name || !namespace || this.namespacesToIgnore.includes(namespace)) {
                        return;
                    }

                    // Construct the URL through the local kubectl proxy
                    // Format: http://localhost:8001/api/v1/namespaces/<NAMESPACE>/services/<SERVICE_NAME>:<PORT_NAME_OR_NUMBER>/proxy/<PATH>

                    // We need to determine the port to use.
                    // Ideally, we look for 'http' or '80' or just pick the first one.
                    const portSpec = service.spec?.ports ? service.spec.ports[0] : null;
                    if (!portSpec) {
                        console.log(`⚠️ Skipping Service ${namespace}/${name}: No ports defined.`);
                        return;
                    }

                    // Using just the service name often works with the proxy if it resolves to default port,
                    // but explicit port is safer if defined.
                    // The proxy syntax for service is:
                    // /api/v1/namespaces/{namespace}/services/{service_name}[:{port_name}]/proxy

                    const proxyUrl = `http://localhost:${this.proxyPort}/api/v1/namespaces/${namespace}/services/${name}:${portSpec.port}/proxy${this.registryPath}`;

                    console.log(`\n---`);
                    console.log(`⚙️ Testing ${namespace}/${name} via proxy at ${proxyUrl}`);

                    const isSuccess = await this._checkServiceEndpoint(proxyUrl);

                    if (isSuccess) {
                        successfulUrls.push(proxyUrl);
                    }
                }),
            );

            return successfulUrls;
        } catch (error: any) {
            console.error("❌ Critical Error during discovery:", error.message);
            return [];
        }
    }
}
