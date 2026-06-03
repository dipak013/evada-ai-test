"use client";
import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { DashboardTab } from "./DashboardTab";
import { AgentManagementTab } from "./AgentManagementTab";
import SecurityConsoleScheduleModal from "./SecurityConsoleScheduleModal";
import { SidebarService, SidebarClientResponse } from "@/services/sidebar.service";
import { ScheduleService, NetworkScheduleData } from "@/services/schedule.service";
import { ScanService, type ScanType } from "@/services/scan.service";
import { ScanHistoryService } from "@/services/scan-history.service";
import { JobTerminalService } from "@/services/job-terminal.service";

const SCAN_PROFILES = [
  { id: "fast", label: "Fast Scan" },
  { id: "full", label: "Full Aggressive Scan" },
  { id: "stealth", label: "Stealth SYN Scan" },
  { id: "discovery", label: "Ping Sweep (Auto-Discovery)" },
  { id: "os_detect", label: "OS Fingerprinting" },
  { id: "udp_audit", label: "UDP Port Audit" },
  { id: "custom", label: "Expert Custom Override" },
] as const;



const SCAN_PROFILE_EST_TIME: Record<string, string> = {
  fast: "~10 min",
  full: "45-60 min",
  stealth: "~25 min",
  discovery: "~5 min",
  os_detect: "~35 min",
  udp_audit: "~20 min",
  custom: "Custom",
};

const TERMINAL_POLL_INTERVAL_MS = 2000;
const TERMINAL_MAX_LINES = 160;

function SecurityConsoleContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "agent-management">("dashboard");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("1");
  const [selectedSidebarItemId, setSelectedSidebarItemId] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleRefreshKey, setScheduleRefreshKey] = useState(0);
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);
  const [isRunningScans, setIsRunningScans] = useState(false);
  const [scheduleNotification, setScheduleNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  
  const [selectedScanProfile, setSelectedScanProfile] = useState<ScanType>("fast");
  const [isTargetDefOpen, setIsTargetDefOpen] = useState(false);
  const targetDefDropdownRef = useRef<HTMLDivElement>(null);
  const scanPollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanPollInFlightRef = useRef(false);
  const scanPollAttemptsRef = useRef(0);
  const scanPollSawRunningRef = useRef(false);
  const terminalPollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const terminalPollInFlightRef = useRef(false);
  const terminalOutputLengthRef = useRef(0);
  const activeTerminalJobIdRef = useRef<string | null>(null);

  const [sidebarClients, setSidebarClients] = useState<SidebarClientResponse[]>([]);
  const [sidebarError, setSidebarError] = useState<string | null>(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);
  const [isOnDemandScanExpanded, setIsOnDemandScanExpanded] = useState(true);
  const [activeTerminalJobId, setActiveTerminalJobId] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const activeClients = sidebarClients.filter((client) => client.status);
  const activeDropdownClients = activeClients.map((client) => ({
    id: client.id,
    label: `Client: ${client.clientName}`,
    value: client.clientName,
  }));
  const agentsByClient = useMemo(() => {
    return sidebarClients.reduce<Record<string, { id: string; name: string; label: string; value: string }[]>>(
      (acc, client) => {
        acc[client.clientName] = client.agents.map((agent) => ({
          id: agent.id,
          name: agent.agentName,
          label: `Agent: ${agent.agentName}`,
          value: agent.id,
        }));
        return acc;
      },
      {}
    );
  }, [sidebarClients]);
  const selectedClientStatus =
    sidebarClients.find((client) => client.id === selectedClientId)?.status ?? false;
  const isInactiveClient = selectedClientStatus === false;

  useEffect(() => {
    if (!selectedClient && activeDropdownClients.length > 0) {
      setSelectedClient(activeDropdownClients[0].value);
      setSelectedClientId(activeDropdownClients[0].id);
    }
  }, [activeDropdownClients, selectedClient]);

  useEffect(() => {
    if (!selectedClient) {
      return;
    }
    const matchingClient = activeClients.find((client) => client.clientName === selectedClient);
    if (matchingClient && matchingClient.id !== selectedClientId) {
      setSelectedClientId(matchingClient.id);
    }
  }, [activeClients, selectedClient, selectedClientId]);

  useEffect(() => {
    if (!selectedClient) {
      return;
    }
    const agents = agentsByClient[selectedClient] ?? [];
    if (agents.length === 0) {
      setSelectedAgent("");
      setSelectedAgentId("");
      return;
    }
    const matchedAgent = agents.find((agent) => agent.id === selectedAgentId);
    if (!matchedAgent) {
      setSelectedAgentId(agents[0].id);
      setSelectedAgent(agents[0].name);
      return;
    }
    setSelectedAgent(matchedAgent.name);
  }, [agentsByClient, selectedClient, selectedAgentId]);

  const sidebarRows = useMemo(() => {
    return sidebarClients.flatMap((client) =>
      client.agents.map((agent) => ({
        key: `${client.id}:${agent.id}`,
        clientId: client.id,
        clientName: client.clientName,
        clientStatus: client.status,
        agentId: agent.id,
        agentName: agent.agentName,
        agentStatus: agent.status,
        isOnline: agent.isOnline,
      }))
    );
  }, [sidebarClients]);

  const filteredSidebarRows = sidebarRows.filter((row) => {
    const query = searchQuery.toLowerCase();
    return (
      row.clientName.toLowerCase().includes(query) ||
      row.agentName.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    let isMounted = true;

    const loadSidebarClients = async () => {
      try {
        const data = await SidebarService.getSidebarClientsCached();
        if (!isMounted) return;
        setSidebarClients(data);
        setSidebarError(null);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load sidebar clients", error);
        setSidebarError("Unable to load sidebar clients.");
        setSidebarClients([]);
      }
    };

    loadSidebarClients();
    return () => {
      isMounted = false;
    };
  }, []);

  const clearScanPolling = () => {
    if (scanPollTimeoutRef.current) {
      clearTimeout(scanPollTimeoutRef.current);
      scanPollTimeoutRef.current = null;
    }
    scanPollInFlightRef.current = false;
    scanPollAttemptsRef.current = 0;
    scanPollSawRunningRef.current = false;
  };

  const getCommandPreviewLines = (): { color: string; text: string }[] => [
    { color: "text-slate-300", text: `$ pulse-scan --target ${selectedAgent ? "agent.network" : "0.0.0.0/24"}` },
    { color: "text-indigo-400", text: `--profile ${selectedScanProfile}` },
    { color: "text-emerald-400", text: "--detect-services --version-light" },
    { color: "text-orange-400", text: "--output-format\n   json" },
  ];

  const clearTerminalPolling = (resetState = false) => {
    if (terminalPollTimeoutRef.current) {
      clearTimeout(terminalPollTimeoutRef.current);
      terminalPollTimeoutRef.current = null;
    }
    terminalPollInFlightRef.current = false;

    if (resetState) {
      terminalOutputLengthRef.current = 0;
      activeTerminalJobIdRef.current = null;
      setActiveTerminalJobId(null);
      setTerminalLines([]);
    }
  };

  const appendTerminalOutput = (chunk: string) => {
    if (!chunk) return;
    const nextLines = chunk
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter(Boolean);

    if (!nextLines.length) return;

    setTerminalLines((prev) => {
      const merged = [...prev, ...nextLines];
      return merged.slice(-TERMINAL_MAX_LINES);
    });
  };

  const scheduleNextTerminalPoll = (jobId: string) => {
    terminalPollTimeoutRef.current = setTimeout(() => {
      void pollTerminalOutput(jobId);
    }, TERMINAL_POLL_INTERVAL_MS);
  };

  const fetchTerminalOutputOnce = async (jobId: string) => {
    const response = await JobTerminalService.getTerminalOutput(jobId, terminalOutputLengthRef.current);
    const payload = response.data;

    terminalOutputLengthRef.current = Math.max(
      terminalOutputLengthRef.current,
      Number(payload.current_length || 0)
    );

    if (payload.output) {
      appendTerminalOutput(payload.output);
    }

    return String(payload.status || "").toLowerCase();
  };

  const pollTerminalOutput = async (jobId: string) => {
    if (activeTerminalJobIdRef.current !== jobId) {
      return;
    }

    if (terminalPollInFlightRef.current) {
      scheduleNextTerminalPoll(jobId);
      return;
    }

    terminalPollInFlightRef.current = true;

    try {
      const status = await fetchTerminalOutputOnce(jobId);
      if (status === "completed" || status === "failed") {
        // Perform one immediate final delta fetch to capture any trailing lines.
        await fetchTerminalOutputOnce(jobId);
        clearTerminalPolling(false);
        return;
      }
    } catch (error) {
      console.error("Error polling terminal output", error);
    } finally {
      terminalPollInFlightRef.current = false;
    }

    if (activeTerminalJobIdRef.current === jobId) {
      scheduleNextTerminalPoll(jobId);
    }
  };

  const startTerminalOutputPolling = (jobId: string) => {
    clearTerminalPolling(true);
    activeTerminalJobIdRef.current = jobId;
    terminalOutputLengthRef.current = 0;
    setActiveTerminalJobId(jobId);
    setTerminalLines([
      `$ pulse-scan --target ${selectedAgent ? "agent.network" : "0.0.0.0/24"}`,
      `--profile ${selectedScanProfile}`,
      "[INFO] Waiting for agent terminal output...",
    ]);
    void pollTerminalOutput(jobId);
  };

  const getTerminalLineColor = (line: string) => {
    if (line.startsWith("[ERROR]")) return "text-red-400";
    if (line.startsWith("[WARN]")) return "text-amber-400";
    if (line.startsWith("[INFO]")) return "text-cyan-400";
    return "text-slate-300";
  };

  const pollScanCompletion = async (clientId: string, agentId: string) => {
    if (scanPollInFlightRef.current) {
      scanPollTimeoutRef.current = setTimeout(() => pollScanCompletion(clientId, agentId), 5000);
      return;
    }

    scanPollInFlightRef.current = true;
    scanPollAttemptsRef.current += 1;

    try {
      const response = await ScanHistoryService.getScanHistory({
        clientId,
        agentId,
        page: 1,
        pageSize: 10,
      });

      const rows = response.data.results ?? [];
      const hasRunning = rows.some((row) => String(row.status).toLowerCase() === "running");
      const latestTerminalRow = rows.find((row) => {
        const normalized = String(row.status).toLowerCase();
        return normalized === "completed" || normalized === "failed";
      });

      if (hasRunning) {
        scanPollSawRunningRef.current = true;
        setDashboardRefreshKey((prev) => prev + 1);
      }

      const canCompleteFromTerminal =
        !hasRunning &&
        Boolean(latestTerminalRow) &&
        (scanPollSawRunningRef.current || scanPollAttemptsRef.current >= 2);

      if (canCompleteFromTerminal) {
        const didFail = String(latestTerminalRow?.status).toLowerCase() === "failed";
        clearScanPolling();
        setIsRunningScans(false);
        setDashboardRefreshKey((prev) => prev + 1);
        setScheduleNotification({
          type: didFail ? "error" : "success",
          message: didFail
            ? "Scan finished with failures. Network Scan table has been refreshed."
            : "Scan completed. Network Scan table has been refreshed.",
        });
        setTimeout(() => setScheduleNotification(null), didFail ? 7000 : 5000);
        return;
      }

      if (scanPollAttemptsRef.current >= 90) {
        clearScanPolling();
        setIsRunningScans(false);
        setScheduleNotification({
          type: "error",
          message: "Scan is taking longer than expected. Please check the Network Scan table shortly.",
        });
        setTimeout(() => setScheduleNotification(null), 7000);
        return;
      }
    } catch (error) {
      console.error("Error polling scan progress", error);
    } finally {
      scanPollInFlightRef.current = false;
    }

    scanPollTimeoutRef.current = setTimeout(() => pollScanCompletion(clientId, agentId), 5000);
  };

  const startScanCompletionPolling = (clientId: string, agentId: string) => {
    clearScanPolling();
    scanPollTimeoutRef.current = setTimeout(() => pollScanCompletion(clientId, agentId), 3000);
  };

  useEffect(() => {
    return () => {
      clearScanPolling();
      clearTerminalPolling(false);
    };
  }, []);

  useEffect(() => {
    if (!isTargetDefOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (targetDefDropdownRef.current && !targetDefDropdownRef.current.contains(event.target as Node)) {
        setIsTargetDefOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTargetDefOpen]);

  const handleRunScan = async () => {
    if (!selectedClientId || !selectedAgentId) {
      setScheduleNotification({
        type: "error",
        message: "Please select both client and agent before running a scan.",
      });
      return;
    }

    const scanApiType = selectedScanProfile ?? "fast";
    setIsRunningScans(true);
    let keepLoaderVisible = false;

    try {
      const response = await ScanService.runScan({
        profile: scanApiType,
        client_id: selectedClientId,
        agent_id: selectedAgentId,
      });

      const normalizedStatus = (response.status || "").toLowerCase();
      const statusCode = response.status_code || 200;
      const submittedJobId =
        response.job_id || response.scan_id || response.job_ids?.[0] || response.scans?.[0]?.job_id;

      if (normalizedStatus === "error") {
        const firstFailure = response.failed_jobs?.[0]?.error;
        setScheduleNotification({
          type: "error",
          message: firstFailure || response.message || "One or more scans failed.",
        });
        setTimeout(() => setScheduleNotification(null), 7000);
        return;
      }

      // Treat 201/202 as successful async submission (queued/started)
      if (statusCode === 201 || statusCode === 202 || normalizedStatus === "started") {
        keepLoaderVisible = true;
        setScheduleNotification({
          type: "success",
          message: response.message || "Scan queued and will start shortly.",
        });
        if (submittedJobId) {
          startTerminalOutputPolling(submittedJobId);
        }
        setTimeout(() => setScheduleNotification(null), 5000);
        startScanCompletionPolling(selectedClientId, selectedAgentId);
        return;
      }

      setScheduleNotification({
        type: "success",
        message: response.message || "Scan started successfully.",
      });
      setDashboardRefreshKey((prev) => prev + 1);
      setTimeout(() => setScheduleNotification(null), 5000);
    } catch (error: any) {
      console.error("Error running scan", error);
      
      // Skip error notification for expected async timeouts (ECONNABORTED on run-scan)
      if (error.isExpectedAsyncTimeout) {
        console.info("Scan submission in progress (timeout expected for async operation)");
        // Still show success since submission likely succeeded
        setScheduleNotification({
          type: "success",
          message: "Scan queued and will start shortly.",
        });
        keepLoaderVisible = true;
        startScanCompletionPolling(selectedClientId, selectedAgentId);
        setTimeout(() => setScheduleNotification(null), 5000);
        return;
      }

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        null;

      setScheduleNotification({
        type: "error",
        message: backendMessage ? `Failed to start scan: ${backendMessage}` : "Failed to start scan. Please try again.",
      });
      setTimeout(() => setScheduleNotification(null), 7000);
    } finally {
      if (!keepLoaderVisible) {
        clearScanPolling();
        clearTerminalPolling(true);
        setIsRunningScans(false);
      }
    }
  };

  const handleScheduleScan = async (scheduleData: any) => {
    if (!selectedClientId || !selectedAgentId) {
      setScheduleNotification({
        type: "error",
        message: "Please select both client and agent before scheduling a scan.",
      });
      return;
    }

    let apiPayload: NetworkScheduleData;

    if (scheduleData.scheduleType === "once") {
      apiPayload = {
        schedule_type: "once",
        type_of_scan: "network_scan",
        client_id: selectedClientId,
        agent_id: selectedAgentId,
        scheduled_date: scheduleData.date,
        scheduled_time: scheduleData.time,
      };
    } else if (scheduleData.scheduleType === "recurring") {
      apiPayload = {
        schedule_type: "recurring",
        type_of_scan: "network_scan",
        client_id: selectedClientId,
        agent_id: selectedAgentId,
        frequency: scheduleData.frequency,
        start_date: scheduleData.startDate,
        scheduled_time: scheduleData.time,
      };
    } else if (scheduleData.scheduleType === "weekday") {
      apiPayload = {
        schedule_type: "weekday",
        type_of_scan: "network_scan",
        client_id: selectedClientId,
        agent_id: selectedAgentId,
        weekday: scheduleData.weekday,
        scheduled_time: scheduleData.time,
      };
    } else {
      alert("Invalid schedule type");
      return;
    }

    try {
      const existing = await ScheduleService.getSchedulesByClientAgentAndType(
        selectedClientId,
        selectedAgentId,
        "network_scan"
      );
      const existingScheduleId = existing.data[0]?.id;

      if (existingScheduleId) {
        await ScheduleService.updateNetworkSchedule(existingScheduleId, apiPayload);
      } else {
        await ScheduleService.createNetworkSchedule(apiPayload);
      }

      setIsScheduleModalOpen(false);
      setScheduleRefreshKey((prev) => prev + 1);
      setScheduleNotification({
        type: "success",
        message: existingScheduleId
          ? "Scan schedule updated successfully."
          : "Scan scheduled successfully.",
      });
      setTimeout(() => setScheduleNotification(null), 5000);
    } catch (error) {
      console.error("Error scheduling scan", error);
      setScheduleNotification({
        type: "error",
        message: "Failed to schedule scan. Please try again.",
      });
      setTimeout(() => setScheduleNotification(null), 7000);
    }
  };

  return (
    <div
      className={`page-padding grid min-h-screen gap-5 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/80 transition-[grid-template-columns] duration-300 ease-out ${
        isConsoleVisible ? "grid-cols-[16rem_minmax(0,1fr)]" : "grid-cols-[0_minmax(0,1fr)]"
      }`}
    >
      <div className="relative min-h-[calc(100vh-1.5rem)] self-stretch overflow-visible md:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
        <div
          id="saas-admin-console-panel"
          className={`flex h-full flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] overflow-hidden transition-all duration-300 ease-out ${
            isConsoleVisible
              ? "w-64 opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-2 pointer-events-none border-transparent shadow-none"
          }`}
          aria-hidden={!isConsoleVisible}
        >
          {/* SaaS Admin Console Header */}
          <div className="px-4 py-3.5 border-b border-slate-200/90 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/40">
            <h1 className="text-sm font-semibold tracking-wide text-slate-800">SaaS Admin Console</h1>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-slate-500">Client and agent control panel</p>
          </div>

          {/* Search and Client List */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
            {/* Search Input */}
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Client or Agent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pr-8 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300"
                />
                <svg
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Client List */}
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
              {sidebarError && (
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                  {sidebarError}
                </div>
              )}
              {filteredSidebarRows.map((row, index) => {
                const prevRow = filteredSidebarRows[index - 1];
                const isNewClientGroup = Boolean(prevRow && prevRow.clientId !== row.clientId);
                const isSelected = selectedSidebarItemId === row.key;
                const statusLabel = row.agentStatus ? "Active" : "Inactive";
                const statusDotClass = row.agentStatus ? "bg-green-500" : "bg-gray-400";
                const clientLabel = `Client: ${row.clientName}`;
                const agentLabel = `Agent: ${row.agentName} (${row.isOnline ? "online" : "offline"})`;
                let statusClass = "bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                if (isSelected) {
                  statusClass = "bg-slate-900/[0.03] border border-slate-300 ring-1 ring-slate-300/60 text-slate-900 shadow-sm";
                } else if (row.clientStatus) {
                  statusClass = "bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50";
                }
                const separatorClass = isNewClientGroup ? "border-t border-gray-200 pt-2 mt-2" : "";
                return (
                  <button
                    key={row.key}
                    type="button"
                    onClick={() => {
                      setSelectedSidebarItemId(row.key);
                      setSelectedClientId(row.clientId);
                      setSelectedClient(row.clientName);
                      setSelectedAgent(row.agentName);
                      setSelectedAgentId(row.agentId);
                    }}
                    className={`p-2.5 rounded-xl text-left w-full transition-all text-xs ${statusClass} ${separatorClass}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${statusDotClass}`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{clientLabel}</div>
                        <div className="text-gray-600 truncate">{agentLabel}</div>
                        <span className="text-xs text-gray-500">({statusLabel})</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="group absolute left-0 top-2 z-20 -translate-x-[110%]">
          <button
            type="button"
            onClick={() => setIsConsoleVisible((prev) => !prev)}
            title={
              isConsoleVisible
                ? "Hide SaaS Admin Console"
                : "SaaS Admin Console is hidden. Show panel"
            }
            aria-label={
              isConsoleVisible
                ? "Hide SaaS Admin Console panel"
                : "SaaS Admin Console is hidden. Show panel"
            }
            aria-expanded={isConsoleVisible}
            aria-controls="saas-admin-console-panel"
            className="inline-flex h-16 w-3.5 items-center justify-center rounded-full bg-gradient-to-b from-indigo-500 to-violet-600 text-white shadow-[0_10px_18px_-10px_rgba(79,70,229,0.85)] transition-all duration-200 hover:from-indigo-600 hover:to-violet-700 hover:shadow-[0_14px_24px_-12px_rgba(79,70,229,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.1}
              className={`h-3.5 w-3.5 transition-transform duration-200 ${isConsoleVisible ? "-translate-x-px" : "translate-x-px"}`}
            >
              {isConsoleVisible ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
          <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 w-56 -translate-y-1/2 rounded-lg border border-slate-200/90 bg-white/95 backdrop-blur px-3 py-2 text-center text-[11px] font-medium text-slate-700 opacity-0 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.7)] transition-opacity duration-200 group-hover:opacity-100">
            {isConsoleVisible
              ? "Collapse the SaaS Admin Console panel"
              : "SaaS Admin Console is currently hidden. Click to expand it."}
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex min-w-0 flex-1 flex-col pb-5">
        {scheduleNotification && (
          <output
            className={`mb-3 rounded-lg border px-4 py-2 text-sm font-medium ${
              scheduleNotification.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {scheduleNotification.message}
          </output>
        )}
        <section className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
          <div className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50/70 to-white px-4 py-4 text-left">
            <div>
              <h2 className="text-base font-semibold text-slate-900">On-Demand Scan</h2>
              <p className="mt-1 text-xs text-slate-500">
                Launch and schedule scans
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <button
                type="button"
                onClick={() => router.push("/saas-admin/license-management")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v8z" />
                </svg>
                License CMS
              </button>
              <button
                type="button"
                onClick={() => router.push("/saas-admin/client-agent-management")}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_-14px_rgba(99,102,241,0.95)] transition-all hover:from-indigo-600 hover:to-violet-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add new Client &amp; Agent
              </button>
              <button
                type="button"
                onClick={() => setIsOnDemandScanExpanded((prev) => !prev)}
                aria-expanded={isOnDemandScanExpanded}
                aria-controls="on-demand-scan-panel"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className={`h-4 w-4 transition-transform duration-200 ${isOnDemandScanExpanded ? "rotate-180" : "rotate-0"}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            id="on-demand-scan-panel"
            className={`grid transition-all duration-300 ease-out ${
              isOnDemandScanExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-slate-200 p-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                  {/* MIDDLE: Launch Network Scan */}
                  <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
                    <h3 className="mb-5 text-base font-bold text-slate-900">Launch Network Scan</h3>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm font-semibold text-slate-700">Select Scan Type:</p>
                      <div className="relative" ref={targetDefDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsTargetDefOpen((prev) => !prev)}
                          aria-expanded={isTargetDefOpen}
                          className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                        >
                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                            <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <circle cx="12" cy="12" r="3" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                            </svg>
                          </span>
                          <span className="flex-1 truncate text-left text-[11px] font-bold uppercase tracking-widest text-slate-700">
                            {SCAN_PROFILES.find((p) => p.id === selectedScanProfile)?.label ?? "SCAN PROFILE"}
                          </span>
                          <svg
                            className={`h-4 w-4 flex-shrink-0 text-slate-500 transition-transform duration-200 ${isTargetDefOpen ? "rotate-180" : "rotate-0"}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isTargetDefOpen && (
                          <div className="thin-scrollbar absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                            {SCAN_PROFILES.map((profile, idx) => (
                              <button
                                key={profile.id}
                                type="button"
                                onClick={() => { setSelectedScanProfile(profile.id); setIsTargetDefOpen(false); }}
                                className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors ${
                                  selectedScanProfile === profile.id
                                    ? "bg-indigo-600 font-semibold text-white"
                                    : "text-slate-700 hover:bg-slate-50"
                                } ${idx > 0 ? "border-t border-slate-100" : ""}`}
                              >
                                {profile.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="pt-1 text-sm font-semibold text-slate-700">Select Agent:</p>
                      <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        {activeDropdownClients.map((client) => (
                          <option key={client.id} value={client.value}>
                            {client.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedAgentId}
                        onChange={(e) => {
                          const nextAgentId = e.target.value;
                          const agents = agentsByClient[selectedClient] ?? [];
                          const matchedAgent = agents.find((agent) => agent.id === nextAgentId);
                          setSelectedAgentId(nextAgentId);
                          setSelectedAgent(matchedAgent?.name ?? "");
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        {(agentsByClient[selectedClient] ?? []).map((agent) => (
                          <option key={agent.id} value={agent.value}>
                            {agent.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                          isInactiveClient
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-slate-700 text-white hover:bg-slate-800"
                        }`}
                        onClick={() => setIsScheduleModalOpen(true)}
                        disabled={isInactiveClient}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Schedule Scan
                      </button>
                      <button
                        type="button"
                        onClick={handleRunScan}
                        disabled={isInactiveClient || !selectedAgentId || isRunningScans}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                          isInactiveClient || !selectedAgentId || isRunningScans
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 hover:shadow-[0_6px_16px_-8px_rgba(139,92,246,0.65)]"
                        }`}
                      >
                        <svg className={`h-4 w-4 ${isRunningScans ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isRunningScans ? "Scan Running..." : "Run Scan Now"}
                      </button>
                    </div>
                    {isRunningScans && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-indigo-600">
                        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                        <span>Scan in progress</span>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Live Command Preview */}
                  <div className="flex flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-700/80 bg-slate-800/80 px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="h-3 w-3 rounded-full bg-yellow-400" />
                        <span className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        {activeTerminalJobId && (
                          <span className="max-w-[10rem] truncate rounded bg-slate-700/70 px-2 py-0.5 text-[9px] font-semibold text-slate-300">
                            {activeTerminalJobId}
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">LIVE TERMINAL OUTPUT</span>
                      </div>
                    </div>
                    <div className="flex-1 p-4 font-mono text-xs">
                      <div className="space-y-1">
                        {(terminalLines.length > 0
                          ? terminalLines.map((text) => ({ color: getTerminalLineColor(text), text }))
                          : getCommandPreviewLines()
                        ).map((line, i) => (
                          <div key={`${i}-${line.text}`} className="flex gap-3">
                            <span className="w-5 flex-shrink-0 text-right text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                            <span className={`${line.color} whitespace-pre`}>{line.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
                <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  Once the scan completes, the latest findings will be automatically published in the Network Scan table below.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === "dashboard"
                  ? "text-indigo-600 border-indigo-600"
                  : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("agent-management")}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === "agent-management"
                  ? "text-indigo-600 border-indigo-600"
                  : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Agent Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === "dashboard" && (
            <DashboardTab
              selectedClient={selectedClient}
              selectedAgent={selectedAgent}
              selectedClientId={selectedClientId}
              selectedAgentId={selectedAgentId}
              scheduleRefreshKey={scheduleRefreshKey}
              dashboardRefreshKey={dashboardRefreshKey}
              showSidebar={false}
            />
          )}
          {activeTab === "agent-management" && (
            <AgentManagementTab selectedClient={selectedClient} selectedAgent={selectedAgent} />
          )}
        </div>
      </div>
      <SecurityConsoleScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleScan}
        contextLabel={`${selectedClient || "Client"} - ${selectedAgent || "Agent"}`}
      />
    </div>
  );
}

export default function SecurityConsolePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SecurityConsoleContent />
    </Suspense>
  );
}
