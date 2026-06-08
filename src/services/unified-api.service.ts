import { api } from "@/lib/axios";
import { encodePasswordForTransport } from "@/lib/password-obfuscation";
import {
  AUTH_ROUTES,
  APPLICATION_ROUTES,
  SCAN_ROUTES,
  SCHEDULE_ROUTES,
  DASHBOARD_ROUTES,
  AGENT_ROUTES,
  SIDEBAR_ROUTES,
} from "@/config/api-routes";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Authentication Types
export interface CSRFTokenResponse {
  csrftoken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  tenant_name: string;
}

export interface LoginResponse {
  status: string;
  message?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

// Application Configuration Types
export interface ApplicationConfig {
  id: number;
  application_name: string;
  description?: string;
  target_host: string;
  target_port?: number;
  base_url?: string;
  environment?: string;
  baseline_ttl?: number;
  enable_baseline_scan?: boolean;
  baseline_start_date?: string;
  scan_scope?: string;
  selected_pages_to_scan?: string[];
  from_scanner_output?: boolean;
  paths_to_exclude?: string[];
  network_cidr?: string;
  allowed_ports?: string;
  app_uuid: string;
  is_active: boolean;
}

export interface ApplicationConfigsResponse {
  configurations: ApplicationConfig[];
}

export interface ToggleStatusRequest {
  is_active: boolean;
}

export interface ToggleStatusResponse {
  id: number;
  is_active: boolean;
  message: string;
}

// Scan Types
export interface ScanPayload {
  app_uuid: string;
}

export interface ScanResult {
  success: boolean;
  message: string;
  output?: string;
  errors?: string | null;
  inProgress?: boolean;
}

export interface UploadScanRequest {
  file: File;
  appId: number;
}

export interface UploadScanResponse {
  success: boolean;
  message: string;
  scan_id?: string;
}

export interface LatestScanResponse {
  success: boolean;
  message: string;
  output?: string;
  errors?: string | null;
}

// Schedule Types
export interface ScheduleDataOnce {
  schedule_type: "once";
  application_id: number;
  scheduled_date: string;
  scheduled_time: string;
}

export interface ScheduleDataRecurring {
  schedule_type: "recurring";
  application_id: number;
  frequency: "daily" | "bi-weekly" | "monthly" | "quarterly" | "half-yearly" | "annually";
  start_date: string;
  scheduled_time: string;
}

export interface ScheduleDataWeekday {
  schedule_type: "weekday";
  application_id: number;
  weekday: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  scheduled_time: string;
}

export type ScheduleData = ScheduleDataOnce | ScheduleDataRecurring | ScheduleDataWeekday;

export interface ScheduleResponse {
  id: number;
  application_id: number;
  application_name: string;
  schedule_type: string;
  scheduled_date?: string;
  scheduled_time: string;
  frequency?: string;
  start_date?: string;
  weekday?: string;
  is_active: boolean;
  last_run_at?: string;
  next_run_at?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard & Analytics Types
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

export interface SentinelStatsResponse {
  activeAgents: number;
  pendingScans: number;
  criticalVulnerabilitiesLastScan: number;
  last_updated?: string;
}

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

type SeverityKey = "low" | "medium" | "high" | "critical";
export interface PastScanStatsResponse {
  title?: string;
  subtitle?: string;
  total_scans?: number;
  critical_finds?: number;
  months: string[];
  counts: Record<SeverityKey, number>[];
}

export interface RemediationNote {
  id: string;
  cve_id: string;
  title: string;
  severity: string | null;
  remediation_steps: string[];
  notes: string | null;
  source: string | null;
  version: number;
  is_active?: boolean;
  created_date?: string;
  updated_date?: string;
}

export interface RemediationResponse {
  results: RemediationNote[];
}

// Agent Types
export interface AgentFile {
  file: File;
  os: "windows" | "linux" | "macos";
}

// Sidebar Types
export interface SidebarAgentResponse {
  id: string;
  agentName: string;
  status: boolean;
  isOnline: boolean;
}

export interface SidebarClientResponse {
  id: string;
  clientName: string;
  status: boolean;
  agents: SidebarAgentResponse[];
}

// Network Scan Types
export interface ServiceVulnerability {
  [key: string]: string;
}

export interface ServiceInfo {
  name: string;
  port: number;
  vulns: string | ServiceVulnerability;
  product: string;
  version: string;
}

export interface HostInfo {
  status: string;
  services: ServiceInfo[];
}

export interface NetworkGraphData {
  [ipAddress: string]: HostInfo;
}

export interface NetworkScanResponse {
  network_scan: {
    id: string;
    graph_json: string;
    executed_at: string;
  };
}

export interface NetworkScanPayload {
  application_details: any;
}

// ============================================================================
// UNIFIED API SERVICE
// ============================================================================

export const UnifiedAPIService = {
  // ========================================================================
  // AUTHENTICATION ENDPOINTS
  // ========================================================================
  auth: {
    login: (credentials: LoginRequest) => {
      const { password, ...rest } = credentials;
      return api.post<LoginResponse>(AUTH_ROUTES.login, {
        ...rest,
        password_encoded: encodePasswordForTransport(password),
      });
    },

    register: (payload: RegisterRequest) => {
      const { password, ...rest } = payload;
      return api.post<LoginResponse>(AUTH_ROUTES.register, {
        ...rest,
        password_encoded: encodePasswordForTransport(password),
      });
    },

    me: () =>
      api.get<UserResponse>(AUTH_ROUTES.me),

    logout: () =>
      api.post(AUTH_ROUTES.logout),

    getCsrf: () =>
      api.get(AUTH_ROUTES.csrf),

    oauthExchange: (data: { code: string; provider?: "google" | "microsoft"; intent?: "login" | "signup" }) =>
      api.post<LoginResponse>(AUTH_ROUTES.oauthExchange, data),
  },

  // ========================================================================
  // APPLICATION CONFIGURATION ENDPOINTS
  // ========================================================================
  applications: {
    getAll: () =>
      api.get<ApplicationConfigsResponse>(APPLICATION_ROUTES.list),

    create: (config: Partial<ApplicationConfig>) =>
      api.post<ApplicationConfig>(APPLICATION_ROUTES.create, config),

    update: (id: number, config: Partial<ApplicationConfig>) =>
      api.put<ApplicationConfig>(APPLICATION_ROUTES.update(id), config),

    toggleStatus: (id: number, isActive: boolean) =>
      api.patch<ToggleStatusResponse>(
        APPLICATION_ROUTES.toggleStatus(id),
        { is_active: isActive }
      ),

    delete: (id: number) =>
      api.delete(APPLICATION_ROUTES.delete(id)),
  },

  // ========================================================================
  // SCANNING ENDPOINTS
  // ========================================================================
  scan: {
    startScan: (payload: ScanPayload) =>
      api.post<ScanResult>("/scan/", payload),

    runScan: (payload: any) =>
      api.post<any>("/run-scan/", payload),

    uploadFile: (file: File, appId: number) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("appId", appId.toString());
      return api.post<UploadScanResponse>("/upload/", formData);
    },

    getScanHistory: (query?: {
      clientId?: string;
      agentId?: string;
      fromDate?: string;
      toDate?: string;
      search?: string;
      page?: number;
      pageSize?: number;
    }) =>
      api.get<ScanHistoryResponse>("/scan-history/", { params: query }),

    getLatestScan: (appUuid: string) =>
      // Prefer report-backed endpoint to ensure freshest vulnerabilities
      api.get<LatestScanResponse>(SCAN_ROUTES.reportsLatest(appUuid)),
  },

