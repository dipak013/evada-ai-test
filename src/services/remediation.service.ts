import { api } from "@/lib/axios";

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

export interface RemediationQuery {
  clientId?: string;
  agentId?: string;
}

export const RemediationService = {
  getRemediationNotes: (query: RemediationQuery) =>
    api.get<RemediationResponse | RemediationNote[]>("/cve-remediation/", {
      params: {
        client_id: query.clientId,
        agent_id: query.agentId,
      },
    }),
};
