"use client";

import { LogsService, type ApmDetailsResponse, type ViewLogRow } from "@/services/logs.service";
import { SidebarService, type SidebarClientResponse } from "@/services/sidebar.service";
import { useAuth } from "@/hooks/useAuth";
import { hasRole } from "@/lib/rbac";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

type ActiveTab = "logs" | "apm";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SIX_MONTHS_MS = 183 * ONE_DAY_MS;
const TABLE_PAGE_SIZE = 25;

function nowLocalDateTime(): string {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
}

function toLocalDateTime(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

function toApiDateTime(localDateTime: string): string {
  const parsed = new Date(localDateTime);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  const seconds = String(parsed.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function levelClass(level: string): string {
  const normalized = (level || "").toLowerCase();
  if (normalized.includes("error")) return "bg-rose-100 text-rose-700 border-rose-200";
  if (normalized.includes("warn")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (normalized.includes("debug")) return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

function compactDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function readableLogMessage(log: ViewLogRow): string {
  if (log.readableMessage && log.readableMessage.trim()) {
    return log.readableMessage;
  }

  if (log.method && log.path) {
    const status = typeof log.status === "number" ? `status ${log.status}` : "status -";
    const duration = typeof log.durationMs === "number" ? `${log.durationMs} ms` : "duration -";
    return `Request completed: ${log.method} ${log.path} | ${status} | ${duration}`;
  }

  const msg = (log.message || "").trim();
  if (!msg) return "-";

  if (msg.startsWith("File \"") && msg.includes(", line ")) {
    return msg.replace(/^File\s+"([^"]+)"\s*,\s*line\s+(\d+)\s*,\s*in\s+(.+)$/i, "Trace: $1:$2 in $3");
  }

  if (msg.startsWith("^") || msg.includes("^^^^")) {
    return "Traceback code pointer.";
  }

  return msg;
}

function LoadingPanel({ label }: Readonly<{ label: string }>) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-10 text-sm text-slate-600">
      <div className="h-5 w-5 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | null | undefined>>): void {
  const content = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ViewLogsPage() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - ONE_DAY_MS);
  const maxDateTime = nowLocalDateTime();

  const [activeTab, setActiveTab] = useState<ActiveTab>("logs");
  const [clients, setClients] = useState<SidebarClientResponse[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const { user } = useAuth();
  const [isClientUser, setIsClientUser] = useState<boolean>(false);
  const [modules, setModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");

  const [fromDateTime, setFromDateTime] = useState<string>(toLocalDateTime(yesterday));
  const [toDateTime, setToDateTime] = useState<string>(nowLocalDateTime());
  const [search, setSearch] = useState<string>("");
  const [logsPage, setLogsPage] = useState<number>(1);
  const logsPageSize = TABLE_PAGE_SIZE;
  const [validationError, setValidationError] = useState<string | null>(null);

  const [logs, setLogs] = useState<ViewLogRow[]>([]);
  const [logsTotal, setLogsTotal] = useState<number>(0);
  const [logsSummary, setLogsSummary] = useState({ total: 0, errors: 0, warnings: 0, requests: 0 });
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const [apm, setApm] = useState<ApmDetailsResponse | null>(null);
  const [apmSearch, setApmSearch] = useState<string>("");
  const [apmPage, setApmPage] = useState<number>(1);
  const [isLoadingApm, setIsLoadingApm] = useState<boolean>(false);
  const [apmError, setApmError] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(false);
  const [autoRefreshSeconds, setAutoRefreshSeconds] = useState<number>(30);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  const fromMs = useMemo(() => new Date(fromDateTime).getTime(), [fromDateTime]);
  const toMs = useMemo(() => new Date(toDateTime).getTime(), [toDateTime]);

  const validateRange = (): boolean => {
    if (!fromDateTime || !toDateTime) {
      setValidationError("Please provide both from and to datetime values.");
      return false;
    }

    if (!Number.isFinite(fromMs) || !Number.isFinite(toMs)) {
      setValidationError("Please provide valid datetime values.");
      return false;
    }

    const nowMs = Date.now();
    if (fromMs > nowMs || toMs > nowMs) {
      setValidationError("From and To datetime cannot be in the future.");
      return false;
    }

    if (toMs <= fromMs) {
      setValidationError("To datetime must be later than from datetime.");
      return false;
    }

    const diff = toMs - fromMs;
    if (diff < ONE_DAY_MS) {
      setValidationError("Minimum date range is 1 day.");
      return false;
    }

    if (diff > SIX_MONTHS_MS) {
      setValidationError("Maximum date range is 6 months.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const fetchLogs = async (page = logsPage, pageSize = logsPageSize): Promise<void> => {
    if (!validateRange()) return;

    setIsLoadingLogs(true);
    setLogsError(null);

    try {
      const response = await LogsService.getLogs({
        clientId: selectedClientId || undefined,
        module: selectedModule || undefined,
        fromDateTime: toApiDateTime(fromDateTime),
        toDateTime: toApiDateTime(toDateTime),
        search: search.trim() || undefined,
        page,
        pageSize,
      });

      setLogs(response.data.results || []);
      setLogsTotal(response.data.total || 0);
      setLogsSummary(response.data.summary || { total: response.data.total || 0, errors: 0, warnings: 0, requests: 0 });
      setModules(response.data.meta?.modules || []);
    } catch (error) {
      console.error("Failed to fetch logs", error);
      const responseError = axios.isAxiosError(error) ? error.response?.data : null;
      const detail = responseError && typeof responseError === "object"
        ? String((responseError as { error?: string; detail?: string }).error || (responseError as { detail?: string }).detail || "")
        : "";
      setLogsError(detail ? `Unable to load logs: ${detail}` : "Unable to load logs from audit/application log files.");
      setLogs([]);
      setLogsTotal(0);
      setLogsSummary({ total: 0, errors: 0, warnings: 0, requests: 0 });
      setModules([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const fetchApm = async (): Promise<void> => {
    if (!validateRange()) return;

    setIsLoadingApm(true);
    setApmError(null);

    try {
      const response = await LogsService.getApmDetails({
        clientId: selectedClientId || undefined,
        fromDateTime: toApiDateTime(fromDateTime),
        toDateTime: toApiDateTime(toDateTime),
      });
      setApm(response.data);
    } catch (error) {
      console.error("Failed to fetch APM details", error);
      const responseError = axios.isAxiosError(error) ? error.response?.data : null;
      const detail = responseError && typeof responseError === "object"
        ? String((responseError as { error?: string; detail?: string }).error || (responseError as { detail?: string }).detail || "")
        : "";
      setApmError(detail ? `Unable to load APM details: ${detail}` : "Unable to load APM details from request logs.");
      setApm(null);
    } finally {
      setIsLoadingApm(false);
    }
  };

  const applyFilters = async (options?: { logsPage?: number; resetApmPage?: boolean }): Promise<void> => {
    if (isRefreshingRef.current) {
      return;
    }

    const targetLogsPage = options?.logsPage ?? logsPage;

    isRefreshingRef.current = true;
    try {
      await fetchLogs(targetLogsPage, logsPageSize);
      await fetchApm();
      if (options?.logsPage && options.logsPage !== logsPage) {
        setLogsPage(options.logsPage);
      }
      if (options?.resetApmPage) {
        setApmPage(1);
      }
      setLastRefreshedAt(new Date().toISOString());
    } finally {
      isRefreshingRef.current = false;
    }
  };

  const handleApplyFilters = async (): Promise<void> => {
    setLogsPage(1);
    setApmPage(1);
    await applyFilters({ logsPage: 1, resetApmPage: true });
  };

  const apmFilteredEndpoints = useMemo(() => {
    const term = apmSearch.trim().toLowerCase();
    if (!term) {
      return apm?.endpoints || [];
    }

    return (apm?.endpoints || []).filter((metric) => metric.endpoint.toLowerCase().includes(term));
  }, [apm?.endpoints, apmSearch]);

  const apmPageCount = useMemo(
    () => Math.max(1, Math.ceil(apmFilteredEndpoints.length / TABLE_PAGE_SIZE)),
    [apmFilteredEndpoints.length]
  );

  const paginatedApmEndpoints = useMemo(() => {
    const start = (apmPage - 1) * TABLE_PAGE_SIZE;
    return apmFilteredEndpoints.slice(start, start + TABLE_PAGE_SIZE);
  }, [apmFilteredEndpoints, apmPage]);

  useEffect(() => {
    setApmPage(1);
  }, [apmSearch]);

  useEffect(() => {
    if (apmPage > apmPageCount) {
      setApmPage(apmPageCount);
    }
  }, [apmPage, apmPageCount]);

  const logsStartRow = logsTotal === 0 ? 0 : (logsPage - 1) * logsPageSize + 1;
  const logsEndRow = logsTotal === 0 ? 0 : Math.min(logsPage * logsPageSize, logsTotal);
  const logsPageCount = Math.max(1, Math.ceil(logsTotal / logsPageSize));
  const apmStartRow = apmFilteredEndpoints.length === 0 ? 0 : (apmPage - 1) * TABLE_PAGE_SIZE + 1;
  const apmEndRow = apmFilteredEndpoints.length === 0 ? 0 : Math.min(apmPage * TABLE_PAGE_SIZE, apmFilteredEndpoints.length);

  const exportLogsCsv = (): void => {
    const rows = logs.map((log) => [
      log.timestamp,
      log.level,
      log.module,
      log.source,
      log.method,
      log.path,
      log.status,
      log.durationMs,
      readableLogMessage(log),
      log.message,
    ]);
    downloadCsv(
      `audit-logs-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`,
      ["timestamp", "level", "module", "source", "method", "path", "status", "duration_ms", "readable_message", "raw_message"],
      rows
    );
  };

  const exportApmCsv = (): void => {
    const rows = (apm?.endpoints || []).map((metric) => [
      metric.endpoint,
      metric.requestCount,
      metric.totalTimeTakenMs,
      metric.avgLatencyMs,
      metric.p95LatencyMs,
      metric.errorRate,
    ]);
    downloadCsv(
      `apm-endpoints-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`,
      ["endpoint", "request_count", "total_time_ms", "avg_latency_ms", "p95_latency_ms", "error_rate_percent"],
      rows
    );
  };

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await SidebarService.getSidebarClientsCached();
        const allClients = data || [];

        const explicitRoleSlugs = Array.isArray(user?.roles)
          ? user.roles.map((role: any) => String(role).toLowerCase())
          : [];
        const hasChannelPartnerRole = explicitRoleSlugs.includes("channel_partner");
        const clientUser = !!user && hasRole(user, "client") && !hasChannelPartnerRole;
        setIsClientUser(clientUser);

        if (clientUser) {
          // If the backend included assigned_clients for this user, prefer that list
          const assigned = (user?.assigned_clients || []) as Array<{ id: any; clientName?: string }>;
          let attached: any[] = [];
          if (assigned && assigned.length > 0) {
            const ids = assigned.map((a) => Number(a.id));
            attached = allClients.filter((c: any) => ids.includes(Number(c.id)));
            // preserve clientName from assigned list if backend only provided id
            attached = attached.map((c: any) => ({ ...c, clientName: c.clientName || c.client_name }));
          } else {
            // Fallback: show all clients in the user's tenant (legacy behavior)
            const tenantId = user?.tenant?.id;
            attached = allClients.filter((c: any) => Number(c.tenant_id) === Number(tenantId));
          }
          setClients(attached);
          if (attached.length > 0) setSelectedClientId(String(attached[0].id));
        } else {
          setClients(allClients);
        }

        // After clients are loaded and selectedClientId possibly set, fetch data
        // Delay applyFilters slightly to ensure state updated
        setTimeout(() => {
          void applyFilters();
        }, 0);
      } catch (error) {
        console.warn("Failed to load clients", error);
        setClients([]);
        // still attempt initial fetch
        void applyFilters();
      }
    };

    loadClients();
    // re-run when the authenticated user becomes available/changes
  }, [user]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const timer = globalThis.setInterval(() => {
      applyFilters();
    }, autoRefreshSeconds * 1000);
    return () => globalThis.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefreshEnabled, autoRefreshSeconds, selectedClientId, selectedModule, fromDateTime, toDateTime, search]);

  return (
    <div className="page-padding">
      <div className="page-header">
        <div>
          <h1 className="text-page-title">View Logs</h1>
          <p className="text-small">Audit and request logs with compact APM analytics per endpoint.</p>
        </div>
        <div className="text-xs text-slate-500 rounded-full px-3 py-1 bg-white border border-indigo-100">
          Range allowed: 1 day to 6 months
        </div>
      </div>

      <div className="card card-padding mb-4 md:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 md:gap-4">
          <div>
            <label htmlFor="view-logs-client" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 mb-2">Client</label>
              <select
                id="view-logs-client"
                value={selectedClientId}
                onChange={(event) => setSelectedClientId(event.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isClientUser}
              >
                {!isClientUser && <option value="">All clients</option>}
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
          </div>

          <div>
            <label htmlFor="view-logs-module" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 mb-2">Module</label>
            <select
              id="view-logs-module"
              value={selectedModule}
              onChange={(event) => setSelectedModule(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All modules</option>
              {modules.map((moduleName) => (
                <option key={moduleName} value={moduleName}>
                  {moduleName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="view-logs-from" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 mb-2">From</label>
            <input
              id="view-logs-from"
              type="datetime-local"
              value={fromDateTime}
              max={maxDateTime}
              onChange={(event) => setFromDateTime(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="view-logs-to" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 mb-2">To</label>
            <input
              id="view-logs-to"
              type="datetime-local"
              value={toDateTime}
              max={maxDateTime}
              onChange={(event) => setToDateTime(event.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        </div>

        <div className="mt-4 border-t border-slate-200 pt-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "logs" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"
                }`}
              >
                Logs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("apm")}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "apm" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"
                }`}
              >
                APM
              </button>
            </div>

            <label htmlFor="view-logs-auto-refresh" className="inline-flex items-center gap-2 text-xs text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
              <input
                id="view-logs-auto-refresh"
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={(event) => setAutoRefreshEnabled(event.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Auto refresh</span>
            </label>

            <select
              value={autoRefreshSeconds}
              onChange={(event) => setAutoRefreshSeconds(Number(event.target.value))}
              disabled={!autoRefreshEnabled}
              className="text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-700 disabled:opacity-60"
            >
              <option value={15}>15 sec</option>
              <option value={30}>30 sec</option>
              <option value={60}>60 sec</option>
            </select>

            {lastRefreshedAt ? (
              <span className="text-xs text-slate-500">Last refresh: {new Date(lastRefreshedAt).toLocaleTimeString()}</span>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:ml-auto lg:justify-end">
            {activeTab === "logs" ? (
              <button
                type="button"
                onClick={exportLogsCsv}
                disabled={logs.length === 0}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-indigo-200 bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export Logs CSV
              </button>
            ) : (
              <button
                type="button"
                onClick={exportApmCsv}
                disabled={!apm || apm.endpoints.length === 0}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-indigo-200 bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export APM CSV
              </button>
            )}

            <button
              type="button"
              onClick={handleApplyFilters}
              disabled={isLoadingLogs || isLoadingApm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoadingLogs || isLoadingApm ? "Refreshing..." : "Apply Filters"}
            </button>
          </div>
        </div>

        {validationError ? (
          <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{validationError}</p>
        ) : null}
      </div>

      {activeTab === "logs" ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="card card-padding">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">Total Rows</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{logsSummary.total}</p>
            </div>
            <div className="card card-padding">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">Errors</p>
              <p className="text-2xl md:text-3xl font-bold text-rose-700 mt-1">{logsSummary.errors}</p>
            </div>
            <div className="card card-padding">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">Warnings</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-700 mt-1">{logsSummary.warnings}</p>
            </div>
            <div className="card card-padding">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">Request Logs</p>
              <p className="text-2xl md:text-3xl font-bold text-indigo-700 mt-1">{logsSummary.requests}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-padding border-b border-purple-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-card-title">Audit/Application Logs</h2>
                <span className="text-xs text-slate-500">Showing {logsStartRow}-{logsEndRow} of {logsTotal}</span>
              </div>

              <div className="w-full md:w-auto md:min-w-[320px]">
                <label htmlFor="view-logs-table-search" className="sr-only">Search logs table</label>
                <input
                  id="view-logs-table-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleApplyFilters();
                    }
                  }}
                  placeholder="Search logs table"
                  className="w-full px-4 py-2.5 rounded-full bg-indigo-50 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="responsive-table-container">
              <table className="responsive-table">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold">Timestamp</th>
                    <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold">Level</th>
                    <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold">Module</th>
                    <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold">Request</th>
                    <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold">Duration</th>
                    <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingLogs ? (
                    <tr>
                      <td colSpan={6} className="px-0 py-0">
                        <LoadingPanel label="Loading logs from audit/application log files..." />
                      </td>
                    </tr>
                  ) : null}

                  {logsError ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-rose-700">{logsError}</td>
                    </tr>
                  ) : null}

                  {!logsError && !isLoadingLogs && logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                        No log rows found for this filter.
                      </td>
                    </tr>
                  ) : null}

                  {!logsError && logs.map((log) => (
                    <tr key={log.id} className="border-b border-purple-50 bg-white hover:bg-indigo-50/40 transition-colors">
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-slate-700 whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}
                      </td>
                      <td className="px-3 md:px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${levelClass(log.level)}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-slate-700 whitespace-nowrap">{log.module || "-"}</td>
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-slate-700 whitespace-nowrap">
                        {log.method && log.path ? `${log.method} ${log.path}` : "-"}
                        {log.status ? <span className="ml-2 text-slate-500">({log.status})</span> : null}
                      </td>
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-slate-700 whitespace-nowrap">
                        {typeof log.durationMs === "number" ? compactDuration(log.durationMs) : "-"}
                      </td>
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-slate-700 max-w-[540px] truncate" title={log.message || ""}>
                        {readableLogMessage(log)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-padding border-t border-purple-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-600">25 rows per page</div>

              <div className="flex items-center justify-between gap-2 md:justify-end">
                <span className="text-sm text-slate-600">Page {logsPage} of {logsPageCount}</span>
                <button
                  type="button"
                  onClick={() => void applyFilters({ logsPage: logsPage - 1, resetApmPage: false })}
                  disabled={logsPage <= 1 || isLoadingLogs}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => void applyFilters({ logsPage: logsPage + 1, resetApmPage: false })}
                  disabled={logsPage >= logsPageCount || isLoadingLogs}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="card card-padding lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">Requests</p>
              <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">{apm?.numberOfRequests ?? 0}</p>
            </div>
            <div className="card card-padding lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">Total Time</p>
              <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">{compactDuration(apm?.totalTimeTakenMs ?? 0)}</p>
            </div>
            <div className="card card-padding lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">Avg Latency</p>
              <p className="text-xl md:text-2xl font-bold text-indigo-700 mt-1">{compactDuration(apm?.avgLatencyMs ?? 0)}</p>
            </div>
            <div className="card card-padding lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">P95 Latency</p>
              <p className="text-xl md:text-2xl font-bold text-purple-700 mt-1">{compactDuration(apm?.p95LatencyMs ?? 0)}</p>
            </div>
            <div className="card card-padding lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-500">Error Rate</p>
              <p className="text-xl md:text-2xl font-bold text-rose-700 mt-1">{(apm?.errorRate ?? 0).toFixed(2)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <div className="card">
              <div className="card-padding border-b border-purple-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-card-title">Endpoint Performance</h2>
                  <p className="text-xs text-slate-500">Showing {apmStartRow}-{apmEndRow} of {apmFilteredEndpoints.length}</p>
                </div>

                <div className="w-full md:w-auto md:min-w-[280px]">
                  <label htmlFor="view-logs-apm-search" className="sr-only">Search endpoints</label>
                  <input
                    id="view-logs-apm-search"
                    type="text"
                    value={apmSearch}
                    onChange={(event) => setApmSearch(event.target.value)}
                    placeholder="Search endpoints"
                    className="w-full px-4 py-2.5 rounded-full bg-indigo-50 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="max-h-[460px] overflow-auto thin-scrollbar">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-slate-500 bg-slate-50">
                      <th className="px-3 py-2 text-left">Endpoint</th>
                      <th className="px-3 py-2 text-right">Req</th>
                      <th className="px-3 py-2 text-right">Total</th>
                      <th className="px-3 py-2 text-right">Avg</th>
                      <th className="px-3 py-2 text-right">P95</th>
                      <th className="px-3 py-2 text-right">Err%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingApm ? (
                      <tr>
                        <td colSpan={6} className="px-0 py-0">
                          <LoadingPanel label="Loading endpoint-wise APM metrics..." />
                        </td>
                      </tr>
                    ) : null}

                    {apmError ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-sm text-center text-rose-700">{apmError}</td>
                      </tr>
                    ) : null}

                    {!apmError && !isLoadingApm && apmFilteredEndpoints.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-sm text-center text-slate-500">
                          No endpoint-level APM data found for this range.
                        </td>
                      </tr>
                    ) : null}

                    {!apmError && paginatedApmEndpoints.map((metric) => (
                      <tr key={metric.endpoint} className="border-b border-slate-100 text-sm">
                        <td className="px-3 py-2 text-slate-700 max-w-[320px] truncate" title={metric.endpoint}>{metric.endpoint}</td>
                        <td className="px-3 py-2 text-right text-slate-700">{metric.requestCount}</td>
                        <td className="px-3 py-2 text-right text-slate-700">{compactDuration(metric.totalTimeTakenMs)}</td>
                        <td className="px-3 py-2 text-right text-indigo-700 font-semibold">{metric.avgLatencyMs} ms</td>
                        <td className="px-3 py-2 text-right text-purple-700 font-semibold">{metric.p95LatencyMs} ms</td>
                        <td className="px-3 py-2 text-right text-rose-700 font-semibold">{metric.errorRate.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-padding border-t border-purple-100 flex items-center justify-between gap-2">
                <span className="text-sm text-slate-600">Page {apmPage} of {apmPageCount}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setApmPage((current) => Math.max(1, current - 1))}
                    disabled={apmPage <= 1}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setApmPage((current) => Math.min(apmPageCount, current + 1))}
                    disabled={apmPage >= apmPageCount}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-padding border-b border-purple-100 flex items-center justify-between">
                <h2 className="text-card-title">Waterfall (Slowest Requests)</h2>
                <span className="text-xs text-slate-500">Top 40 by latency</span>
              </div>
              <div className="card-padding space-y-2 max-h-[460px] overflow-auto thin-scrollbar">
                {isLoadingApm ? <LoadingPanel label="Building request waterfall..." /> : null}

                {apmError ? <p className="text-sm text-rose-700">{apmError}</p> : null}

                {!apmError && !isLoadingApm && (!apm || apm.waterfall.length === 0) ? (
                  <p className="text-sm text-slate-500">No waterfall rows found.</p>
                ) : null}

                {!apmError && apm?.waterfall.map((row, index) => {
                  const maxLatency = apm.waterfall[0]?.durationMs || 1;
                  const widthPercent = Math.max(6, Math.round((row.durationMs / maxLatency) * 100));

                  return (
                    <div key={`${row.method}-${row.path}-${row.timestamp}-${index}`} className="rounded-lg border border-slate-200 p-2.5 bg-white">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                        <span>{row.timestamp ? new Date(row.timestamp).toLocaleString() : "-"}</span>
                        <span className="font-semibold text-slate-700">{row.status}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-800 truncate" title={`${row.method} ${row.path}`}>
                        {row.method} {row.path}
                      </div>
                      <div className="mt-1.5 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${widthPercent}%` }} />
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{row.durationMs} ms</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
