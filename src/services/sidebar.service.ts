import { api } from "@/lib/axios";

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

let sidebarClientsCache: SidebarClientResponse[] | null = null;
let sidebarClientsInFlight: Promise<SidebarClientResponse[]> | null = null;

export const SidebarService = {
  async getSidebarClients(): Promise<SidebarClientResponse[]> {
    const response = await api.get<SidebarClientResponse[]>("/clients/sidebar/");
    return response.data;
  },

  async getSidebarClientsCached(options?: { forceRefresh?: boolean }): Promise<SidebarClientResponse[]> {
    const forceRefresh = options?.forceRefresh === true;

    if (!forceRefresh && sidebarClientsCache) {
      return sidebarClientsCache;
    }

    if (!forceRefresh && sidebarClientsInFlight) {
      return sidebarClientsInFlight;
    }

    sidebarClientsInFlight = api
      .get<SidebarClientResponse[]>("/clients/sidebar/")
      .then((response) => {
        sidebarClientsCache = response.data;
        return response.data;
      })
      .finally(() => {
        sidebarClientsInFlight = null;
      });

    return sidebarClientsInFlight;
  },

  clearSidebarClientsCache(): void {
    sidebarClientsCache = null;
  },
};
