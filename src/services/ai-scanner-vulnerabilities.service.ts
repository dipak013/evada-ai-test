import { api } from "@/lib/axios";
import { SCAN_ROUTES } from "@/config/api-routes";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type VulnStatus = "Open" | "In Review" | "Patched" | "Accepted";

export interface AiScannerVulnerabilityRow {
  id: string;
  cve: string;
  title: string;
  cvss: number;
  severity: Severity;
  status: VulnStatus;
  affected: string;
  published: string | null;
  exploitable: boolean;
  returncode?: number | null;
  error?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  action?: string | null;
  target?: string | null;
  final_script_path?: string | null;
  attempts?: Array<Record<string, any>>;
}

interface AiScannerVulnerabilitiesPayload {
  job_id: string;
  report_id: number;
  pipeline_complete: boolean;
  vulnerabilities: AiScannerVulnerabilityRow[];
}

interface ApiEnvelope {
  success: boolean;
  data: AiScannerVulnerabilitiesPayload;
  error?: string;
}

export const AiScannerVulnerabilitiesService = {
  async getByJobId(jobId: string): Promise<AiScannerVulnerabilitiesPayload> {
    const response = await api.post<ApiEnvelope>(SCAN_ROUTES.aiScannerJobReport, {
      job_id: jobId,
    });
    return response.data.data;
  },
};
