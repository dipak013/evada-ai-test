import { api } from "@/lib/axios";

export interface ClientRow {
  id: string;
  clientName: string;
  status: boolean;
  isOnline: boolean;
  agentCount: number;
  createdDate: string | null;
  updatedDate: string | null;
}

export interface AgentRow {
  id: string;
  agentName: string;
  status: boolean;
  isOnline: boolean;
  clientId: string;
  clientName: string | null;
  agentUuid: string | null;
  lastHeartbeat: string | null;
  licenseKey: string | null;
  licenseTier: string | null;
  licenseActive: boolean;
  deviceLimit: number | null;
  licenseExpiresAt: string | null;
  createdDate: string | null;
  updatedDate: string | null;
}

export interface AgentStatusRow {
  agent_id: string;
  agent_name: string;
  agent_uuid: string | null;
  last_seen: string | null;
  age_s: number | null;
  status: "alive" | "stale";
  license_tier: string | null;
  license_active: boolean;
  device_limit: number | null;
}

export interface AgentLicenseRow {
  agent_id: string;
  agent_name: string;
  client_id: string;
  client_name: string | null;
  agent_uuid: string | null;
  license_key: string;
  tier: string;
  device_limit: number;
  is_active: boolean;
  expires_at: string | null;
  updated_at: string | null;
}

export interface SaveAgentLicensePayload {
  agent_id: string;
  license_key?: string;
  generate_key?: boolean;
  agent_uuid?: string;
  generate_agent_uuid?: boolean;
  tier: string;
  device_limit: number;
  is_active?: boolean;
  expires_at?: string | null;
}

export interface SaveAgentLicenseResponse {
  message: string;
  license: {
    agent_id: string;
    agent_uuid?: string | null;
    license_key: string;
    tier: string;
    device_limit: number;
    is_active: boolean;
    expires_at: string | null;
  };
}

export interface GenerateAgentLicensePayload {
  agent_id: string;
  tier: string;
  device_limit: number;
  is_active?: boolean;
  expires_at?: string | null;
}

export interface AgentUuidMappingPayload {
  agent_id: string;
  agent_uuid?: string;
  generate_agent_uuid?: boolean;
}

export interface AgentUuidMappingResponse {
  message: string;
  agent: {
    agent_id: string;
    agent_name: string;
    agent_uuid: string | null;
  };
}

export interface CreateClientPayload {
  client_name: string;
  client_status?: boolean;
}

export interface CreateAgentPayload {
  client_id: string;
  agent_name: string;
  agent_status?: boolean;
}

export interface UpdateClientPayload {
  client_name?: string;
  client_status?: boolean;
}

export interface UpdateAgentPayload {
  client_id?: string;
  agent_name?: string;
  agent_status?: boolean;
}

export interface CreateClientResponse {
  message: string;
  client: {
    id: string;
    clientName: string;
    status: boolean;
  };
}

export interface CreateAgentResponse {
  message: string;
  agent: {
    id: string;
    agentName: string;
    status: boolean;
    clientId: string;
    clientName: string;
  };
}

export interface UpdateClientResponse {
  message: string;
  client: {
    id: string;
    clientName: string;
    status: boolean;
  };
}

export interface UpdateAgentResponse {
  message: string;
  agent: {
    id: string;
    agentName: string;
    status: boolean;
    clientId: string;
    clientName: string;
  };
}

export const ClientAgentService = {
  async getClients() {
    return api.get<ClientRow[]>("/clients/");
  },

  async getAgents() {
    return api.get<AgentRow[]>("/agents/");
  },

  async createClient(payload: CreateClientPayload) {
    return api.post<CreateClientResponse>("/clients/", payload);
  },

  async createAgent(payload: CreateAgentPayload) {
    return api.post<CreateAgentResponse>("/agents/", payload);
  },

  async getAgentStatuses() {
    return api.get<{ agents: AgentStatusRow[] }>("/agent/status/");
  },

  async getAgentLicenses() {
    return api.get<AgentLicenseRow[]>("/agent/licenses/");
  },

  async saveAgentLicense(payload: SaveAgentLicensePayload) {
    return api.post<SaveAgentLicenseResponse>("/agent/licenses/", payload);
  },

  async generateAgentLicense(payload: GenerateAgentLicensePayload) {
    return api.post<SaveAgentLicenseResponse>("/agent/licenses/", {
      ...payload,
      generate_key: true,
    });
  },

  async mapAgentUuid(payload: AgentUuidMappingPayload) {
    return api.post<AgentUuidMappingResponse>("/agent/licenses/", {
      ...payload,
      mapping_only: true,
    });
  },

  async updateClient(clientId: string, payload: UpdateClientPayload) {
    return api.patch<UpdateClientResponse>(`/clients/${clientId}/`, payload);
  },

  async softDeleteClient(clientId: string) {
    return api.delete<{ message: string }>(`/clients/${clientId}/`);
  },

  async updateAgent(agentId: string, payload: UpdateAgentPayload) {
    return api.patch<UpdateAgentResponse>(`/agents/${agentId}/`, payload);
  },

  async softDeleteAgent(agentId: string) {
    return api.delete<{ message: string }>(`/agents/${agentId}/`);
  },
};
