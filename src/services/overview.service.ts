import { api } from "@/lib/axios";

export const OverviewService = {
  getOverview: (params: Record<string, any> = {}) => api.get("/overview/", { params }),
};

export default OverviewService;
