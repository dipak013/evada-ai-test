import { api } from "@/lib/axios";
import { SCAN_ROUTES } from "@/config/api-routes";

export interface AiScannerLaunchResponse {
  success: boolean;
  message: string;
  data?: {
    job_id: string;
    status: string;
    stage: string;
    poll_interval_ms?: number;
    report_id?: number | null;
    archived_file?: string | null;
    normalized_file?: string | null;
    summary?: {
      total_vulnerabilities?: number;
      successful?: number;
      failed?: number;
      [key: string]: unknown;
    };
  };
  error?: string;
}

export const AiScannerLaunchService = {
  async launch(file: File, payload?: { jobName?: string; sandboxTarget?: string }): Promise<AiScannerLaunchResponse> {
    const formData = new FormData();
    formData.append("file", file);

    if (payload?.jobName?.trim()) {
      formData.append("job_name", payload.jobName.trim());
    }
    if (payload?.sandboxTarget?.trim()) {
      formData.append("sandbox_target", payload.sandboxTarget.trim());
    }

    const response = await api.post<AiScannerLaunchResponse>(SCAN_ROUTES.aiScannerLaunch, formData, {
      timeout: 60 * 1000,
    });

    return response.data;
  },
};
