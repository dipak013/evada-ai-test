import { api } from "@/lib/axios";

export const ZapService = {
    startScan: async (payload: any) => {
        try {
            // Use the axios instance directly to call our custom zap endpoints
            const res = await api.post("/zap/scan/", payload);
            const data = res.data || res;
            // Normalize older/newer responses: if backend returns job_id, mark success
            if (data && (data.job_id || data.jobId)) {
                return { success: true, job_id: data.job_id || data.jobId, ...data };
            }
            return data;
        } catch (e: any) {
            return { success: false, error: e?.message || String(e) };
        }
    },
    getOutput: async (jobId: string, params: any = {}) => {
        try {
            const qs = new URLSearchParams(params).toString();
            const url = `/zap/jobs/${encodeURIComponent(jobId)}/output/${qs ? `?${qs}` : ""}`;
            const res = await api.get(url);
            return res.data || res;
        } catch (e: any) {
            throw e;
        }
    }
};
