/**
 * API Routes Configuration
 * ============================================================================
 * Similar to Django's urls.py, this file serves as the single source of truth
 * for all API endpoints. Update routes here and they're referenced throughout
 * the application.
 *
 * Benefits:
 * - Single source of truth for all endpoints
 * - Easy to see all available endpoints at a glance
 * - Simple to refactor/rename endpoints globally
 * - Supports future versioning (e.g., /v1/, /v2/)
 * - No hardcoded strings scattered across the codebase
 * - Easy to add documentation/comments
 * - Consistency across the entire frontend
 */

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================
export const AUTH_ROUTES = {
  login: "/auth/login/",
  logout: "/auth/logout/",
  me: "/auth/me/",
  register: "/auth/register/",
  csrf: "/auth/csrf/",
  oauthExchange: "/oauth/exchange/",
  oauthAuthorize: "/o/authorize/",
} as const;

// ============================================================================
// APPLICATION CONFIGURATION ROUTES
// ============================================================================
export const APPLICATION_ROUTES = {
  list: "/application-configs/",
  create: "/configure-new-app/",
  // Dynamic routes with parameters
  detail: (id: number) => `/application-configs/${id}/`,
  update: (id: number) => `/application-configs/${id}/`,
  toggleStatus: (id: number) => `/application-configs/${id}/toggle-status/`,
  delete: (id: number) => `/application-configs/${id}/delete/`,
} as const;

// ============================================================================
// SCANNING ROUTES
// ============================================================================
export const SCAN_ROUTES = {
  start: "/scan/",
  run: "/run-scan/",
  upload: "/upload/",
  aiScannerLaunch: "/ai-scanner/launch/",
  aiScannerActivePipeline: "/ai-scanner/jobs/active/",
  aiScannerJobLive: (jobId: string) => `/ai-scanner/jobs/${jobId}/live/`,
  aiScannerJobReport: "/ai-scanner/jobs/report/",
  aiScannerReportsDashboard: "/ai-scanner/reports/dashboard/",
  aiScannerKnowledgeBase: "/ai-scanner/knowledge-base/",
  history: "/scan-history/",
  historyDownloadJson: (scanId: string) => `/scan-history/${scanId}/download-json/`,
  historyDownloadRawJson: (scanId: string) => `/scan-history/${scanId}/download-raw-json/`,
  results: (appId: string) => `/scan-results/${appId}/`,
  network: "/scan-network",
  latestScan: (appUuid: string) => `/applications/${appUuid}/latest-scan/`,
  reportsLatest: (appUuid: string) => `/applications/${appUuid}/reports/latest/`,
} as const;

// ============================================================================
// SCHEDULE ROUTES
// ============================================================================
export const SCHEDULE_ROUTES = {
  list: "/schedules/",
  create: "/schedules/",
  detail: (id: number) => `/schedules/${id}/`,
  update: (id: number) => `/schedules/${id}/`,
  delete: (id: number) => `/schedules/${id}/`,
  byApplication: (applicationId: number) => `/schedules/application/${applicationId}/`,
  byClient: (clientId: number, typeOfScan: string) =>
    `/schedules/client/${clientId}/type/${typeOfScan}/`,
  byClientAndAgent: (clientId: number, agentId: number, typeOfScan: string) =>
    `/schedules/client/${clientId}/agent/${agentId}/type/${typeOfScan}/`,
} as const;

// ============================================================================
// DASHBOARD & ANALYTICS ROUTES
// ============================================================================
export const DASHBOARD_ROUTES = {
  alerts: "/dashboard-alerts/",
  sentinelStats: "/sentinel-stats/",
  pastScanStats: "/past-scan-stats/",
  cveRemediation: "/cve-remediation/",
} as const;

// ============================================================================
// LOGS & OBSERVABILITY ROUTES
// ============================================================================
export const LOG_ROUTES = {
  logs: "/logs/audit/",
  apm: "/logs/apm/",
} as const;

// ============================================================================
// AGENT ROUTES
// ============================================================================
export const AGENT_ROUTES = {
  upload: (os: string) => `/agent-upload/${os}/`,
  download: (os: string) => `/agent-download/${os}/`,
} as const;

// ============================================================================
// SIDEBAR ROUTES
// ============================================================================
export const SIDEBAR_ROUTES = {
  clients: "/clients/sidebar/",
} as const;

// ============================================================================
// TENANT & USER ROUTES
// ============================================================================
export const TENANT_ROUTES = {
  users: "/tenant/users/",
  invite: "/tenant/invite/",
} as const;

export const TENANT_MANAGEMENT_ROUTES = {
  tenants: "/tenants/",
} as const;

export const CLIENT_MANAGEMENT_ROUTES = {
  clients: "/clients/",
  clientDetail: (id: number) => `/clients/${id}/`,
} as const;

