"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { hasRole, SUPERADMIN_ROLE } from "@/lib/rbac";
import {
  SuperadminClient,
  SuperadminRole,
  SuperadminUserRow,
  SuperadminUserAccessService,
} from "@/services/superadmin-user-access.service";

const ROWS_PER_PAGE = 25;

type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

type TenantOption = {
  id: number;
  name: string;
};

function getPaginationButtonClass(currentPage: number, page: PaginationItem): string {
  if (typeof page === "number" && currentPage === page) {
    return "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm";
  }
  if (typeof page !== "number") {
    return "text-slate-400 cursor-default";
  }
  return "text-slate-600 hover:bg-slate-100";
}

function buildPagination(currentPage: number, totalPages: number): PaginationItem[] {
  const pages = new Set<number>();

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.add(page);
    }
    return Array.from(pages);
  }

  pages.add(1);
  pages.add(totalPages);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  const items: PaginationItem[] = [];
  let previousPage: number | null = null;

  for (const page of sortedPages) {
    if (previousPage !== null && page - previousPage > 1) {
      items.push(previousPage < currentPage ? "ellipsis-left" : "ellipsis-right");
    }
    items.push(page);
    previousPage = page;
  }

  return items;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const maybeResponse = (err as { response?: { data?: { error?: string } } }).response;
    if (maybeResponse?.data?.error) {
      return maybeResponse.data.error;
    }
    const maybeMessage = (err as { message?: string }).message;
    if (maybeMessage) {
      return maybeMessage;
    }
  }
  return fallback;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isStrongPassword(value: string): boolean {
  if (value.length < 12) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  if (!/[^A-Za-z0-9]/.test(value)) return false;
  if (/\s/.test(value)) return false;
  return true;
}

function buildAssignedClients(
  tenantClients: SuperadminClient[],
  selectedIds: number[]
): Array<{ id: number; client_name: string; status: boolean }> {
  const selectedSet = new Set(selectedIds);
  const assigned: Array<{ id: number; client_name: string; status: boolean }> = [];

  for (const client of tenantClients) {
    if (!selectedSet.has(client.id)) continue;
    assigned.push({ id: client.id, client_name: client.name, status: client.status });
  }

  return assigned;
}

