import { api } from "@/lib/axios";
import { SCAN_ROUTES } from "@/config/api-routes";
import { AiScannerVulnerabilityRow } from "@/services/ai-scanner-vulnerabilities.service";

export type ReportStatus = "Ready" | "Generating" | "Scheduled" | "Failed";

export interface AiScannerMonthlyBarPoint {
  year: number;
  month: number;
  label: string;
  value: number;
  CRITICAL?: number;
  HIGH?: number;
  MEDIUM?: number;
  LOW?: number;
}

export interface AiScannerReportRow {
  id: string;
  report_id: number;
  job_id: string;
  title: string;
  status: ReportStatus;
  generated: string | null;
  author: string;
  scope: string;
  vulnerabilities_count: number;
  exploitable_count: number;
  vulnerabilities: AiScannerVulnerabilityRow[];
}

export interface AiScannerReportsCards {
  ready: number;
  generating: number;
  scheduled: number;
  failed: number;
  total: number;
}

export interface AiScannerVulnerabilityDashboardCards {
  total_cves_tracked: number;
  active_exploits: number;
  intel_sources: number;
  avg_risk_score: number;
}

export interface AiScannerSeverityDistribution {
  CRITICAL: number;
  HIGH: number;
  MEDIUM: number;
  LOW: number;
  total: number;
}

export interface AiScannerDashboardVulnerabilityRow extends AiScannerVulnerabilityRow {
  job_id: string;
  report_id: number;
  report_generated: string | null;
}

export interface AiScannerReportsDashboardPayload {
  cards: AiScannerReportsCards;
  monthly: AiScannerMonthlyBarPoint[];
  reports: AiScannerReportRow[];
  vulnerability_cards?: AiScannerVulnerabilityDashboardCards;
  severity_distribution?: AiScannerSeverityDistribution;
  vulnerability_monthly?: AiScannerMonthlyBarPoint[];
  latest_vulnerabilities?: AiScannerDashboardVulnerabilityRow[];
}

interface ApiEnvelope {
  success: boolean;
  data: AiScannerReportsDashboardPayload;
  error?: string;
}

export const AiScannerReportsService = {
  async getDashboard(): Promise<AiScannerReportsDashboardPayload> {
    const response = await api.post<ApiEnvelope>(SCAN_ROUTES.aiScannerReportsDashboard, {});
    return response.data.data;
  },
};
