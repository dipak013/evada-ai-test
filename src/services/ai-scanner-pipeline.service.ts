import { api } from "@/lib/axios";
import { SCAN_ROUTES } from "@/config/api-routes";

export type PipelineState = "Waiting" | "Running" | "Completed" | "Failed";

export interface AiScannerPipelineRow {
  order: string;
  key: string;
  stage: string;
  detail: string;
  state: PipelineState;
}

export interface AiScannerLiveEvent {
  id: number;
  stage: string | null;
  level: string | null;
  message: string;
  created_at: string | null;
}

export interface AiScannerJob {
  id: string;
  job_name: string | null;
  status: string | null;
  stage: string | null;
  target_url: string | null;
  input_file: string | null;
  output_file: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AiScannerPipelinePayload {
  job: AiScannerJob | null;
  pipeline: AiScannerPipelineRow[];
  events: AiScannerLiveEvent[];
  is_active: boolean;
}

interface ApiEnvelope {
  success: boolean;
  data: AiScannerPipelinePayload;
  error?: string;
}

export const AiScannerPipelineService = {
  async getActive(jobId?: string, sinceId?: number): Promise<AiScannerPipelinePayload> {
    const response = await api.get<ApiEnvelope>(SCAN_ROUTES.aiScannerActivePipeline, {
      params: {
        ...(jobId ? { job_id: jobId } : {}),
        ...(typeof sinceId === "number" ? { since_id: sinceId } : {}),
      },
    });
    return response.data.data;
  },

  async getJobLive(jobId: string, sinceId?: number): Promise<AiScannerPipelinePayload> {
    const response = await api.get<ApiEnvelope>(SCAN_ROUTES.aiScannerJobLive(jobId), {
      params: {
        ...(typeof sinceId === "number" ? { since_id: sinceId } : {}),
      },
    });
    return response.data.data;
  },
};
