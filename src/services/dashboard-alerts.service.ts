import { api } from "@/lib/axios";

export interface DashboardAlertCve {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
}

export interface DashboardAlertItem {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  cves: DashboardAlertCve[];
}

export interface DashboardAlertsResponse {
  title: string;
  alerts: DashboardAlertItem[];
}

export interface DashboardAlertsQuery {
  clientId?: string;
  agentId?: string;
}

export const DashboardAlertsService = {
  getLastScanAlerts: (query: DashboardAlertsQuery) =>
    api.get<DashboardAlertsResponse>("/dashboard-alerts/", {
      params: {
        client_id: query.clientId,
        agent_id: query.agentId,
      },
    }),
};