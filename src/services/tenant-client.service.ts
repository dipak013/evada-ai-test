import { api } from "@/lib/axios";
import { CLIENT_MANAGEMENT_ROUTES, TENANT_MANAGEMENT_ROUTES } from "@/config/api-routes";

export const TenantClientService = {
  listTenants: async () => {
    const resp = await api.get(TENANT_MANAGEMENT_ROUTES.tenants);
    return resp.data;
  },

  createTenant: async (payload: { name: string; slug?: string; domain?: string; is_active?: boolean; max_users?: number }) => {
    const resp = await api.post(TENANT_MANAGEMENT_ROUTES.tenants, payload);
    return resp.data;
  },
  updateTenant: async (tenantId: number, payload: { name?: string; slug?: string; domain?: string; is_active?: boolean; max_users?: number }) => {
    const resp = await api.patch(`${TENANT_MANAGEMENT_ROUTES.tenants}${tenantId}/`, payload);
    return resp.data;
  },
  deleteTenant: async (tenantId: number) => {
    const resp = await api.delete(`${TENANT_MANAGEMENT_ROUTES.tenants}${tenantId}/`);
    return resp.data;
  },

  listClients: async () => {
    const resp = await api.get(CLIENT_MANAGEMENT_ROUTES.clients);
    return resp.data;
  },

  createClient: async (payload: { client_name: string; client_status?: boolean; tenant_id?: number }) => {
    const resp = await api.post(CLIENT_MANAGEMENT_ROUTES.clients, payload);
    return resp.data;
  },
  deleteClient: async (clientId: number) => {
    const resp = await api.delete(`${CLIENT_MANAGEMENT_ROUTES.clients}${clientId}/`);
    return resp.data;
  },
  reassignClient: async (clientId: number, payload: { tenant_id: number }) => {
    const resp = await api.patch(`${CLIENT_MANAGEMENT_ROUTES.clients}${clientId}/`, payload);
    return resp.data;
  },
};

export default TenantClientService;
