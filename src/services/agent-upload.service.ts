import { api } from "@/lib/axios";

export type AgentUploadTargetOs = "windows" | "linux" | "macos";

export interface UploadAgentFilePayload {
  file: File;
  os: AgentUploadTargetOs;
}

export const AgentUploadService = {
  async uploadAgentFile(payload: UploadAgentFilePayload) {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("os", payload.os);

    const response = await api.post(`/agent-upload/${payload.os}/`, formData);
    return response.data;
  },
};
