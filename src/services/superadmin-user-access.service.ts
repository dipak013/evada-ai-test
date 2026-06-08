import { api } from "@/lib/axios";
import { SUPERADMIN_ROUTES } from "@/config/api-routes";
import { encodePasswordForTransport } from "@/lib/password-obfuscation";

export interface SuperadminRole {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
}

export interface SuperadminClient {
  id: number;
  name: string;
  tenant_id: number;
  tenant_name: string;
  status: boolean;
}

export interface SuperadminAssignedClient {
  id: number;
  client_name: string;
  status: boolean;
}

export interface SuperadminUserRow {
  user_id: number;
  profile_id: number;
  username: string;
  email: string;
  is_active: boolean;
  tenant: {
    id: number;
    name: string;
    slug: string;
  };
  legacy_role: string;
  roles: string[];
  assigned_clients: SuperadminAssignedClient[];
}

export interface SuperadminUsersAccessResponse {
  users: SuperadminUserRow[];
  roles: SuperadminRole[];
  clients: SuperadminClient[];
}

export interface SuperadminUpdateUserAccessPayload {
  roles?: string[];
  assigned_client_ids?: number[];
  is_active?: boolean;
}

export interface SuperadminCreateUserPayload {
  username: string;
  email: string;
  password: string;
  tenant_id: number;
  roles?: string[];
  assigned_client_ids?: number[];
  is_active?: boolean;
}

export interface SuperadminCreateUserResponse {
  status: string;
  user: {
    user_id: number;
    username: string;
    email: string;
    tenant_id: number;
    is_active: boolean;
    roles: string[];
    assigned_client_ids: number[];
  };
}

export const SuperadminUserAccessService = {
  getUsersAccess: async (): Promise<SuperadminUsersAccessResponse> => {
    const response = await api.get<SuperadminUsersAccessResponse>(SUPERADMIN_ROUTES.usersAccess);
    return response.data;
  },

  updateUserAccess: async (userId: number, payload: SuperadminUpdateUserAccessPayload) => {
    const response = await api.patch(SUPERADMIN_ROUTES.updateUserAccess(userId), payload);
    return response.data;
  },

  createUser: async (payload: SuperadminCreateUserPayload): Promise<SuperadminCreateUserResponse> => {
    const { password, ...rest } = payload;
    const response = await api.post<SuperadminCreateUserResponse>(SUPERADMIN_ROUTES.usersAccess, {
      ...rest,
      password_encoded: encodePasswordForTransport(password),
    });
    return response.data;
  },
};
