"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AgentRow,
  ClientAgentService,
  ClientRow,
} from "@/services/client-agent.service";

function formatDateTime(value: string | null) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleString();
}

function getPaginationButtonClass(currentPage: number, page: number): string {
  if (currentPage === page) {
    return "bg-gradient-to-r from-indigo-600 to-violet-600 text-white";
  }
  if (page === -1) {
    return "text-slate-400 cursor-default";
  }
  return "text-slate-600 hover:bg-slate-100";
}

function buildPagination(totalPages: number): number[] {
  const pages: number[] = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pages.push(i);
  }
  if (totalPages > 5) {
    return [...pages, -1, totalPages];
  }
  return pages;
}

const ROWS_PER_PAGE = 10;

type DeleteDialogState = {
  kind: "client" | "agent";
  id: string;
  name: string;
  impactedAgents: string[];
};

export default function ClientAgentManagementPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);
  const [isSubmittingAgent, setIsSubmittingAgent] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientStatus, setClientStatus] = useState(true);
  const [agentName, setAgentName] = useState("");
  const [agentStatus, setAgentStatus] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editClientStatus, setEditClientStatus] = useState(true);
  const [editAgentName, setEditAgentName] = useState("");
  const [editAgentStatus, setEditAgentStatus] = useState(true);
  const [editAgentClientId, setEditAgentClientId] = useState("");

  const [isUpdatingClient, setIsUpdatingClient] = useState(false);
  const [isUpdatingAgent, setIsUpdatingAgent] = useState(false);
  const [actionInProgressKey, setActionInProgressKey] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [agentSearchQuery, setAgentSearchQuery] = useState("");
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [agentCurrentPage, setAgentCurrentPage] = useState(1);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clientOptions = useMemo(() => clients, [clients]);
  const isClientFormValid = clientName.trim().length > 0;
  const isAgentFormValid = selectedClientId.trim().length > 0 && agentName.trim().length > 0;
  const isEditClientFormValid = editClientName.trim().length > 0;
  const isEditAgentFormValid = editAgentClientId.trim().length > 0 && editAgentName.trim().length > 0;

  const filteredClients = useMemo(() => {
    const query = clientSearchQuery.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((item) => {
      const haystack = `${item.clientName} ${item.status ? "active" : "inactive"}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [clients, clientSearchQuery]);

  const filteredAgents = useMemo(() => {
    const query = agentSearchQuery.trim().toLowerCase();
    if (!query) return agents;
    return agents.filter((item) => {
      const haystack = `${item.agentName} ${item.clientName || ""} ${item.status ? "active" : "inactive"}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [agents, agentSearchQuery]);

  const clientTotalPages = Math.max(1, Math.ceil(filteredClients.length / ROWS_PER_PAGE));
  const agentTotalPages = Math.max(1, Math.ceil(filteredAgents.length / ROWS_PER_PAGE));

  const paginatedClients = useMemo(() => {
    const startIndex = (clientCurrentPage - 1) * ROWS_PER_PAGE;
    return filteredClients.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [clientCurrentPage, filteredClients]);

  const paginatedAgents = useMemo(() => {
    const startIndex = (agentCurrentPage - 1) * ROWS_PER_PAGE;
    return filteredAgents.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [agentCurrentPage, filteredAgents]);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [clientsRes, agentsRes] = await Promise.all([
        ClientAgentService.getClients(),
        ClientAgentService.getAgents(),
      ]);
      setClients(clientsRes.data);
      setAgents(agentsRes.data);

      if (!selectedClientId && clientsRes.data.length > 0) {
        setSelectedClientId(clientsRes.data[0].id);
      }
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to load clients and agents.";
      setErrorMessage(apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!clientOptions.length) {
      setSelectedClientId("");
      return;
    }
    if (!selectedClientId || !clientOptions.some((item) => item.id === selectedClientId)) {
      setSelectedClientId(clientOptions[0].id);
    }
  }, [clientOptions, selectedClientId]);

  useEffect(() => {
    setClientCurrentPage(1);
  }, [clientSearchQuery]);

  useEffect(() => {
    setAgentCurrentPage(1);
  }, [agentSearchQuery]);

  useEffect(() => {
    if (clientCurrentPage > clientTotalPages) {
      setClientCurrentPage(clientTotalPages);
    }
  }, [clientCurrentPage, clientTotalPages]);

  useEffect(() => {
    if (agentCurrentPage > agentTotalPages) {
      setAgentCurrentPage(agentTotalPages);
    }
  }, [agentCurrentPage, agentTotalPages]);

  const clearMessagesSoon = () => {
    setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }, 5000);
  };

  const handleCreateClient = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = clientName.trim();
    if (!trimmed) {
      setErrorMessage("Client name is required.");
      return;
    }

    setIsSubmittingClient(true);
    try {
      const response = await ClientAgentService.createClient({
        client_name: trimmed,
        client_status: clientStatus,
      });
      setSuccessMessage(response.data.message || "Client added successfully.");
      setClientName("");
      setClientStatus(true);
      setShowAddClient(false);
      await loadData();
      clearMessagesSoon();
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to add client.";
      setErrorMessage(apiMessage);
      clearMessagesSoon();
    } finally {
      setIsSubmittingClient(false);
    }
  };

  const startEditClient = (row: ClientRow) => {
    setEditingClientId(row.id);
    setEditClientName(row.clientName);
    setEditClientStatus(row.status);
    setShowAddClient(false);
  };

  const cancelEditClient = () => {
    setEditingClientId(null);
    setEditClientName("");
    setEditClientStatus(true);
  };

  const handleUpdateClient = async () => {
    if (!editingClientId) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = editClientName.trim();
    if (!trimmed) {
      setErrorMessage("Client name is required.");
      return;
    }

    setIsUpdatingClient(true);
    try {
      const response = await ClientAgentService.updateClient(editingClientId, {
        client_name: trimmed,
        client_status: editClientStatus,
      });
      setSuccessMessage(response.data.message || "Client updated successfully.");
      cancelEditClient();
      await loadData();
      clearMessagesSoon();
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update client.";
      setErrorMessage(apiMessage);
      clearMessagesSoon();
    } finally {
      setIsUpdatingClient(false);
    }
  };

  const handleDeleteClient = async (row: ClientRow) => {
    const impactedAgents = agents
      .filter((agent) => agent.clientId === row.id && agent.status)
      .map((agent) => agent.agentName);

    setDeleteDialog({
      kind: "client",
      id: row.id,
      name: row.clientName,
      impactedAgents,
    });
  };

  const handleDeleteAgent = async (row: AgentRow) => {
    setDeleteDialog({
      kind: "agent",
      id: row.id,
      name: row.agentName,
      impactedAgents: [],
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setActionInProgressKey(`${deleteDialog.kind}-delete-${deleteDialog.id}`);
    setIsDeleting(true);
    try {
      if (deleteDialog.kind === "client") {
        const response = await ClientAgentService.softDeleteClient(deleteDialog.id);
        setSuccessMessage(response.data.message || "Client marked inactive successfully.");
        if (editingClientId === deleteDialog.id) {
          cancelEditClient();
        }
      } else {
        const response = await ClientAgentService.softDeleteAgent(deleteDialog.id);
        setSuccessMessage(response.data.message || "Agent marked inactive successfully.");
        if (editingAgentId === deleteDialog.id) {
          cancelEditAgent();
        }
      }
      await loadData();
      setDeleteDialog(null);
      clearMessagesSoon();
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        `Failed to delete ${deleteDialog.kind}.`;
      setErrorMessage(apiMessage);
      clearMessagesSoon();
    } finally {
      setActionInProgressKey(null);
      setIsDeleting(false);
    }
  };

  const handleCreateAgent = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = agentName.trim();
    if (!selectedClientId) {
      setErrorMessage("Please select a client for this agent.");
      return;
    }
    if (!trimmed) {
      setErrorMessage("Agent name is required.");
      return;
    }

    setIsSubmittingAgent(true);
    try {
      const response = await ClientAgentService.createAgent({
        client_id: selectedClientId,
        agent_name: trimmed,
        agent_status: agentStatus,
      });
      setSuccessMessage(response.data.message || "Agent added successfully.");
      setAgentName("");
      setAgentStatus(true);
      setShowAddAgent(false);
      await loadData();
      clearMessagesSoon();
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to add agent.";
      setErrorMessage(apiMessage);
      clearMessagesSoon();
    } finally {
      setIsSubmittingAgent(false);
    }
  };

  const startEditAgent = (row: AgentRow) => {
    setEditingAgentId(row.id);
    setEditAgentName(row.agentName);
    setEditAgentStatus(row.status);
    setEditAgentClientId(row.clientId);
    setShowAddAgent(false);
  };

  const cancelEditAgent = () => {
    setEditingAgentId(null);
    setEditAgentName("");
    setEditAgentStatus(true);
    setEditAgentClientId("");
  };

  const handleUpdateAgent = async () => {
    if (!editingAgentId) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = editAgentName.trim();
    if (!editAgentClientId) {
      setErrorMessage("Please select a client for this agent.");
      return;
    }
    if (!trimmed) {
      setErrorMessage("Agent name is required.");
      return;
    }

    setIsUpdatingAgent(true);
    try {
      const response = await ClientAgentService.updateAgent(editingAgentId, {
        client_id: editAgentClientId,
        agent_name: trimmed,
        agent_status: editAgentStatus,
      });
      setSuccessMessage(response.data.message || "Agent updated successfully.");
      cancelEditAgent();
      await loadData();
      clearMessagesSoon();
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update agent.";
      setErrorMessage(apiMessage);
      clearMessagesSoon();
    } finally {
      setIsUpdatingAgent(false);
    }
  };

  return (
    <div className="page-padding min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80 pb-6">
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4">
              <h2 className="text-base font-semibold text-white">Confirm Deactivation</h2>
              <p className="mt-1 text-sm text-indigo-100">
                This action will mark records inactive. No data will be permanently deleted.
              </p>
            </div>
            <div className="space-y-3 px-5 py-4">
              <p className="text-sm text-slate-700">
                {deleteDialog.kind === "client"
                  ? `Do you really want to delete client "${deleteDialog.name}"?`
                  : `Do you really want to delete agent "${deleteDialog.name}"?`}
              </p>

              {deleteDialog.kind === "client" && deleteDialog.impactedAgents.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-amber-800">
                    Agents That Will Be Marked Inactive
                  </p>
                  <div className="mt-2 max-h-36 overflow-auto pr-1">
                    <ul className="space-y-1 text-sm text-amber-900">
                      {deleteDialog.impactedAgents.map((agentName) => (
                        <li key={agentName} className="rounded-md bg-white/70 px-2 py-1">
                          {agentName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {deleteDialog.kind === "client" && deleteDialog.impactedAgents.length === 0 && (
                <p className="text-sm text-slate-600">No active agents are linked to this client.</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={isDeleting}
                className="rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:from-rose-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Processing..." : "Confirm Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Client & Agent Management</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage client and agent records in one place. Each agent must be linked to a client.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/saas-admin"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Back to SaaS Admin
            </Link>
            <button
              type="button"
              onClick={() => setShowAddClient((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900"
            >
              Add Client
            </button>
            <button
              type="button"
              onClick={() => setShowAddAgent((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:from-indigo-600 hover:to-violet-700"
            >
              Add Agent
            </button>
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div className="mt-4 space-y-2">
            {errorMessage && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}
          </div>
        )}

        {showAddClient && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Add Client</h2>
              <button
                type="button"
                onClick={() => setShowAddClient(false)}
                aria-label="Close add client panel"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client name"
                required
                maxLength={255}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <label className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                <span>Client Active</span>
                <input
                  type="checkbox"
                  checked={clientStatus}
                  onChange={(e) => setClientStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <button
                type="button"
                onClick={handleCreateClient}
                disabled={isSubmittingClient || !isClientFormValid}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingClient ? "Adding..." : "Save Client"}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">All fields are required.</p>
          </div>
        )}

        {showAddAgent && (
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Add Agent</h2>
              <button
                type="button"
                onClick={() => setShowAddAgent(false)}
                aria-label="Close add agent panel"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-indigo-300 bg-white text-indigo-500 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                required
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {clientOptions.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Agent name"
                required
                maxLength={255}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <label className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                <span>Agent Active</span>
                <input
                  type="checkbox"
                  checked={agentStatus}
                  onChange={(e) => setAgentStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <button
                type="button"
                onClick={handleCreateAgent}
                disabled={isSubmittingAgent || !clientOptions.length || !isAgentFormValid}
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:from-indigo-600 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingAgent ? "Adding..." : "Save Agent"}
              </button>
            </div>
            {!clientOptions.length && (
              <p className="mt-2 text-xs text-amber-700">Create a client first to add an agent.</p>
            )}
            {clientOptions.length > 0 && <p className="mt-2 text-xs text-slate-500">All fields are required.</p>}
          </div>
        )}

        {editingClientId && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Edit Client</h2>
              <button
                type="button"
                onClick={cancelEditClient}
                aria-label="Close edit client panel"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                value={editClientName}
                onChange={(e) => setEditClientName(e.target.value)}
                placeholder="Client name"
                required
                maxLength={255}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <label className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                <span>Client Active</span>
                <input
                  type="checkbox"
                  checked={editClientStatus}
                  onChange={(e) => setEditClientStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <button
                type="button"
                onClick={handleUpdateClient}
                disabled={isUpdatingClient || !isEditClientFormValid}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingClient ? "Saving..." : "Update Client"}
              </button>
            </div>
          </div>
        )}

        {editingAgentId && (
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Edit Agent</h2>
              <button
                type="button"
                onClick={cancelEditAgent}
                aria-label="Close edit agent panel"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-indigo-300 bg-white text-indigo-500 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <select
                value={editAgentClientId}
                onChange={(e) => setEditAgentClientId(e.target.value)}
                required
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {clientOptions.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={editAgentName}
                onChange={(e) => setEditAgentName(e.target.value)}
                placeholder="Agent name"
                required
                maxLength={255}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <label className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                <span>Agent Active</span>
                <input
                  type="checkbox"
                  checked={editAgentStatus}
                  onChange={(e) => setEditAgentStatus(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <button
                type="button"
                onClick={handleUpdateAgent}
                disabled={isUpdatingAgent || !isEditAgentFormValid}
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:from-indigo-600 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingAgent ? "Saving..." : "Update Agent"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">Clients</h3>
              <div className="relative w-full max-w-[220px]">
                <input
                  type="text"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 pr-9 text-xs text-slate-700 placeholder:text-slate-500 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>
            <div className="thin-scrollbar max-h-[520px] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.07em] text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Client</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Agents</th>
                    <th className="px-3 py-2">Updated</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading && filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-5 text-center text-slate-500">
                        No clients found.
                      </td>
                    </tr>
                  )}
                  {paginatedClients.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium text-slate-800">{row.clientName}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            row.status ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {row.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-700">{row.agentCount}</td>
                      <td className="px-3 py-2 text-slate-600">{formatDateTime(row.updatedDate)}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditClient(row)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-100"
                            aria-label="Edit client"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.232-6.232a2.5 2.5 0 113.536 3.536L12.536 16.5H9v-3.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteClient(row)}
                            disabled={!row.status || actionInProgressKey === `client-delete-${row.id}`}
                            title={row.status ? "Delete client" : "Already inactive"}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-300 bg-white text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Delete client"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <span className="text-xs text-slate-600">Showing {ROWS_PER_PAGE} rows per page</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setClientCurrentPage(Math.max(1, clientCurrentPage - 1))}
                  disabled={clientCurrentPage === 1}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                {buildPagination(clientTotalPages).map((page, index) => (
                  <button
                    key={page === -1 ? `client-ellipsis-${index}` : `client-page-${page}`}
                    onClick={() => page !== -1 && setClientCurrentPage(page)}
                    disabled={page === -1}
                    className={`rounded-lg px-3 py-1 text-sm font-medium transition-all ${getPaginationButtonClass(clientCurrentPage, page)}`}
                  >
                    {page === -1 ? "..." : page}
                  </button>
                ))}
                <button
                  onClick={() => setClientCurrentPage(Math.min(clientTotalPages, clientCurrentPage + 1))}
                  disabled={clientCurrentPage === clientTotalPages}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">Agents</h3>
              <div className="relative w-full max-w-[220px]">
                <input
                  type="text"
                  value={agentSearchQuery}
                  onChange={(e) => setAgentSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 pr-9 text-xs text-slate-700 placeholder:text-slate-500 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>
            <div className="thin-scrollbar max-h-[520px] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.07em] text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Agent</th>
                    <th className="px-3 py-2">Client</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Last heartbeat</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading && filteredAgents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-5 text-center text-slate-500">
                        No agents found.
                      </td>
                    </tr>
                  )}
                  {paginatedAgents.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium text-slate-800">{row.agentName}</td>
                      <td className="px-3 py-2 text-slate-700">{row.clientName || "-"}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            row.status ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {row.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">{formatDateTime(row.lastHeartbeat)}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditAgent(row)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-100"
                            aria-label="Edit agent"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.232-6.232a2.5 2.5 0 113.536 3.536L12.536 16.5H9v-3.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteAgent(row)}
                            disabled={!row.status || actionInProgressKey === `agent-delete-${row.id}`}
                            title={row.status ? "Delete agent" : "Already inactive"}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-300 bg-white text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Delete agent"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <span className="text-xs text-slate-600">Showing {ROWS_PER_PAGE} rows per page</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAgentCurrentPage(Math.max(1, agentCurrentPage - 1))}
                  disabled={agentCurrentPage === 1}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                {buildPagination(agentTotalPages).map((page, index) => (
                  <button
                    key={page === -1 ? `agent-ellipsis-${index}` : `agent-page-${page}`}
                    onClick={() => page !== -1 && setAgentCurrentPage(page)}
                    disabled={page === -1}
                    className={`rounded-lg px-3 py-1 text-sm font-medium transition-all ${getPaginationButtonClass(agentCurrentPage, page)}`}
                  >
                    {page === -1 ? "..." : page}
                  </button>
                ))}
                <button
                  onClick={() => setAgentCurrentPage(Math.min(agentTotalPages, agentCurrentPage + 1))}
                  disabled={agentCurrentPage === agentTotalPages}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