export default function SuperadminUsersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [roles, setRoles] = useState<SuperadminRole[]>([]);
  const [clients, setClients] = useState<SuperadminClient[]>([]);
  const [users, setUsers] = useState<SuperadminUserRow[]>([]);

  const [selectedUser, setSelectedUser] = useState<SuperadminUserRow | null>(null);
  const [draftRoles, setDraftRoles] = useState<string[]>([]);
  const [draftAssignedClientIds, setDraftAssignedClientIds] = useState<number[]>([]);
  const [draftIsActive, setDraftIsActive] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createUsername, setCreateUsername] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createTenantId, setCreateTenantId] = useState<number | null>(null);
  const [createRoleSlugs, setCreateRoleSlugs] = useState<string[]>([]);
  const [createAssignedClientIds, setCreateAssignedClientIds] = useState<number[]>([]);
  const [createIsActive, setCreateIsActive] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (authLoading) return;
    if (!hasRole(user, SUPERADMIN_ROLE)) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        const data = await SuperadminUserAccessService.getUsersAccess();
        if (!mounted) return;
        setUsers(data.users || []);
        setRoles(data.roles || []);
        setClients(data.clients || []);
        setError(null);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(err, "Failed to load superadmin data"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void run();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((row) => {
      const text = [row.username, row.email, row.tenant.name, ...(row.roles || [])]
        .join(" ")
        .toLowerCase();
      return text.includes(query);
    });
  }, [users, search]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / ROWS_PER_PAGE));

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [currentPage, filteredUsers]);

  const pageStart = totalUsers === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const pageEnd = totalUsers === 0 ? 0 : Math.min(currentPage * ROWS_PER_PAGE, totalUsers);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openEditor = (row: SuperadminUserRow) => {
    setSelectedUser(row);
    setDraftRoles([...(row.roles || [])]);
    setDraftAssignedClientIds((row.assigned_clients || []).map((item) => item.id));
    setDraftIsActive(!!row.is_active);
    setEditTenantId(row.tenant.id);
  };

  const closeEditor = () => {
    setSelectedUser(null);
    setDraftRoles([]);
    setDraftAssignedClientIds([]);
    setDraftIsActive(true);
    setEditTenantId(null);
  };

  const toggleRole = (roleSlug: string) => {
    setDraftRoles((prev) =>
      prev.includes(roleSlug)
        ? prev.filter((slug) => slug !== roleSlug)
        : [...prev, roleSlug]
    );
  };

  const toggleAssignedClient = (clientId: number) => {
    const targetClient = selectedUserTenantClients.find((client) => client.id === clientId);
    if (targetClient && !targetClient.status) {
      return;
    }
    setDraftAssignedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const [editTenantId, setEditTenantId] = useState<number | null>(null);

  const selectedUserTenantClients = useMemo(() => {
    const tenantId = editTenantId ?? selectedUser?.tenant.id;
    if (!tenantId) return [];
    return clients.filter((client) => client.tenant_id === tenantId);
  }, [clients, selectedUser, editTenantId]);

  // If admin toggles on the `client` role and no client is assigned yet,
  // auto-select the first available client (prefer active) so dropdown is usable.
  useEffect(() => {
    if (!selectedUser) return;
    if (!draftRoles.includes("client")) return;
    if (draftAssignedClientIds.length === 1) return;
    if (!selectedUserTenantClients.length) return;
    const active = selectedUserTenantClients.find((c) => c.status) || selectedUserTenantClients[0];
    if (active) {
      setDraftAssignedClientIds([active.id]);
    }
  }, [draftRoles, selectedUser, selectedUserTenantClients, draftAssignedClientIds]);

  const tenantOptions = useMemo(() => {
    const map = new Map<number, TenantOption>();
    for (const row of users) {
      map.set(row.tenant.id, { id: row.tenant.id, name: row.tenant.name });
    }
    for (const client of clients) {
      if (!map.has(client.tenant_id)) {
        map.set(client.tenant_id, { id: client.tenant_id, name: client.tenant_name });
      }
    }
    return Array.from(map.values()).sort((left, right) => left.name.localeCompare(right.name));
  }, [users, clients]);

  const createTenantClients = useMemo(() => {
    if (!createTenantId) return [];
    return clients.filter((client) => client.tenant_id === createTenantId);
  }, [clients, createTenantId]);

  // For the Create User modal: when admin selects the `client` role, auto-pick one client
  useEffect(() => {
    if (!createRoleSlugs.includes("client")) return;
    if (createAssignedClientIds.length === 1) return;
    if (!createTenantClients.length) return;
    const active = createTenantClients.find((c) => c.status) || createTenantClients[0];
    if (active) setCreateAssignedClientIds([active.id]);
  }, [createRoleSlugs, createTenantClients, createAssignedClientIds]);

  const resetCreateForm = () => {
    setCreateUsername("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateTenantId(tenantOptions[0]?.id ?? null);
    setCreateRoleSlugs([]);
    setCreateAssignedClientIds([]);
    setCreateIsActive(true);
  };

  const [isMappingOpen, setIsMappingOpen] = useState(false);

  const openCreateModal = () => {
    if (selectedUser) {
      closeEditor();
    }
    resetCreateForm();
    setCreateError(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreatingUser(false);
    setCreateError(null);
    resetCreateForm();
  };

  const toggleCreateRole = (roleSlug: string) => {
    setCreateRoleSlugs((prev) =>
      prev.includes(roleSlug)
        ? prev.filter((slug) => slug !== roleSlug)
        : [...prev, roleSlug]
    );
  };

  const toggleCreateAssignedClient = (clientId: number) => {
    const targetClient = createTenantClients.find((client) => client.id === clientId);
    if (targetClient && !targetClient.status) {
      return;
    }
    setCreateAssignedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const createUser = async () => {
    setCreateError(null);

    const username = createUsername.trim();
    const email = createEmail.trim();
    const password = createPassword;

    if (!username) {
      setCreateError("Username is required");
      return;
    }

    if (!email) {
      setCreateError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setCreateError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setCreateError("Password is required");
      return;
    }

    if (!isStrongPassword(password)) {
      setCreateError("Password must be at least 12 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (!createTenantId) {
      setCreateError("Please select a tenant");
      return;
    }

    if (createRoleSlugs.includes("client") && createAssignedClientIds.length !== 1) {
      setCreateError("Users with the 'client' role must be assigned exactly one client");
      return;
    }

    if (createRoleSlugs.includes("channel_partner") && createAssignedClientIds.length < 1) {
      setCreateError("Users with the 'channel_partner' role must be associated with exactly one tenant and at least one client");
      return;
    }

    try {
      setCreatingUser(true);
      await SuperadminUserAccessService.createUser({
        username,
        email,
        password,
        tenant_id: createTenantId,
        roles: createRoleSlugs,
        assigned_client_ids: createAssignedClientIds,
        is_active: createIsActive,
      });

      const data = await SuperadminUserAccessService.getUsersAccess();
      setUsers(data.users || []);
      setRoles(data.roles || []);
      setClients(data.clients || []);

      closeCreateModal();
      setError(null);
      setCurrentPage(1);
    } catch (err: unknown) {
      setCreateError(getErrorMessage(err, "Failed to create user"));
    } finally {
      setCreatingUser(false);
    }
  };

  const saveUserAccess = async () => {
    if (!selectedUser) return;

    if (draftRoles.includes("client") && draftAssignedClientIds.length !== 1) {
      setError("Users with the 'client' role must be assigned exactly one client");
      return;
    }

    if (draftRoles.includes("channel_partner") && draftAssignedClientIds.length < 1) {
      setError("Users with the 'channel_partner' role must be associated with exactly one tenant and at least one client");
      return;
    }

    try {
      setSavingUserId(selectedUser.user_id);
      await SuperadminUserAccessService.updateUserAccess(selectedUser.user_id, {
        roles: draftRoles,
        assigned_client_ids: draftAssignedClientIds,
        is_active: draftIsActive,
        tenant_id: editTenantId,
      } as any);

      setUsers((prev) =>
        prev.map((row) => {
          if (row.user_id !== selectedUser.user_id) return row;
          const assignedClients = buildAssignedClients(
            selectedUserTenantClients,
            draftAssignedClientIds
          );
          const tenantObj = tenantOptions.find((t) => t.id === (editTenantId ?? selectedUser.tenant.id));
          return {
            ...row,
            roles: draftRoles,
            is_active: draftIsActive,
            assigned_clients: assignedClients,
            tenant: tenantObj ? { id: tenantObj.id, name: tenantObj.name, slug: row.tenant.slug } : row.tenant,
          };
        })
      );

      closeEditor();
      setError(null);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update user access"));
    } finally {
      setSavingUserId(null);
    }
  };

  const softDeleteUser = async (row: SuperadminUserRow) => {
    const confirmed = window.confirm(
      `Deactivate user ${row.email}? This will only deactivate the user and will not hard delete.`
    );
    if (!confirmed) return;

    try {
      setDeletingUserId(row.user_id);
      await SuperadminUserAccessService.updateUserAccess(row.user_id, {
        is_active: false,
      });

      setUsers((prev) =>
        prev.map((item) =>
          item.user_id === row.user_id
            ? {
                ...item,
                is_active: false,
              }
            : item
        )
      );

      if (selectedUser?.user_id === row.user_id) {
        closeEditor();
      }

      setError(null);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to deactivate user"));
    } finally {
      setDeletingUserId(null);
    }
  };

  if (authLoading || loading) {
    return <div className="page-padding section-spacing">Loading user access data...</div>;
  }

  if (!hasRole(user, SUPERADMIN_ROLE)) {
    return null;
  }

  return (
    <div className="page-padding section-spacing">
      <div className="page-header">
        <div>
          <h1 className="text-page-title">Superadmin User Access</h1>
          <p className="text-small mt-0.5">Manage user roles and assigned-client mapping from UI</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
          >
            Add User
          </button>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <label htmlFor="user-access-search" className="block text-xs font-medium text-gray-600 mb-1">
          Search users
        </label>
        <input
          id="user-access-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, email, tenant, or role"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Tenant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Roles</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Assigned Clients</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length ? paginatedUsers.map((row) => (
                <tr key={row.user_id} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{row.username}</div>
                    <div className="text-xs text-gray-500">{row.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.tenant.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.roles.length ? row.roles.map((role) => (
                        <span key={`${row.user_id}-${role}`} className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs">
                          {role}
                        </span>
                      )) : <span className="text-xs text-gray-400">No roles</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(row.assigned_clients || []).length ? row.assigned_clients.map((client) => (
                        <span key={`${row.user_id}-client-${client.id}`} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                          {client.client_name}
                        </span>
                      )) : <span className="text-xs text-gray-400">None</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${row.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {row.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEditor(row)}
                        disabled={deletingUserId === row.user_id}
                        className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Manage Access
                      </button>
                      <button
                        onClick={() => softDeleteUser(row)}
                        disabled={!row.is_active || deletingUserId === row.user_id || savingUserId === row.user_id}
                        className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingUserId === row.user_id ? "Deactivating..." : "Deactivate User"}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="mx-auto max-w-md">
                      <div className="text-sm font-semibold text-slate-700">No users found</div>
                      <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search to find a different user, tenant, or role.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-3">
              <span className="font-medium text-slate-700">Showing {pageStart}-{pageEnd} of {totalUsers} users</span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span>25 records per page</span>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="text-sm font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                  {buildPagination(currentPage, totalPages).map((page, index) => (
                    <button
                      key={typeof page === "number" ? `page-${page}` : `${page}-${index}`}
                      onClick={() => typeof page === "number" && setCurrentPage(page)}
                      disabled={typeof page !== "number"}
                      className={`min-w-9 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${getPaginationButtonClass(currentPage, page)}`}
                    >
                      {typeof page === "number" ? page : "..."}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Next page"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Manage Access</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selectedUser.username} • {selectedUser.email}</p>
              </div>
              <button onClick={closeEditor} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Role Assignment</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {roles.map((role) => {
                    const checked = draftRoles.includes(role.slug);
                    return (
                      <label key={role.slug} className="border border-gray-200 rounded-lg px-3 py-2 flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRole(role.slug)}
                          className="mt-1"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-800">{role.slug}</div>
                          {role.description ? <div className="text-xs text-gray-500">{role.description}</div> : null}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Tenant</p>
                <select
                  value={editTenantId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    const next = v ? Number(v) : null;
                    setEditTenantId(next);
                    // clear assigned clients when tenant changes; auto-select handled by effect
                    setDraftAssignedClientIds([]);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 mb-3"
                >
                  <option value="">Select tenant</option>
                  {tenantOptions.map((t) => (
                    <option key={`tenant-opt-${t.id}`} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Assigned Clients ({selectedUser.tenant.name})
                </p>
                {/* If client role selected, require single client via dropdown. */}
                {draftRoles.includes("client") ? (
                  <div>
                    <select
                      value={draftAssignedClientIds[0] ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDraftAssignedClientIds(v ? [Number(v)] : []);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-800"
                      disabled={!selectedUserTenantClients.length}
                    >
                      <option value="">{selectedUserTenantClients.length ? "Select client" : "No clients available for this tenant"}</option>
                      {selectedUserTenantClients.map((client) => (
                        <option key={`edit-client-opt-${client.id}`} value={client.id}>
                          {client.name}{!client.status ? " (Inactive)" : ""}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-red-600 mt-1">Users with the <strong>client</strong> role must be mapped to exactly one client.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedUserTenantClients.length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedUserTenantClients.map((client) => {
                          const checked = draftAssignedClientIds.includes(client.id);
                          return (
                            <label key={`edit-client-opt-${client.id}`} className="border border-gray-200 rounded-lg px-3 py-2 flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={!client.status}
                                onChange={() => toggleAssignedClient(client.id)}
                                className="mt-1"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {client.name}
                                  {!client.status ? " (Inactive)" : ""}
                                </div>
                                {!client.status ? <div className="text-xs text-gray-500">Inactive clients cannot be assigned</div> : null}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No clients found for this tenant.</p>
                    )}
                    {draftRoles.includes("channel_partner") ? (
                      <p className="text-xs text-amber-700 mt-1">Users with the <strong>channel_partner</strong> role must be associated with one tenant and mapped to at least one client.</p>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="user-active-toggle"
                  type="checkbox"
                  checked={draftIsActive}
                  onChange={(e) => setDraftIsActive(e.target.checked)}
                />
                <label htmlFor="user-active-toggle" className="text-sm text-gray-700">User is active</label>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => softDeleteUser(selectedUser)}
                disabled={!selectedUser.is_active || deletingUserId === selectedUser.user_id || savingUserId === selectedUser.user_id}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deletingUserId === selectedUser.user_id ? "Deactivating..." : "Deactivate User"}
              </button>
              <button
                onClick={closeEditor}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveUserAccess}
                disabled={
                  savingUserId === selectedUser.user_id ||
                  (draftRoles.includes("client") && draftAssignedClientIds.length !== 1) ||
                  (draftRoles.includes("channel_partner") && draftAssignedClientIds.length < 1)
                }
                className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {savingUserId === selectedUser.user_id ? "Saving..." : "Save Access"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Add User</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Create a new tenant user and set access in one step.
                </p>
              </div>
              <button
                onClick={closeCreateModal}
                disabled={creatingUser}
                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
              {createError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {createError}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="create-username" className="block text-xs font-medium text-gray-600 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="create-username"
                    required
                    value={createUsername}
                    onChange={(e) => setCreateUsername(e.target.value)}
                    placeholder="jane.doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="create-email" className="block text-xs font-medium text-gray-600 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="create-email"
                    type="email"
                    required
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="jane@tenant.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="create-password" className="block text-xs font-medium text-gray-600 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="create-password"
                    type="password"
                    required
                    minLength={12}
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Enter temporary password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <p className="mt-1 text-[11px] text-gray-500">
                    Use 12+ characters with uppercase, lowercase, number, and special character.
                  </p>
                </div>

                <div>
                  <label htmlFor="create-tenant" className="block text-xs font-medium text-gray-600 mb-1">
                    Tenant <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="create-tenant"
                    required
                    value={createTenantId ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const nextTenantId = value ? Number(value) : null;
                      setCreateTenantId(nextTenantId);
                      setCreateAssignedClientIds([]);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select tenant</option>
                    {tenantOptions.map((tenant) => (
                      <option key={`create-tenant-${tenant.id}`} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Role Assignment</p>
                <p className="mb-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-2.5 py-1.5">
                  If no role is selected, the user will be assigned the <span className="font-semibold">client</span> role by default.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {roles.map((role) => {
                    const checked = createRoleSlugs.includes(role.slug);
                    return (
                      <label key={`create-role-${role.slug}`} className="border border-gray-200 rounded-lg px-3 py-2 flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCreateRole(role.slug)}
                          className="mt-1"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-800">{role.slug}</div>
                          {role.description ? <div className="text-xs text-gray-500">{role.description}</div> : null}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Assigned Clients</p>
                {createRoleSlugs.includes("client") ? (
                  <div>
                    <select
                      value={createAssignedClientIds[0] ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCreateAssignedClientIds(v ? [Number(v)] : []);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-800"
                      disabled={!createTenantClients.length}
                    >
                      <option value="">{createTenantClients.length ? "Select client" : "Select a tenant to see available clients"}</option>
                      {createTenantClients.map((client) => (
                        <option key={`create-client-opt-${client.id}`} value={client.id}>
                          {client.name}{!client.status ? " (Inactive)" : ""}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-red-600 mt-1">Users with the <strong>client</strong> role must be mapped to exactly one client.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {createTenantClients.length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {createTenantClients.map((client) => {
                          const checked = createAssignedClientIds.includes(client.id);
                          return (
                            <label key={`create-client-opt-${client.id}`} className="border border-gray-200 rounded-lg px-3 py-2 flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={!client.status}
                                onChange={() => toggleCreateAssignedClient(client.id)}
                                className="mt-1"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {client.name}
                                  {!client.status ? " (Inactive)" : ""}
                                </div>
                                {!client.status ? <div className="text-xs text-gray-500">Inactive clients cannot be assigned</div> : null}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Select a tenant to see available clients.</p>
                    )}
                    {createRoleSlugs.includes("channel_partner") ? (
                      <p className="text-xs text-amber-700 mt-1">Users with the <strong>channel_partner</strong> role must be associated with one tenant and mapped to at least one client.</p>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="create-user-active-toggle"
                  type="checkbox"
                  checked={createIsActive}
                  onChange={(e) => setCreateIsActive(e.target.checked)}
                />
                <label htmlFor="create-user-active-toggle" className="text-sm text-gray-700">User is active</label>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={closeCreateModal}
                disabled={creatingUser}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={createUser}
                disabled={
                  creatingUser ||
                  (createRoleSlugs.includes("client") && createAssignedClientIds.length !== 1) ||
                  (createRoleSlugs.includes("channel_partner") && createAssignedClientIds.length < 1)
                }
                className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                {creatingUser ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Tenant-client mapping moved to dedicated Tenants/Clients pages */}
    </div>
  );
}