  // ========================================================================
  // NETWORK SCAN ENDPOINTS
  // ========================================================================
  networkScan: {
    scan: (payload: NetworkScanPayload) =>
      api.post<NetworkScanResponse>(SCAN_ROUTES.network, payload),
  },

  // ========================================================================
  // SCHEDULE ENDPOINTS
  // ========================================================================
  schedule: {
    getAll: () =>
      api.get<ScheduleResponse[]>(SCHEDULE_ROUTES.list),

    create: (data: ScheduleData) =>
      api.post<ScheduleResponse>(SCHEDULE_ROUTES.create, data),

    getByApplication: (applicationId: number) =>
      api.get<ScheduleResponse[]>(SCHEDULE_ROUTES.byApplication(applicationId)),

    update: (scheduleId: number, data: ScheduleData) =>
      api.put<ScheduleResponse>(SCHEDULE_ROUTES.detail(scheduleId), data),

    toggleStatus: (scheduleId: number, isActive: boolean) =>
      api.patch<ScheduleResponse>(SCHEDULE_ROUTES.detail(scheduleId), { is_active: isActive }),

    delete: (scheduleId: number) =>
      api.delete(SCHEDULE_ROUTES.delete(scheduleId)),

    getByClientAgentAndType: (clientId: string, agentId: string, typeOfScan: string) =>
      api.get<ScheduleResponse[]>(
        SCHEDULE_ROUTES.byClientAndAgent(clientId as any, agentId as any, typeOfScan)
      ),
  },

  // ========================================================================
  // DASHBOARD & ANALYTICS ENDPOINTS
  // ========================================================================
  dashboard: {
    getAlerts: (query?: { clientId?: string; agentId?: string }) =>
      api.get<DashboardAlertsResponse>(DASHBOARD_ROUTES.alerts, { params: query }),

    getSentinelStats: (query?: { client?: string; agent?: string }) =>
      api.get<SentinelStatsResponse>(DASHBOARD_ROUTES.sentinelStats, { params: query }),

    getPastScanStats: (query?: {
      clientId?: string;
      agentId?: string;
      months?: number;
      fromDate?: string;
      toDate?: string;
    }) =>
      api.get<PastScanStatsResponse>(DASHBOARD_ROUTES.pastScanStats, { params: query }),

    getCVERemediation: (query?: { clientId?: string; agentId?: string }) =>
      api.get<RemediationResponse | RemediationNote[]>(DASHBOARD_ROUTES.cveRemediation, { params: query }),
  },

  // ========================================================================
  // AGENT ENDPOINTS
  // ========================================================================
  agent: {
    upload: (file: File, os: "windows" | "linux" | "macos") => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("os", os);
      return api.post(AGENT_ROUTES.upload(os), formData);
    },

    download: (os: string) =>
      api.get(AGENT_ROUTES.download(os)),
  },

  // ========================================================================
  // SIDEBAR ENDPOINTS
  // ========================================================================
  sidebar: {
    getClients: () =>
      api.get<SidebarClientResponse[]>(SIDEBAR_ROUTES.clients),
  },
};
