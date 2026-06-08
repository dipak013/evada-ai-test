"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { hasRole, SUPERADMIN_ROLE } from "@/lib/rbac";
import TenantClientService from "@/services/tenant-client.service";
import { emitToast } from "@/lib/toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ClientsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientStatus, setClientStatus] = useState(true);
  const [clientTenantId, setClientTenantId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [confirmState, setConfirmState] = useState<{ open: boolean; clientId?: number; loading?: boolean }>({ open: false });

  useEffect(() => {
    if (authLoading) return;
    if (!hasRole(user, SUPERADMIN_ROLE)) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  const load = async () => {
    try {
      setLoading(true);
      const [c, t] = await Promise.all([TenantClientService.listClients(), TenantClientService.listTenants()]);
      setClients(c || []);
      setTenants(t || []);
    } catch (err) {
      emitToast("Failed to load clients/tenants", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    const handler = () => { void load(); };
    window.addEventListener('tenants:updated', handler);
    return () => { window.removeEventListener('tenants:updated', handler); };
  }, []);

  const startEdit = (c:any) => {
    setEditingClientId(c.id);
    setClientName(c.clientName || "");
    setClientStatus(!!c.status);
    setClientTenantId(c.tenant_id ?? null);
    setIsCreateModalOpen(true);
  };

  const cancelEdit = () => {
    setEditingClientId(null);
    setClientName(""); setClientStatus(true); setClientTenantId(null);
    setIsCreateModalOpen(false);
  };

  const onToggleClientActive = (next: boolean) => {
    if (!next) {
      setClientStatus(false);
      return;
    }

    if (!clientTenantId) {
      emitToast("Assign a tenant before activating a client", "error");
      return;
    }
    const tenant = tenants.find((t:any) => Number(t.id) === Number(clientTenantId));
    if (!tenant) {
      emitToast("Selected tenant not found", "error");
      return;
    }
    if (!tenant.is_active) {
      emitToast(`Cannot activate client: tenant '${tenant.name}' is inactive`, "error");
      return;
    }

    setClientStatus(true);
  };

  const saveClient = async () => {
    if (!clientName.trim()) { emitToast("Client name is required", "error"); return; }
    try {
      setCreating(true);
      const payload: any = { client_name: clientName.trim(), client_status: clientStatus, tenant_id: clientTenantId };
      if (editingClientId) {
        await TenantClientService.reassignClient(editingClientId, payload);
        emitToast("Client updated", "success");
      } else {
        await TenantClientService.createClient(payload);
        emitToast("Client created", "success");
      }
      cancelEdit();
      await load();
    } catch (err:any) {
      emitToast(err?.response?.data?.error || "Failed to save client", "error");
    }
    finally { setCreating(false); }
  };

  const confirmDelete = (clientId: number) => setConfirmState({ open: true, clientId, loading: false });

  const performDelete = async () => {
    if (!confirmState.clientId) return;
    setConfirmState((s) => ({ ...s, loading: true }));
    try {
      await TenantClientService.deleteClient(confirmState.clientId);
      emitToast("Client deactivated", "success");
      await load();
    } catch (err:any) {
      emitToast(err?.response?.data?.error || "Failed to deactivate client", "error");
    } finally {
      setConfirmState({ open: false });
    }
  };

  const tenantNameFor = (id:number|null) => tenants.find((t:any)=>t.id===id)?.name ?? 'Unassigned';

  return (
    <div className="page-padding section-spacing">
      <div className="page-header">
        <div>
          <h1 className="text-page-title">Client Management</h1>
          <p className="text-small mt-0.5">Create, edit, and deactivate clients from this page</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { cancelEdit(); setIsCreateModalOpen(true); }}
            className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
          >
            Add Client
          </button>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <label htmlFor="client-search" className="block text-xs font-medium text-gray-600 mb-1">Search clients</label>
        <input id="client-search" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by name or tenant" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Tenant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.filter(c=>{
                const q = search.trim().toLowerCase();
                if(!q) return true;
                return `${c.clientName} ${tenantNameFor(c.tenant_id)}`.toLowerCase().includes(q);
              }).map((c:any)=> (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{c.id}</td>
                  <td className="px-4 py-3 text-gray-800">{c.clientName}</td>
                  <td className="px-4 py-3 text-gray-700">{tenantNameFor(c.tenant_id)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${c.status ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{c.status ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={()=>startEdit(c)} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700">Edit</button>
                      <button onClick={()=>confirmDelete(c.id)} className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700">Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{editingClientId ? 'Edit Client' : 'Add Client'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Create or update a client</p>
              </div>
              <button onClick={cancelEdit} disabled={creating} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Client name <span className="text-red-500">*</span></label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={clientName} onChange={(e)=>setClientName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tenant</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm" value={clientTenantId ?? ""} onChange={(e)=>setClientTenantId(e.target.value?Number(e.target.value):null)}>
                    <option value="">Unassigned</option>
                    {tenants.map((t:any)=>(<option key={t.id} value={t.id}>{t.name}{!t.is_active ? ' (Inactive)' : ''}</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input id="client-active" type="checkbox" checked={clientStatus} onChange={(e)=>onToggleClientActive(e.target.checked)} />
                  <label htmlFor="client-active" className="text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              {editingClientId ? (
                <>
                  <button onClick={cancelEdit} className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={saveClient} disabled={creating} className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">{creating ? 'Saving...' : 'Save'}</button>
                </>
              ) : (
                <button onClick={saveClient} disabled={creating} className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">{creating ? 'Creating...' : 'Create Client'}</button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal isOpen={confirmState.open} title="Deactivate client" description="Are you sure you want to deactivate this client? This will also deactivate related agents." confirmLabel="Deactivate" loading={!!confirmState.loading} onConfirm={performDelete} onCancel={()=>setConfirmState({ open: false })} />
    </div>
  );
}
