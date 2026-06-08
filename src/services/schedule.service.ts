import { api } from "@/lib/axios";

export interface ScheduleDataOnce {
  schedule_type: "once";
  application_id: number;
  scheduled_date: string; // YYYY-MM-DD format
  scheduled_time: string; // HH:MM format (24-hour)
}

export interface ScheduleDataRecurring {
  schedule_type: "recurring";
  application_id: number;
  frequency: "daily" | "bi-weekly" | "monthly" | "quarterly" | "half-yearly" | "annually";
  start_date: string; // YYYY-MM-DD format
  scheduled_time: string; // HH:MM format (24-hour)
}

export interface ScheduleDataWeekday {
  schedule_type: "weekday";
  application_id: number;
  weekday: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  scheduled_time: string; // HH:MM format (24-hour)
}

export type ScheduleData = ScheduleDataOnce | ScheduleDataRecurring | ScheduleDataWeekday;

export interface NetworkScheduleDataOnce {
  schedule_type: "once";
  type_of_scan: "network_scan";
  client_id: string;
  agent_id: string;
  scheduled_date: string; // YYYY-MM-DD format
  scheduled_time: string; // HH:MM format (24-hour)
}

export interface NetworkScheduleDataRecurring {
  schedule_type: "recurring";
  type_of_scan: "network_scan";
  client_id: string;
  agent_id: string;
  frequency: "daily" | "bi-weekly" | "monthly" | "quarterly" | "half-yearly" | "annually";
  start_date: string; // YYYY-MM-DD format
  scheduled_time: string; // HH:MM format (24-hour)
}

export interface NetworkScheduleDataWeekday {
  schedule_type: "weekday";
  type_of_scan: "network_scan";
  client_id: string;
  agent_id: string;
  weekday: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  scheduled_time: string; // HH:MM format (24-hour)
}

export type NetworkScheduleData =
  | NetworkScheduleDataOnce
  | NetworkScheduleDataRecurring
  | NetworkScheduleDataWeekday;

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

export const ScheduleService = {
  /**
   * Create or update schedule for an application (Upsert)
   * If a schedule exists for the application, it will be updated
   * Otherwise, a new schedule will be created
   * @param scheduleData - Schedule configuration data
   * @returns Promise with schedule response (201 for create, 200 for update)
   */
  upsertSchedule: (scheduleData: ScheduleData) => 
    api.post<ScheduleResponse>("/schedules/", scheduleData),

  /**
   * Create a schedule for network scans by client and agent
   * @param scheduleData - Network scan schedule payload
   * @returns Promise with schedule response
   */
  createNetworkSchedule: (scheduleData: NetworkScheduleData) =>
    api.post<ScheduleResponse>("/schedules/", scheduleData),

  /**
   * Update an existing network scan schedule by id
   * @param scheduleId - ID of the schedule to update
   * @param scheduleData - Network scan schedule payload
   * @returns Promise with updated schedule response
   */
  updateNetworkSchedule: (scheduleId: number, scheduleData: NetworkScheduleData) =>
    api.put<ScheduleResponse>(`/schedules/${scheduleId}/`, scheduleData),

  /**
   * Get all active schedules for all applications
   * Only returns schedules with is_active=true
   * @returns Promise with array of active schedules
   */
  getAllSchedules: () => 
    api.get<ScheduleResponse[]>("/schedules/"),

  /**
   * Get all active schedules for a specific application
   * Only returns schedules with is_active=true
   * @param applicationId - ID of the application
   * @returns Promise with array of active schedules
   */
  getSchedulesByApplication: (applicationId: number) => 
    api.get<ScheduleResponse[]>(`/schedules/application/${applicationId}/`),

  /**
   * Fully update an existing schedule
   * @param scheduleId - ID of the schedule to update
   * @param scheduleData - Updated schedule configuration data
   * @returns Promise with updated schedule response
   */
  updateSchedule: (scheduleId: number, scheduleData: ScheduleData) => 
    api.put<ScheduleResponse>(`/schedules/${scheduleId}/`, scheduleData),

  /**
   * Toggle schedule active status
   * @param scheduleId - ID of the schedule
   * @param isActive - New active status
   * @returns Promise with updated schedule response
   */
  toggleScheduleStatus: (scheduleId: number, isActive: boolean) => 
    api.patch<ScheduleResponse>(`/schedules/${scheduleId}/`, { is_active: isActive }),

  /**
   * Delete a schedule
   * @param scheduleId - ID of the schedule to delete
   * @returns Promise (204 No Content)
   */
  deleteSchedule: (scheduleId: number) => 
    api.delete(`/schedules/${scheduleId}/`),

  /**
   * Get schedules by client, agent, and scan type
   * @param clientId - Client ID
   * @param agentId - Agent ID
   * @param typeOfScan - Scan type
   * @returns Promise with array of schedules
   */
  getSchedulesByClientAgentAndType: (clientId: string, agentId: string, typeOfScan: string) =>
    api.get<ScheduleResponse[]>(`/schedules/client/${clientId}/agent/${agentId}/type/${typeOfScan}/`),
};
