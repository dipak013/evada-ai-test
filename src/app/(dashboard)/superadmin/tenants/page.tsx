"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { hasRole, SUPERADMIN_ROLE } from "@/lib/rbac";
import TenantClientService from "@/services/tenant-client.service";
import { emitToast } from "@/lib/toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function TenantsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingTenantId, setEditingTenantId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("");
  const [maxUsers, setMaxUsers] = useState<number | "">("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingTenantActive, setEditingTenantActive] = useState(true);

  const [confirmState, setConfirmState] = useState<{ open: boolean; tenantId?: number; loading?: boolean; impactedClientNames?: string[] }>({ open: false });

  useEffect(() => {
    if (authLoading) return;
    if (!hasRole(user, SUPERADMIN_ROLE)) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  const load = async () => {
    try {
      setLoading(true);
      const [t, c] = await Promise.all([TenantClientService.listTenants(), TenantClientService.listClients()]);
      setTenants(t || []);
      setClients(c || []);
    } catch (err) {
      emitToast("Failed to load tenants", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const startEdit = (t: any) => {
    setEditingTenantId(t.id);
    setName(t.name || "");
    setSlug(t.slug || "");
    setDomain(t.domain || "");
    setMaxUsers(t.max_users ?? "");
    setIsCreateModalOpen(true);
    setEditingTenantActive(!!t.is_active);
  };

  const cancelEdit = () => {
    setEditingTenantId(null);
    setName(""); setSlug(""); setDomain(""); setMaxUsers("");
    setIsCreateModalOpen(false);
    setEditingTenantActive(true);
  };

  const saveTenant = async () => {
    if (!name.trim()) { emitToast("Name is required", "error"); return; }
    if (maxUsers === "" || maxUsers == null || Number(maxUsers) <= 0) { emitToast("Max users must be > 0", "error"); return; }
      try {
      setCreating(true);
      const payload: any = { name: name.trim(), slug: slug.trim() || undefined, domain: domain.trim() || undefined, max_users: Number(maxUsers), is_active: editingTenantActive };
      if (editingTenantId) {
        await TenantClientService.updateTenant(editingTenantId, payload);
        emitToast("Tenant updated", "success");
      } else {
        await TenantClientService.createTenant(payload);
        emitToast("Tenant created", "success");
      }
      cancelEdit();
      await load();
      try { window.dispatchEvent(new CustomEvent('tenants:updated')); } catch {};
    } catch (err:any) {
      emitToast(err?.response?.data?.error || "Failed to save tenant", "error");
    }
    finally {
      setCreating(false);
    }
  };

  const confirmDelete = (tenantId: number) => {
    const matches = clients.filter((c:any) => Number(c.tenant_id) === Number(tenantId) && c.status);
    const names = matches.map((m:any) => m.clientName || m.client_name || "(unnamed)");
    setConfirmState({ open: true, tenantId, loading: false, impactedClientNames: names });
  };

  const performDelete = async () => {
    if (!confirmState.tenantId) return;
    setConfirmState((s) => ({ ...s, loading: true }));
    try {
      const resp = await TenantClientService.deleteTenant(confirmState.tenantId);
      const impacted = resp?.impactedClients || resp?.impactedClientNames || [];
      if (impacted && impacted.length) {
        emitToast(`Tenant deactivated. Also deactivated ${impacted.length} client(s): ${impacted.join(", ")}`, "success");
      } else {
        emitToast("Tenant deactivated", "success");
      }
      await load();
      try { window.dispatchEvent(new CustomEvent('tenants:updated')); } catch {};
    } catch (err:any) {
      emitToast(err?.response?.data?.error || "Failed to deactivate tenant", "error");
    } finally {
      setConfirmState({ open: false });
    }
  };

  return (
    <div className="page-padding section-spacing">
      <div className="page-header">
        <div>
          <h1 className="text-page-title">Tenant Management</h1>
          <p className="text-small mt-0.5">Create, edit, and deactivate tenants from this page</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { cancelEdit(); setIsCreateModalOpen(true); }}
            className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
          >
            Add Tenant
          </button>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <label htmlFor="tenant-search" className="block text-xs font-medium text-gray-600 mb-1">Search tenants</label>
        <input id="tenant-search" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by name, slug, or domain" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Domain</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Max Users</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {tenants.filter(t=>{
                const q = search.trim().toLowerCase();
                if(!q) return true;
                return `${t.name} ${t.slug} ${t.domain}`.toLowerCase().includes(q);
              }).map((t:any)=> (
                <tr key={t.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{t.id}</td>
                  <td className="px-4 py-3 text-gray-800">{t.name}</td>
                  <td className="px-4 py-3 text-gray-700">{t.slug}</td>
                  <td className="px-4 py-3 text-gray-700">{t.domain ?? '—'}</td>
                  <td className="px-4 py-3">{t.max_users ?? '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${t.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{t.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={()=>startEdit(t)} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700">Edit</button>
                      <button onClick={()=>confirmDelete(t.id)} className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700">Deactivate</button>
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
                <h2 className="text-lg font-semibold text-gray-800">{editingTenantId ? 'Edit Tenant' : 'Add Tenant'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Create or update a tenant</p>
              </div>
              <button onClick={cancelEdit} disabled={creating} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name <span className="text-red-500">*</span></label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={slug} onChange={(e)=>setSlug(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Domain</label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={domain} onChange={(e)=>setDomain(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Users <span className="text-red-500">*</span></label>
                  <input type="number" min={1} className="w-40 px-3 py-2 border rounded-lg text-sm" value={maxUsers as any} onChange={(e)=>{const v=e.target.value; setMaxUsers(v===''? '': Number(v))}} />
                </div>
                <div className="flex items-center gap-2">
                  <input id="tenant-active" type="checkbox" checked={editingTenantActive} onChange={(e)=>setEditingTenantActive(e.target.checked)} />
                  <label htmlFor="tenant-active" className="text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              {editingTenantId ? (
                <>
                  <button onClick={cancelEdit} className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={saveTenant} disabled={creating} className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">{creating ? 'Saving...' : 'Save'}</button>
                </>
              ) : (
                <button onClick={saveTenant} disabled={creating} className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">{creating ? 'Creating...' : 'Create Tenant'}</button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={confirmState.open}
        title="Deactivate tenant"
        description={
          confirmState.impactedClientNames && confirmState.impactedClientNames.length
            ? `This tenant has ${confirmState.impactedClientNames.length} active client(s): ${confirmState.impactedClientNames.join(", ")}. Deactivating the tenant will also deactivate these clients. Continue?`
            : "Are you sure you want to deactivate this tenant?"
        }
        confirmLabel="Deactivate"
        loading={!!confirmState.loading}
        onConfirm={performDelete}
        onCancel={()=>setConfirmState({ open: false })}
      />
    </div>
  );
}
