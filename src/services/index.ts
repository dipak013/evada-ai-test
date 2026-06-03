/**
 * Centralized API Services Export
 * All API calls are now consolidated in unified-api.service.ts
 * This file provides backward-compatible exports for easier migration
 */

import { UnifiedAPIService as UnifiedAPIServiceValue } from "./unified-api.service";

export { UnifiedAPIService } from "./unified-api.service";

// Re-export all types from unified service  
export type {
  LoginRequest,
  LoginResponse,
  UserResponse,
  ApplicationConfig,
  ApplicationConfigsResponse,
  ToggleStatusRequest,
  ToggleStatusResponse,
  ScanPayload,
  ScanResult,
  UploadScanRequest,
  UploadScanResponse,
  LatestScanResponse,
  ScheduleData,
  ScheduleDataOnce,
  ScheduleDataRecurring,
  ScheduleDataWeekday,
  ScheduleResponse,
  DashboardAlertsResponse,
  SentinelStatsResponse,
  ScanHistoryResponse,
  PastScanStatsResponse,
  RemediationNote,
  RemediationResponse,
  NetworkScanResponse,
  SidebarClientResponse,
  SidebarAgentResponse,
} from "./unified-api.service";

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// These point to the unified service for smooth migration from individual services
// ============================================================================

/**
 * @deprecated Use UnifiedAPIService.auth instead
 * Provided for backward compatibility
 */
export const AuthService = {
  me: () => UnifiedAPIServiceValue.auth.me(),
  logout: () => UnifiedAPIServiceValue.auth.logout(),
};

/**
 * @deprecated Use UnifiedAPIService.applications instead
 * Provided for backward compatibility
 */
export const ApplicationConfigService = {
  getAll: () => UnifiedAPIServiceValue.applications.getAll(),
  create: (config: any) => UnifiedAPIServiceValue.applications.create(config),
  update: (id: number, config: any) => UnifiedAPIServiceValue.applications.update(id, config),
  toggleStatus: (id: number, isActive: boolean) =>
    UnifiedAPIServiceValue.applications.toggleStatus(id, isActive),
  delete: (id: number) => UnifiedAPIServiceValue.applications.delete(id),
};

/**
 * @deprecated Use UnifiedAPIService.scan instead
 * Provided for backward compatibility
 */
export const ScanService = {
  startScan: (payload: any) => UnifiedAPIServiceValue.scan.startScan(payload),
  runScan: (payload: any) => UnifiedAPIServiceValue.scan.runScan(payload),
  uploadFile: (file: File, appId: number) => UnifiedAPIServiceValue.scan.uploadFile(file, appId),
  getScanHistory: (query?: any) => UnifiedAPIServiceValue.scan.getScanHistory(query),
  getLatestScan: (appUuid: string) => UnifiedAPIServiceValue.scan.getLatestScan(appUuid),
};

/**
 * @deprecated Use UnifiedAPIService.schedule instead
 * Provided for backward compatibility
 */
export const ScheduleService = {
  getAll: () => UnifiedAPIServiceValue.schedule.getAll(),
  create: (data: any) => UnifiedAPIServiceValue.schedule.create(data),
  upsertSchedule: (data: any) => UnifiedAPIServiceValue.schedule.create(data),
  createNetworkSchedule: (data: any) => UnifiedAPIServiceValue.schedule.create(data),
  updateNetworkSchedule: (id: number, data: any) => UnifiedAPIServiceValue.schedule.update(id, data),
  getSchedulesByApplication: (appId: number) => UnifiedAPIServiceValue.schedule.getByApplication(appId),
  getAllSchedules: () => UnifiedAPIServiceValue.schedule.getAll(),
  updateSchedule: (id: number, data: any) => UnifiedAPIServiceValue.schedule.update(id, data),
  toggleScheduleStatus: (id: number, isActive: boolean) =>
    UnifiedAPIServiceValue.schedule.toggleStatus(id, isActive),
  deleteSchedule: (id: number) => UnifiedAPIServiceValue.schedule.delete(id),
  getSchedulesByClientAgentAndType: (clientId: string, agentId: string, typeOfScan: string) =>
    UnifiedAPIServiceValue.schedule.getByClientAgentAndType(clientId, agentId, typeOfScan),
};

/**
 * @deprecated Use UnifiedAPIService.dashboard instead
 * Provided for backward compatibility
 */
export const DashboardAlertsService = {
  getLastScanAlerts: (query: any) => UnifiedAPIServiceValue.dashboard.getAlerts(query),
};

/**
 * @deprecated Use UnifiedAPIService.dashboard instead
 * Provided for backward compatibility
 */
export const SentinelStatsService = {
  getStats: (query?: any) => UnifiedAPIServiceValue.dashboard.getSentinelStats(query),
};

/**
 * @deprecated Use UnifiedAPIService.scan instead
 * Provided for backward compatibility
 */
export const ScanHistoryService = {
  getScanHistory: (query: any) => UnifiedAPIServiceValue.scan.getScanHistory(query),
};

/**
 * @deprecated Use UnifiedAPIService.dashboard instead
 * Provided for backward compatibility
 */
export const PastScanStatsService = {
  getPastScanStats: (query: any) => UnifiedAPIServiceValue.dashboard.getPastScanStats(query),
};

/**
 * @deprecated Use UnifiedAPIService.dashboard instead
 * Provided for backward compatibility
 */
export const RemediationService = {
  getRemediationNotes: (query: any) => UnifiedAPIServiceValue.dashboard.getCVERemediation(query),
};

/**
 * @deprecated Use UnifiedAPIService.agent instead
 * Provided for backward compatibility
 */
export const AgentUploadService = {
  uploadAgentFile: (payload: any) => UnifiedAPIServiceValue.agent.upload(payload.file, payload.os),
};

/**
 * @deprecated Use UnifiedAPIService.agent instead
 * Provided for backward compatibility
 */
export const AgentDownloadService = {
  downloadAgent: (os: string) => UnifiedAPIServiceValue.agent.download(os),
};

/**
 * @deprecated Use UnifiedAPIService.sidebar instead
 * Provided for backward compatibility
 */
export const SidebarService = {
  getSidebarClients: () => UnifiedAPIServiceValue.sidebar.getClients(),
};

/**
 * @deprecated Use UnifiedAPIService.networkScan instead
 * Provided for backward compatibility
 */
export const NetworkScanService = {
  scanNetwork: (payload: any) => UnifiedAPIServiceValue.networkScan.scan(payload),
  parseGraphJson: (graphJson: string) => {
    try {
      return JSON.parse(graphJson);
    } catch (error) {
      console.error("Error parsing graph_json:", error);
      throw new Error("Invalid graph_json format");
    }
  },
};
