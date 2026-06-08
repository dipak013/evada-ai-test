import { api } from "@/lib/axios";

export type ScanType =
  | "fast"
  | "full"
  | "stealth"
  | "discovery"
  | "os_detect"
  | "udp_audit"
  | "custom";

export interface RunScanPayload {
  profile?: ScanType;
  scan_types?: ScanType[];
  client_id: string;
  agent_id: string;
  custom_args?: string;
  wait_for_completion?: boolean;
}

export interface RunScanResponse {
  status_code?: number;
  scan_id?: string;
  job_id?: string;
  job_ids?: string[];
  scans?: Array<{
    job_id?: string;
    scan_type?: ScanType;
    schedule_id?: number;
  }>;
  scan_type?: ScanType;
  failed_jobs?: Array<{
    job_id?: string;
    error?: string;
  }>;
  status: string;
  message: string;
}

export interface AsyncScanResponse extends RunScanResponse {
  // Extended response for async submissions (201/202)
  submission_status?: "queued" | "started";
  poll_interval_ms?: number;
}

export const ScanService = {
  /**
   * Run a network scan with selected parameters (asynchronously)
   * @param payload - Scan parameters including types, client, and agent
   * @returns Promise with scan submission response (201/202 = queued/started)
   */
  async runScan(payload: RunScanPayload): Promise<AsyncScanResponse> {
    try {
      const resolvedProfile = payload.profile ?? payload.scan_types?.[0];
      const response = await api.post<AsyncScanResponse>("/run-scan/", {
        ...payload,
        profile: resolvedProfile,
        wait_for_completion: false,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error running scan:", error);
      throw error;
    }
  },
};
