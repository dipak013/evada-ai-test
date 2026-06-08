import { api } from "@/lib/axios";

export interface SentinelStatsResponse {
  activeAgents: number;
  pendingScans: number;
  criticalVulnerabilitiesLastScan: number;
  last_updated?: string;
}

export interface SentinelStatsQuery {
  client?: string;
  agent?: string;
}

export const SentinelStatsService = {
  getStats: (query?: SentinelStatsQuery) =>
    api.get<SentinelStatsResponse>("/sentinel-stats/", {
      params: {
        client: query?.client,
        agent: query?.agent,
      },
    }),
};
