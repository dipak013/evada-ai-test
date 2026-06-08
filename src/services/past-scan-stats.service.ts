import { api } from "@/lib/axios";

type SeverityKey = "low" | "medium" | "high" | "critical";
export type SeverityCount = Record<SeverityKey, number>;

export interface PastScanStatsQuery {
  clientId?: string;
  agentId?: string;
  months?: number;
  fromDate?: string;
  toDate?: string;
}

export interface PastScanStatsResponse {
  title?: string;
  subtitle?: string;
  total_scans?: number;
  critical_finds?: number;
  months: string[];
  counts: SeverityCount[];
}

export const PastScanStatsService = {
  getPastScanStats: (query: PastScanStatsQuery) =>
    api.get<PastScanStatsResponse>("/past-scan-stats/", {
      params: {
        client_id: query.clientId,
        agent_id: query.agentId,
        months: query.months,
        from_date: query.fromDate,
        to_date: query.toDate,
      },
    }),
};