// ============================================================================
// SUPERADMIN ROUTES
// ============================================================================
export const SUPERADMIN_ROUTES = {
  usersAccess: "/superadmin/users-access/",
  updateUserAccess: (userId: number) => `/superadmin/users-access/${userId}/`,
} as const;

// ============================================================================
// JOB & UPLOAD ROUTES
// ============================================================================
export const JOB_ROUTES = {
  pending: "/jobs/pending/",
  uploadScan: "/upload-scan/",
  postTerminalOutput: "/jobs/terminal-output/",
  getTerminalOutput: (jobId: string) => `/jobs/${jobId}/terminal-output/`,
} as const;

// ============================================================================
// HEALTH CHECK ROUTES
// ============================================================================
export const HEALTH_ROUTES = {
  health: "/health/",
} as const;

// ============================================================================
// GROUPED ROUTE COLLECTIONS
// ============================================================================
/**
 * All routes grouped by feature/domain for easy reference
 */
export const API_ROUTES = {
  auth: AUTH_ROUTES,
  applications: APPLICATION_ROUTES,
  scan: SCAN_ROUTES,
  schedule: SCHEDULE_ROUTES,
  dashboard: DASHBOARD_ROUTES,
  logs: LOG_ROUTES,
  agent: AGENT_ROUTES,
  sidebar: SIDEBAR_ROUTES,
  tenant: TENANT_ROUTES,
  superadmin: SUPERADMIN_ROUTES,
  tenantManagement: TENANT_MANAGEMENT_ROUTES,
  clientManagement: CLIENT_MANAGEMENT_ROUTES,
  job: JOB_ROUTES,
  health: HEALTH_ROUTES,
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Type helper: Get all route values from a route object
 * Useful for type checking and autocomplete
 */
export type AuthRoute = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES];
export type ApplicationRoute = typeof APPLICATION_ROUTES[keyof typeof APPLICATION_ROUTES];
export type ScanRoute = typeof SCAN_ROUTES[keyof typeof SCAN_ROUTES];
export type ScheduleRoute = typeof SCHEDULE_ROUTES[keyof typeof SCHEDULE_ROUTES];
export type DashboardRoute = typeof DASHBOARD_ROUTES[keyof typeof DASHBOARD_ROUTES];
export type LogRoute = typeof LOG_ROUTES[keyof typeof LOG_ROUTES];
export type AgentRoute = typeof AGENT_ROUTES[keyof typeof AGENT_ROUTES];
export type SidebarRoute = typeof SIDEBAR_ROUTES[keyof typeof SIDEBAR_ROUTES];

// ============================================================================
// ROUTE VALIDATION & DOCUMENTATION
// ============================================================================

/**
 * Optional: Helper function to validate route existence
 * Useful for detecting typos at compile time
 */
export function validateRoute(route: string): boolean {
  const allRoutes = Object.entries(API_ROUTES).flatMap(([, routes]) =>
    Object.values(routes)
  );
  return allRoutes.some((r) =>
    typeof r === "string" ? r === route : typeof r === "function"
  );
}

type RouteFactory = (...args: unknown[]) => string;

/**
 * Optional: Get all available routes for documentation/debugging
 */
export function getAllRoutes(): Record<string, string | ((...args: unknown[]) => string)> {
  const result: Record<string, string | RouteFactory> = {};
  
  Object.entries(API_ROUTES).forEach(([domain, routes]) => {
    Object.entries(routes).forEach(([routeName, routeValue]) => {
      result[`${domain}.${routeName}`] = routeValue;
    });
  });
  
  return result;
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * USAGE EXAMPLES:
 * 
 * Example 1: Direct usage
 * ```typescript
 * import { AUTH_ROUTES } from "@/config/api-routes";
 * const loginUrl = AUTH_ROUTES.login; // "/auth/login/"
 * ```
 * 
 * Example 2: With dynamic routes
 * ```typescript
 * import { APPLICATION_ROUTES } from "@/config/api-routes";
 * const appUrl = APPLICATION_ROUTES.detail(123); // "/application-configs/123/"
 * ```
 * 
 * Example 3: In UnifiedAPIService
 * ```typescript
 * import { AUTH_ROUTES, SCAN_ROUTES } from "@/config/api-routes";
 * export const UnifiedAPIService = {
 *   auth: {
 *     login: (credentials) => api.post(AUTH_ROUTES.login, credentials),
 *   },
 * };
 * ```
 * 
 * Example 4: Type-safe route usage
 * ```typescript
 * function makeRequest(route: AuthRoute, data: any) {
 *   return fetch(`/api${route}`, { method: "POST", body: JSON.stringify(data) });
 * }
 * ```
 * 
 * See docs/API_ROUTES_CONFIGURATION.md for complete examples.
 */
