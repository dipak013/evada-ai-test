"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AgentLicenseRow,
  AgentRow,
  ClientAgentService,
  ClientRow,
} from "@/services/client-agent.service";
import { hasPermission, RBAC_PERMISSIONS } from "@/lib/rbac";
import { useAuth } from "@/hooks/useAuth";

const LICENSE_TIERS = ["TRIAL", "SMALL", "STANDARD", "PROFESSIONAL", "ENTERPRISE", "UNLIMITED"] as const;

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function toDisplayDateTime(value: string | null): string {
  if (!value) return "Never";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Invalid date";
  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function isExpired(value: string | null): boolean {
  if (!value) return false;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.getTime() <= Date.now();
}

function getApiErrorMessage(error: any, fallback: string): string {
  return error?.response?.data?.error ?? error?.response?.data?.message ?? fallback;
}

function computeLicenseSummary(licenses: AgentLicenseRow[]) {
  const now = Date.now();
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

  let active = 0;
  let inactive = 0;
  let expired = 0;
  let expiringSoon = 0;

  for (const row of licenses) {
    if (row.is_active) {
      active += 1;
    } else {
      inactive += 1;
    }

    if (row.expires_at) {
      const ts = new Date(row.expires_at).getTime();
      if (!Number.isNaN(ts)) {
        if (ts <= now) {
          expired += 1;
        } else if (ts <= sevenDaysFromNow) {
          expiringSoon += 1;
        }
      }
    }
  }

  return {
    mapped: licenses.length,
    active,
    inactive,
    expired,
    expiringSoon,
  };
}

function isExpiringWithinHours(value: string | null, hours: number): boolean {
  if (value === null) return false;
  const expiresTs = new Date(value).getTime();
  if (Number.isNaN(expiresTs)) return false;
  const threshold = Date.now() + hours * 60 * 60 * 1000;
  return expiresTs <= threshold;
}

function getLicenseRiskMeta(row: AgentLicenseRow): {
  score: number;
  label: "High" | "Medium" | "Low";
  className: string;
} {
  const isHighRisk = isExpired(row.expires_at) || row.is_active === false;
  if (isHighRisk) {
    return {
      score: 3,
      label: "High",
      className: "bg-red-100 text-red-700",
    };
  }

  if (isExpiringWithinHours(row.expires_at, 72)) {
    return {
      score: 2,
      label: "Medium",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    score: 1,
    label: "Low",
    className: "bg-emerald-100 text-emerald-700",
  };
}

function matchesQuery(row: AgentLicenseRow, query: string): boolean {
  if (query.trim() === "") return true;
  const normalized = query.toLowerCase();
  const haystack = [
    row.client_name,
    row.agent_name,
    row.agent_uuid,
    row.tier,
    row.license_key,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalized);
}

type MatrixRisk = {
  score: number;
  label: "High" | "Medium" | "Low";
  className: string;
};

type MatrixRow = {
  row: AgentLicenseRow;
  risk: MatrixRisk;
};

type LicenseMatrixSectionProps = {
  readonly licenses: AgentLicenseRow[];
  readonly matrixRows: MatrixRow[];
  readonly loading: boolean;
  readonly searchTerm: string;
  readonly statusFilter: "ALL" | "ACTIVE" | "INACTIVE";
  readonly riskFilter: "ALL" | "HIGH" | "MEDIUM" | "LOW";
  readonly onSearchTermChange: (value: string) => void;
  readonly onStatusFilterChange: (value: "ALL" | "ACTIVE" | "INACTIVE") => void;
  readonly onRiskFilterChange: (value: "ALL" | "HIGH" | "MEDIUM" | "LOW") => void;
  readonly onResetFilters: () => void;
};

function LicenseMatrixSection({
  licenses,
  matrixRows,
  loading,
  searchTerm,
  statusFilter,
  riskFilter,
  onSearchTermChange,
  onStatusFilterChange,
  onRiskFilterChange,
  onResetFilters,
}: Readonly<LicenseMatrixSectionProps>) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">Client Agent License Matrix</h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {licenses.length} mapped agent(s)
        </span>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-2 xl:grid-cols-[1.7fr_1fr_1fr_auto]">
        <label className="text-xs font-medium text-slate-600">
          <div className="mb-1">Search License Matrix</div>
          <input
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search by client, agent, UUID, tier, key"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label className="text-xs font-medium text-slate-600">
          <div className="mb-1">Status Filter</div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active only</option>
            <option value="INACTIVE">Inactive only</option>
          </select>
        </label>

        <label className="text-xs font-medium text-slate-600">
          <div className="mb-1">Risk Filter</div>
          <select
            value={riskFilter}
            onChange={(e) => onRiskFilterChange(e.target.value as "ALL" | "HIGH" | "MEDIUM" | "LOW")}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="ALL">All risks</option>
            <option value="HIGH">High risk only</option>
            <option value="MEDIUM">Medium risk only</option>
            <option value="LOW">Low risk only</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onResetFilters}
          className="h-10 self-end rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:col-span-2 xl:col-span-1"
        >
          Reset Filters
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
        <p className="text-slate-600">
          Showing <span className="font-semibold text-slate-800">{matrixRows.length}</span> row(s), sorted by risk and nearest expiry.
        </p>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700">High</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">Medium</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">Low</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[900px] divide-y divide-slate-200 text-xs sm:text-sm lg:min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="sticky left-0 top-0 z-30 min-w-[220px] border-r border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold tracking-wide text-slate-600">
                Client
              </th>
              <th className="sticky left-[220px] top-0 z-30 min-w-[220px] border-r border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold tracking-wide text-slate-600">
                Agent
              </th>
              <th className="sticky top-0 z-20 bg-slate-50 px-3 py-2 text-left font-semibold tracking-wide text-slate-600">Agent UUID</th>
              <th className="px-3 py-2 text-left font-semibold tracking-wide text-slate-600">Tier</th>
              <th className="px-3 py-2 text-left font-semibold tracking-wide text-slate-600">Device Limit</th>
              <th className="px-3 py-2 text-left font-semibold tracking-wide text-slate-600">Status</th>
              <th className="px-3 py-2 text-left font-semibold tracking-wide text-slate-600">Risk</th>
              <th className="px-4 py-2 text-left font-semibold tracking-wide text-slate-600">Expires At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {matrixRows.map(({ row, risk }, index) => {
              const isEven = index % 2 === 0;
              let rowToneClass = "bg-white";
              if (risk.score === 3) {
                rowToneClass = "bg-red-50/25";
              } else if (!isEven) {
                rowToneClass = "bg-slate-50/25";
              }

              let statusBadgeClass = "bg-slate-200 text-slate-600";
              let statusBadgeLabel = "Inactive";
              if (row.is_active) {
                statusBadgeClass = "bg-emerald-100 text-emerald-700";
                statusBadgeLabel = "Active";
              }

              let expiresTextClass = "text-slate-700";
              if (isExpired(row.expires_at)) {
                expiresTextClass = "text-red-600";
              }

              return (
                <tr
                  key={row.agent_id}
                  className={`group transition-colors hover:bg-slate-50/80 ${rowToneClass}`}
                >
                  <td
                    className={`sticky left-0 z-10 min-w-[220px] border-r border-slate-200 px-3 py-2 text-slate-700 group-hover:bg-slate-50/80 ${rowToneClass}`}
                  >
                    {row.client_name || "Unassigned"}
                  </td>
                  <td
                    className={`sticky left-[220px] z-10 min-w-[220px] border-r border-slate-200 px-3 py-2 text-slate-700 group-hover:bg-slate-50/80 ${rowToneClass}`}
                  >
                    {row.agent_name}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-700">{row.agent_uuid || "Pending binding"}</td>
                  <td className="px-3 py-2 text-slate-700">{row.tier}</td>
                  <td className="px-3 py-2 text-slate-700">{row.device_limit}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass}`}>
                      {statusBadgeLabel}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${risk.className}`}>
                      {risk.label}
                    </span>
                  </td>
                  <td className={`px-4 py-2 ${expiresTextClass}`}>
                    {toDisplayDateTime(row.expires_at)}
                  </td>
                </tr>
              );
            })}
            {!loading && matrixRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-slate-500">
                  No license mappings match the active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function LicenseManagementPage() {
  const { user, isLoading: authLoading } = useAuth();

  const [clients, setClients] = useState<ClientRow[]>([]);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [licenses, setLicenses] = useState<AgentLicenseRow[]>([]);

  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  const [tier, setTier] = useState<string>("STANDARD");
  const [deviceLimit, setDeviceLimit] = useState<string>("25");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [agentUuid, setAgentUuid] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  const canAccess = hasPermission(user, RBAC_PERMISSIONS.PAGE_SAAS_ADMIN);

  const licenseByAgentId = useMemo(() => {
    return Object.fromEntries(licenses.map((row) => [row.agent_id, row]));
  }, [licenses]);

  const visibleClients = useMemo(() => {
    return clients.filter((client) => client.status);
  }, [clients]);

  const filteredAgents = useMemo(() => {
    if (!selectedClientId) return [];
    return agents.filter((agent) => agent.clientId === selectedClientId && agent.status);
  }, [agents, selectedClientId]);

  const selectedAgent = useMemo(() => {
    return filteredAgents.find((agent) => agent.id === selectedAgentId) ?? null;
  }, [filteredAgents, selectedAgentId]);

  const selectedLicense = selectedAgentId ? (licenseByAgentId[selectedAgentId] ?? null) : null;

  const licenseSummary = useMemo(() => computeLicenseSummary(licenses), [licenses]);

  const selectedLicenseExpiryStatus = useMemo(() => {
    if (selectedLicense === null) {
      return {
        label: "No Expiry",
        className: "bg-slate-200 text-slate-600",
      };
    }

    if (isExpired(selectedLicense.expires_at)) {
      return {
        label: "Expired",
        className: "bg-red-100 text-red-700",
      };
    }

    return {
      label: "Valid",
      className: "bg-slate-200 text-slate-600",
    };
  }, [selectedLicense]);

  const matrixRows = useMemo(() => {
    const withRisk = licenses
      .filter((row) => selectedClientId === "" || row.client_id === selectedClientId)
      .filter((row) => {
        if (statusFilter === "ALL") return true;
        if (statusFilter === "ACTIVE") return row.is_active;
        return !row.is_active;
      })
      .filter((row) => {
        if (riskFilter === "ALL") return true;
        const risk = getLicenseRiskMeta(row).label.toUpperCase();
        return risk === riskFilter;
      })
      .filter((row) => matchesQuery(row, searchTerm))
      .map((row) => {
        const risk = getLicenseRiskMeta(row);
        return {
          row,
          risk,
        };
      });

    withRisk.sort((a, b) => {
      if (b.risk.score !== a.risk.score) {
        return b.risk.score - a.risk.score;
      }

      const aExpiry = a.row.expires_at ? new Date(a.row.expires_at).getTime() : Number.MAX_SAFE_INTEGER;
      const bExpiry = b.row.expires_at ? new Date(b.row.expires_at).getTime() : Number.MAX_SAFE_INTEGER;
      return aExpiry - bExpiry;
    });

    return withRisk;
  }, [licenses, selectedClientId, statusFilter, riskFilter, searchTerm]);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsRes, agentsRes, licensesRes] = await Promise.all([
        ClientAgentService.getClients(),
        ClientAgentService.getAgents(),
        ClientAgentService.getAgentLicenses(),
      ]);

      setClients(clientsRes.data);
      setAgents(agentsRes.data);
      setLicenses(licensesRes.data);

      if (selectedClientId === "" && clientsRes.data.length > 0) {
        setSelectedClientId(clientsRes.data[0].id);
      }
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Failed to load license management data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshData();
  }, []);

  useEffect(() => {
    if (selectedClientId === "" || filteredAgents.length === 0) {
      setSelectedAgentId("");
      return;
    }

    if (!filteredAgents.some((agent) => agent.id === selectedAgentId)) {
      setSelectedAgentId(filteredAgents[0].id);
    }
  }, [filteredAgents, selectedAgentId, selectedClientId]);

  useEffect(() => {
    if (selectedLicense === null) {
      setTier("STANDARD");
      setDeviceLimit("25");
      setIsActive(true);
      setExpiresAt("");
    } else {
      setTier(selectedLicense.tier || "STANDARD");
      setDeviceLimit(String(selectedLicense.device_limit || 25));
      setIsActive(Boolean(selectedLicense.is_active));
      setExpiresAt(toDateTimeLocal(selectedLicense.expires_at));
    }

    setAgentUuid(selectedAgent?.agentUuid ?? "");
  }, [selectedAgent, selectedLicense]);

  const handleGenerateAgentUuid = async () => {
    if (!selectedAgentId) {
      setError("Select an agent first.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await ClientAgentService.mapAgentUuid({
        agent_id: selectedAgentId,
        generate_agent_uuid: true,
      });
      setMessage(response.data.message || "Agent UUID generated and mapped successfully.");
      await refreshData();
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Failed to generate and map agent UUID."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMapAgentUuid = async () => {
    if (!selectedAgentId) {
      setError("Select an agent first.");
      return;
    }

    const trimmed = agentUuid.trim();
    if (!trimmed) {
      setError("Enter a UUID value or use Generate UUID.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await ClientAgentService.mapAgentUuid({
        agent_id: selectedAgentId,
        agent_uuid: trimmed,
      });
      setMessage(response.data.message || "Agent UUID mapping updated successfully.");
      await refreshData();
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Failed to map agent UUID."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateLicense = async () => {
    if (!selectedAgentId) {
      setError("Select an agent first.");
      return;
    }

    const limit = Number(deviceLimit);
    if (!Number.isFinite(limit) || limit <= 0) {
      setError("Device limit must be greater than zero.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await ClientAgentService.generateAgentLicense({
        agent_id: selectedAgentId,
        tier,
        device_limit: limit,
        is_active: isActive,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      setMessage(response.data.message || "License generated successfully.");
      await refreshData();
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Failed to generate license key."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveLicense = async () => {
    if (!selectedAgentId || !selectedLicense) {
      setError("This agent has no license key yet. Generate one first.");
      return;
    }

    const limit = Number(deviceLimit);
    if (!Number.isFinite(limit) || limit <= 0) {
      setError("Device limit must be greater than zero.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await ClientAgentService.saveAgentLicense({
        agent_id: selectedAgentId,
        tier,
        device_limit: limit,
        is_active: isActive,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      setMessage(response.data.message || "License settings updated.");
      await refreshData();
    } catch (e: any) {
      setError(getApiErrorMessage(e, "Failed to update license settings."));
    } finally {
      setSubmitting(false);
    }
  };

  if (!authLoading && !canAccess) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-800">Unauthorized</h1>
        <p className="mt-2 text-sm text-red-700">Only SaaS Admin users can access License Management.</p>
        <Link href="/saas-admin" className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">
          Back to SaaS Admin
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.06),transparent_50%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-700">Security Control Plane</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">License Management</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage agent entitlement posture, UUID bindings, and expiration risk by client.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Posture</p>
              <p className="text-sm font-semibold text-slate-900">
                {licenseSummary.expired > 0 ? "Action Required" : "Stable"}
              </p>
            </div>
            <Link
              href="/saas-admin"
              className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to SaaS Admin Console
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Mapped Agents</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{licenseSummary.mapped}</p>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-white p-3 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">Active</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">{licenseSummary.active}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Inactive</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">{licenseSummary.inactive}</p>
        </article>
        <article className="rounded-xl border border-amber-200 bg-white p-3 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">Expiring in 7 Days</p>
          <p className="mt-2 text-2xl font-semibold text-amber-700">{licenseSummary.expiringSoon}</p>
        </article>
        <article className="rounded-xl border border-red-200 bg-white p-3 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-red-700">Expired</p>
          <p className="mt-2 text-2xl font-semibold text-red-700">{licenseSummary.expired}</p>
        </article>
      </section>

      {(error || message) && (
        <section
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </section>
      )}

      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.35fr_1.65fr] xl:grid-cols-[1.9fr_3.1fr]">
        <article className="self-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Target Selection</h2>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
              Scope
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Select a client and active agent to configure license controls.</p>

          <div className="mt-4 space-y-3">
            <label className="block text-xs font-medium text-slate-600">
              <span>Client</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                disabled={loading || submitting}
              >
                {visibleClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-slate-600">
              <span>Agent</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                disabled={loading || submitting || !filteredAgents.length}
              >
                {filteredAgents.length === 0 ? <option value="">No active agent available</option> : null}
                {filteredAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.agentName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium text-slate-500">Selected Agent UUID</span>
              <span className="max-w-[70%] break-all text-right font-semibold text-slate-800">
                {selectedAgent?.agentUuid || "Pending binding"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium text-slate-500">Current License Key</span>
              <span className="max-w-[70%] break-all text-right font-semibold text-slate-800">
                {selectedLicense?.license_key || "Not generated"}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <span className="text-[11px] text-slate-500">Current Status</span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    selectedLicense?.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {selectedLicense?.is_active ? "Active" : "Inactive / Unset"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${selectedLicenseExpiryStatus.className}`}
                >
                  {selectedLicenseExpiryStatus.label}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Visible Agents</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{filteredAgents.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Client Coverage</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{visibleClients.length}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">License Configuration</h2>
              <p className="mt-1 text-xs text-slate-500">License key is immutable after generation.</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
              Hardening Controls
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">Agent UUID Mapping</h3>
            <p className="mt-1 text-xs text-slate-500">Map unmapped agents or rotate to a new UUID binding.</p>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr]">
              <label className="text-xs font-medium text-slate-600">
                <span>Agent UUID</span>
                <input
                  type="text"
                  value={agentUuid}
                  onChange={(e) => setAgentUuid(e.target.value)}
                  disabled={!selectedAgentId || loading || submitting}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </label>

              <button
                type="button"
                onClick={handleMapAgentUuid}
                disabled={!selectedAgentId || loading || submitting}
                className="h-10 self-end rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Mapping..." : "Map UUID"}
              </button>

              <button
                type="button"
                onClick={handleGenerateAgentUuid}
                disabled={!selectedAgentId || loading || submitting}
                className="h-10 self-end rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Generating..." : "Generate UUID"}
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-600">
              <span>License Key</span>
              <input
                type="text"
                value={selectedLicense?.license_key || ""}
                readOnly
                placeholder="Generate key for this agent"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-900"
              />
            </label>

            <label className="text-xs font-medium text-slate-600">
              <span>Tier</span>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                disabled={!selectedAgentId || loading || submitting}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
              >
                {LICENSE_TIERS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-medium text-slate-600">
              <span>Device Limit</span>
              <input
                type="number"
                min={1}
                value={deviceLimit}
                onChange={(e) => setDeviceLimit(e.target.value)}
                disabled={!selectedAgentId || loading || submitting}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
              />
            </label>

            <label className="text-xs font-medium text-slate-600">
              <span>Expires At (local timezone)</span>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                disabled={!selectedAgentId || loading || submitting}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={!selectedAgentId || loading || submitting}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>License active</span>
            </label>

            {selectedLicense ? (
              <button
                type="button"
                onClick={handleSaveLicense}
                disabled={!selectedAgentId || loading || submitting}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Settings"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateLicense}
                disabled={!selectedAgentId || loading || submitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Generating..." : "Generate License Key"}
              </button>
            )}
          </div>

          {selectedLicense && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Last Updated</span>
                <span className="font-medium text-slate-800">{toDisplayDateTime(selectedLicense.updated_at)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Expires</span>
                <span
                  className={`font-medium ${isExpired(selectedLicense.expires_at) ? "text-red-600" : "text-slate-800"}`}
                >
                  {toDisplayDateTime(selectedLicense.expires_at)}
                </span>
              </div>
            </div>
          )}
        </article>
      </section>

      <LicenseMatrixSection
        licenses={licenses}
        matrixRows={matrixRows}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        riskFilter={riskFilter}
        onSearchTermChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onRiskFilterChange={setRiskFilter}
        onResetFilters={() => {
          setSearchTerm("");
          setStatusFilter("ALL");
          setRiskFilter("ALL");
        }}
      />
    </div>
  );
}
