import { api } from "@/lib/axios";
import { JOB_ROUTES } from "@/config/api-routes";

export interface JobTerminalOutputResponse {
  job_id: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  last_terminal_update: string | null;
  output: string;
  current_length: number;
}

export const JobTerminalService = {
  getTerminalOutput: (jobId: string, sinceLength = 0) =>
    api.get<JobTerminalOutputResponse>(JOB_ROUTES.getTerminalOutput(jobId), {
      params: { since_length: sinceLength },
    }),
};
