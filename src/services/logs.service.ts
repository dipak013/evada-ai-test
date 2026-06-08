import { LOG_ROUTES } from "@/config/api-routes";
import { api } from "@/lib/axios";

export interface ViewLogRow {
  id: string;
  timestamp: string | null;
  level: string;
  source: string;
  module?: string;
  message: string;
  readableMessage?: string;
  method: string | null;
  path: string | null;
  status: number | null;
  durationMs: number | null;
}

export interface ViewLogsResponse {
  results: ViewLogRow[];
  total: number;
  meta?: {
    modules?: string[];
  };
  summary?: {
    total: number;
    errors: number;
    warnings: number;
    requests: number;
  };
}

export interface ViewLogsQuery {
  clientId?: string;
  module?: string;
  fromDateTime?: string;
  toDateTime?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ApmEndpointMetric {
  endpoint: string;
  requestCount: number;
  totalTimeTakenMs: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  errorRate: number;
}

export interface ApmWaterfallItem {
  timestamp: string | null;
  method: string;
  path: string;
  status: number;
  durationMs: number;
}

export interface ApmDetailsResponse {
  numberOfRequests: number;
  totalRequests: number;
  totalTimeTakenMs: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  errorRate: number;
  endpoints: ApmEndpointMetric[];
  waterfall: ApmWaterfallItem[];
}

export interface ApmDetailsQuery {
  clientId?: string;
  fromDateTime?: string;
  toDateTime?: string;
}

export const LogsService = {
  getLogs: (query: ViewLogsQuery) =>
    api.get<ViewLogsResponse>(LOG_ROUTES.logs, {
      timeout: 120000,
      params: {
        client_id: query.clientId,
        module: query.module,
        from_datetime: query.fromDateTime,
        to_datetime: query.toDateTime,
        search: query.search,
        page: query.page,
        page_size: query.pageSize,
      },
    }),

  getApmDetails: (query?: ApmDetailsQuery) =>
    api.get<ApmDetailsResponse>(LOG_ROUTES.apm, {
      timeout: 120000,
      params: {
        client_id: query?.clientId,
        from_datetime: query?.fromDateTime,
        to_datetime: query?.toDateTime,
      },
    }),
};
