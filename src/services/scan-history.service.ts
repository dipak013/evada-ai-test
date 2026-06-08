import { api } from "@/lib/axios";
import { SCAN_ROUTES } from "@/config/api-routes";

export interface ScanHistoryRow {
  id: string;
  applicationName: string;
  scanDate: string;
  scanTime: string;
  scanType: string;
  target: string;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  status: "Completed" | "Running" | "Failed";
}

export interface ScanHistoryResponse {
  results: ScanHistoryRow[];
  total: number;
}

export interface ScanHistoryQuery {
  clientId?: string;
  agentId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const ScanHistoryService = {
  getScanHistory: (query: ScanHistoryQuery) =>
    api.get<ScanHistoryResponse>(SCAN_ROUTES.history, {
      params: {
        client_id: query.clientId,
        agent_id: query.agentId,
        from_date: query.fromDate,
        to_date: query.toDate,
        search: query.search,
        page: query.page,
        page_size: query.pageSize,
      },
    }),

  downloadScanJson: (scanId: string) =>
    api.get(SCAN_ROUTES.historyDownloadJson(scanId), {
      responseType: "blob",
    }),

  downloadScanRawJson: (scanId: string) =>
    api.get(SCAN_ROUTES.historyDownloadRawJson(scanId), {
      responseType: "blob",
    }),
};
