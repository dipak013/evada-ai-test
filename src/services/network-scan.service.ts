import { api } from "@/lib/axios";

export interface ServiceVulnerability {
  [key: string]: string;
}

export interface ServiceInfo {
  name: string;
  port: number;
  vulns: string | ServiceVulnerability;
  product: string;
  version: string;
}

export interface HostInfo {
  status: string;
  services: ServiceInfo[];
}

export interface NetworkGraphData {
  [ipAddress: string]: HostInfo;
}

export interface NetworkScanResponse {
  network_scan: {
    id: string;
    graph_json: string; // JSON string containing NetworkGraphData
    executed_at: string;
  };
}

export interface NetworkScanPayload {
  application_details: any; // The application configuration/details to scan
}

export const NetworkScanService = {
  /**
   * Trigger a network scan
   * @param payload - Application details for the network scan
   * @returns Promise with network scan response
   */
  async scanNetwork(payload: NetworkScanPayload): Promise<NetworkScanResponse> {
    try {
      const response = await api.post<NetworkScanResponse>("/scan-network", payload);
      return response.data;
    } catch (error: any) {
      console.error("Error triggering network scan:", error);
      throw error;
    }
  },

  /**
   * Parse the graph_json string to NetworkGraphData object
   * @param graphJson - JSON string from the API response
   * @returns Parsed NetworkGraphData object
   */
  parseGraphJson(graphJson: string): NetworkGraphData {
    try {
      return JSON.parse(graphJson);
    } catch (error) {
      console.error("Error parsing graph_json:", error);
      throw new Error("Invalid graph_json format");
    }
  }
};
