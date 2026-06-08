"use client";

import { useEffect, useMemo, useState } from "react";
import { SentinelStatsService } from "@/services/sentinel-stats.service";
import { AgentUploadService, type AgentUploadTargetOs } from "@/services/agent-upload.service";
import { ClientAgentService, type AgentRow, type AgentStatusRow } from "@/services/client-agent.service";

interface AgentManagementTabProps {
  selectedClient: string;
  selectedAgent: string;
}

interface SentinelStats {
  activeAgents: number;
  pendingScans: number;
  criticalVulnerabilitiesLastScan: number;
}

interface GlobalScanQueueItem {
  id: string;
  scanId: string;
  target: string;
  type: string;
  initiatedBy: string;
  action: string;
}

type AgentOs = "Windows" | "Linux" | "macOS";

interface AgentVersionInfo {
  os: AgentOs;
  versionLabel: string;
  downloadLabel: string;
}

const mockGlobalScanQueue: GlobalScanQueueItem[] = [
  { id: "1", scanId: "Vuln 005", target: "Amazon", type: "App", initiatedBy: "Target", action: "Running 0001" },
  { id: "2", scanId: "Vuln 005", target: "Amazon", type: "App", initiatedBy: "Target", action: "Running 0001" },
  { id: "3", scanId: "Vuln 005", target: "Amazon", type: "App", initiatedBy: "Target", action: "Running 0001" },
  { id: "4", scanId: "Vuln 005", target: "Amazon", type: "App", initiatedBy: "Target", action: "Running 0001" },
  { id: "5", scanId: "Vuln 012", target: "Contoso", type: "API", initiatedBy: "Scheduler", action: "Running 0042" },
  { id: "6", scanId: "Vuln 014", target: "Northwind", type: "Web", initiatedBy: "Target", action: "Queued" },
  { id: "7", scanId: "Vuln 019", target: "Fabrikam", type: "App", initiatedBy: "Operator", action: "Running 0021" },
  { id: "8", scanId: "Vuln 021", target: "Tailspin", type: "API", initiatedBy: "Scheduler", action: "Queued" },
];

interface LicenseFormState {
  licenseKey: string;
  tier: string;
  deviceLimit: string;
  isActive: boolean;
  expiresAt: string;
}

const LICENSE_TIER_OPTIONS = ["TRIAL", "SMALL", "STANDARD", "PROFESSIONAL", "ENTERPRISE", "UNLIMITED"] as const;

function formatLastSeen(value: string | null, ageSeconds?: number | null): string {
  if (typeof ageSeconds === "number") {
    if (ageSeconds < 60) return `${Math.max(0, Math.round(ageSeconds))} sec ago`;
    if (ageSeconds < 3600) return `${Math.max(1, Math.round(ageSeconds / 60))} min ago`;
    return `${Math.max(1, Math.round(ageSeconds / 3600))} hr ago`;
  }
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

function formatDateTimeLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

const mockLatestAgentVersions: AgentVersionInfo[] = [
  {
    os: "Windows",
    versionLabel: "v1.0.1 - 86ecd.05 - 5taden228 - Legacy",
    downloadLabel: "Download sentinel agent Windows",
  },
  {
    os: "Linux",
    versionLabel: "v1.0.3 - 9b2df.11 - 3a0bb219 - Stable",
    downloadLabel: "Download sentinel agent Linux",
  },
  {
    os: "macOS",
    versionLabel: "v1.0.2 - 2fa1c.07 - 7c13aa84 - Stable",
    downloadLabel: "Download sentinel agent macOS",
  },
];

export function AgentManagementTab({ selectedClient, selectedAgent }: Readonly<AgentManagementTabProps>) {
  const [stats, setStats] = useState<SentinelStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState("—");
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [agentRows, setAgentRows] = useState<AgentRow[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatusRow>>({});
  const [liveAgentsLoading, setLiveAgentsLoading] = useState(false);
  const [liveAgentsError, setLiveAgentsError] = useState<string | null>(null);
  const [licenseForm, setLicenseForm] = useState<LicenseFormState>({
    licenseKey: "",
    tier: "STANDARD",
    deviceLimit: "50",
    isActive: true,
    expiresAt: "",
  });
  const [licenseSaving, setLicenseSaving] = useState(false);
  const [licenseFeedback, setLicenseFeedback] = useState<string | null>(null);
  const [selectedOs, setSelectedOs] = useState<AgentOs>("Windows");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<AgentOs, File | null>>({
    Windows: null,
    Linux: null,
    macOS: null,
  });
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [globalPage, setGlobalPage] = useState(1);
  const [sentinelSearchQuery, setSentinelSearchQuery] = useState("");
  const [sentinelPage, setSentinelPage] = useState(1);
  const selectedVersion = useMemo(
    () => mockLatestAgentVersions.find((item) => item.os === selectedOs),
    [selectedOs]
  );
  const selectedManagedAgent = useMemo(() => {
    return agentRows.find((agent) => {
      const matchesClient = !selectedClient || agent.clientName === selectedClient;
      const matchesAgent = !selectedAgent || agent.agentName === selectedAgent;
      return matchesClient && matchesAgent;
    }) ?? null;
  }, [agentRows, selectedAgent, selectedClient]);

  const filteredManagedAgents = useMemo(() => {
    return agentRows.filter((agent) => {
      if (selectedClient && agent.clientName !== selectedClient) return false;
      if (selectedAgent && agent.agentName !== selectedAgent) return false;
      return true;
    });
  }, [agentRows, selectedAgent, selectedClient]);

  const liveSentinelNodes = useMemo(() => {
    return filteredManagedAgents.map((agent) => {
      const statusRow = agentStatuses[agent.id];
      const isConnected = (statusRow?.status ?? (agent.isOnline ? "alive" : "stale")) === "alive";
      return {
        id: agent.id,
        clientName: agent.clientName ?? "Unassigned",
        agentName: agent.agentName,
        agentUuid: statusRow?.agent_uuid ?? agent.agentUuid ?? "Pending binding",
        lastSeen: formatLastSeen(statusRow?.last_seen ?? agent.lastHeartbeat, statusRow?.age_s),
        status: isConnected ? "Connected" : "Disconnected",
        licenseTier: statusRow?.license_tier ?? agent.licenseTier ?? "—",
      };
    });
  }, [agentRows, agentStatuses, filteredManagedAgents]);

  const globalPageSize = 5;
  const sentinelPageSize = 5;
  const filteredGlobalQueue = mockGlobalScanQueue.filter((item) => {
    const haystack = `${item.scanId} ${item.target} ${item.type} ${item.initiatedBy} ${item.action}`.toLowerCase();
    return haystack.includes(globalSearchQuery.toLowerCase());
  });
  const globalTotalPages = Math.max(1, Math.ceil(filteredGlobalQueue.length / globalPageSize));
  const globalStartIndex = (globalPage - 1) * globalPageSize;
  const visibleGlobalQueue = filteredGlobalQueue.slice(globalStartIndex, globalStartIndex + globalPageSize);
  const missingGlobalRows = Math.max(0, globalPageSize - visibleGlobalQueue.length);
  const globalEmptyRowKeys = useMemo(
    () => Array.from({ length: missingGlobalRows }, (_, index) => `global-empty-${index + 1}`),
    [missingGlobalRows]
  );
  const filteredSentinelNodes = liveSentinelNodes.filter((item) => {
    const haystack = `${item.clientName} ${item.agentName} ${item.agentUuid} ${item.lastSeen} ${item.status} ${item.licenseTier}`.toLowerCase();
    return haystack.includes(sentinelSearchQuery.toLowerCase());
  });
  const sentinelTotalPages = Math.max(1, Math.ceil(filteredSentinelNodes.length / sentinelPageSize));
  const sentinelStartIndex = (sentinelPage - 1) * sentinelPageSize;
  const visibleSentinelNodes = filteredSentinelNodes.slice(sentinelStartIndex, sentinelStartIndex + sentinelPageSize);
  const missingSentinelRows = Math.max(0, sentinelPageSize - visibleSentinelNodes.length);
  const sentinelEmptyRowKeys = useMemo(
    () => Array.from({ length: missingSentinelRows }, (_, index) => `sentinel-empty-${index + 1}`),
    [missingSentinelRows]
  );

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const response = await SentinelStatsService.getStats({
          client: selectedClient,
          agent: selectedAgent,
        });
        setStats(response.data);
        setLastUpdated(response.data.last_updated || "—");
      } catch (error) {
        console.error("Failed to load sentinel stats", error);
        setStatsError("Unable to load stats.");
        setStats(null);
        setLastUpdated("—");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [selectedClient, selectedAgent]);

  const loadLiveAgentData = async () => {
    setLiveAgentsLoading(true);
    setLiveAgentsError(null);
    try {
      const [agentsResponse, statusesResponse] = await Promise.all([
        ClientAgentService.getAgents(),
        ClientAgentService.getAgentStatuses(),
      ]);
      setAgentRows(agentsResponse.data);
      setAgentStatuses(
        Object.fromEntries(
          statusesResponse.data.agents.map((row) => [row.agent_id, row])
        )
      );
    } catch (error) {
      console.error("Failed to load agent management data", error);
      setLiveAgentsError("Unable to load live agent data.");
      setAgentRows([]);
      setAgentStatuses({});
    } finally {
      setLiveAgentsLoading(false);
    }
  };

  useEffect(() => {
    void loadLiveAgentData();
  }, []);

  useEffect(() => {
    if (!selectedManagedAgent) {
      setLicenseForm({
        licenseKey: "",
        tier: "STANDARD",
        deviceLimit: "50",
        isActive: true,
        expiresAt: "",
      });
      return;
    }

    setLicenseForm({
      licenseKey: selectedManagedAgent.licenseKey ?? "",
      tier: selectedManagedAgent.licenseTier ?? "STANDARD",
      deviceLimit: String(selectedManagedAgent.deviceLimit ?? 50),
      isActive: selectedManagedAgent.licenseActive ?? true,
      expiresAt: formatDateTimeLocalInput(selectedManagedAgent.licenseExpiresAt),
    });
  }, [selectedManagedAgent]);

  const getAcceptedFileTypes = (os: AgentOs): string => {
    if (os === "Windows") return ".exe";
    if (os === "Linux") return ".tar.gz,.deb,.rpm";
    return ".pkg,.dmg";
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [selectedOs]: file,
      }));
      setUploadError(null);
    }
  };

  const handleUploadAgent = async () => {
    const file = uploadedFiles[selectedOs];
    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    try {
      const osMap: Record<AgentOs, AgentUploadTargetOs> = {
        Windows: "windows",
        Linux: "linux",
        macOS: "macos",
      };

      await AgentUploadService.uploadAgentFile({
        file,
        os: osMap[selectedOs],
      });

      // Success - could show a success message here
      setUploadedFiles((prev) => ({
        ...prev,
        [selectedOs]: null,
      }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveLicense = async () => {
    if (!selectedManagedAgent) {
      setLicenseFeedback("Select an agent before saving a license.");
      return;
    }

    if (!licenseForm.licenseKey.trim()) {
      setLicenseFeedback("License key is required.");
      return;
    }

    if (!licenseForm.deviceLimit.trim() || Number(licenseForm.deviceLimit) <= 0) {
      setLicenseFeedback("Device limit must be greater than zero.");
      return;
    }

    setLicenseSaving(true);
    setLicenseFeedback(null);
    try {
      const response = await ClientAgentService.saveAgentLicense({
        agent_id: selectedManagedAgent.id,
        license_key: licenseForm.licenseKey.trim().toUpperCase(),
        tier: licenseForm.tier,
        device_limit: Number(licenseForm.deviceLimit),
        is_active: licenseForm.isActive,
        expires_at: licenseForm.expiresAt ? new Date(licenseForm.expiresAt).toISOString() : null,
      });
      setLicenseFeedback(response.data.message);
      await loadLiveAgentData();
    } catch (error) {
      console.error("Failed to save agent license", error);
      setLicenseFeedback(error instanceof Error ? error.message : "Unable to save agent license.");
    } finally {
      setLicenseSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sentinel Command Center */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">Sentinel Command Center</h2>
          <div className="text-xs text-gray-500">Last updated: {lastUpdated}</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600">Active Agents</div>
                <div className="text-2xl font-bold text-gray-900">{stats?.activeAgents ?? '—'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600">Pending Scans</div>
                <div className="text-2xl font-bold text-gray-900">{stats?.pendingScans ?? '—'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600">Critical Vulnerabilities (Last Scan)</div>
                <div className="text-2xl font-bold text-gray-900">{stats?.criticalVulnerabilitiesLastScan ?? '—'}</div>
              </div>
            </div>
          </div>

        </div>
        {statsLoading && (
          <div className="text-xs text-gray-500 mb-2">Loading stats...</div>
        )}
        {!statsLoading && statsError && (
          <div className="text-xs text-red-600 mb-2">{statsError}</div>
        )}
      </div>

      {/* Agent Deployment & Active Sentinel Nodes side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-900">Agent Deployment & Control</h3>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-700 font-medium mb-3">
                {selectedVersion ? `${selectedVersion.os} - ${selectedVersion.versionLabel}` : "Select an OS"}
              </div>
              
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 border ${
                    selectedOs === "Windows" 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setSelectedOs("Windows")}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                  </svg>
                  Windows
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 border ${
                    selectedOs === "Linux" 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setSelectedOs("Linux")}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.41 1.55-.897 2.246-1.095 1.588-.898 3.527.29 4.676.653.631 1.45.989 2.24.989.789 0 1.44-.357 2.177-.357.736 0 1.375.347 2.112.347.737 0 1.39-.357 2.126-.357.737 0 1.388.357 2.125.357.914 0 1.77-.474 2.42-1.164 1.044-1.106.936-3.018-.103-4.103-.906-.947-2.146-1.565-3.415-1.565-.82 0-1.615.267-2.38.78-.765-.513-1.56-.78-2.38-.78-1.268 0-2.508.618-3.414 1.565-1.04 1.085-1.147 2.997-.104 4.103.651.69 1.507 1.164 2.421 1.164z"/>
                  </svg>
                  Linux
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 border ${
                    selectedOs === "macOS" 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setSelectedOs("macOS")}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  macOS
                </button>
              </div>
            </div>
            
            <div className="mb-2">
              <label
                htmlFor={`file-upload-${selectedOs}`}
                className="w-full px-6 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {uploadedFiles[selectedOs] ? uploadedFiles[selectedOs].name : `Select ${selectedOs} agent file`}
              </label>
              <input
                id={`file-upload-${selectedOs}`}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept={getAcceptedFileTypes(selectedOs)}
              />
            </div>
            <button
              type="button"
              onClick={handleUploadAgent}
              disabled={!uploadedFiles[selectedOs] || isUploading}
              className="w-full px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm mb-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-700"
            >
              {isUploading ? "Uploading..." : `Upload ${selectedOs} agent`}
            </button>
            {uploadError && (
              <div className="text-xs text-red-600 mb-3" role="alert">
                {uploadError}
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-slate-50 p-4 mb-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Selected Agent License</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedManagedAgent
                      ? `${selectedManagedAgent.agentName} · ${selectedManagedAgent.clientName ?? "Unassigned client"}`
                      : "Select a client and agent from the dashboard filters to manage licensing."}
                  </p>
                </div>
                {selectedManagedAgent && (
                  <div className="text-right text-xs text-gray-500">
                    <div>UUID: {selectedManagedAgent.agentUuid ?? "Pending binding"}</div>
                    <div>Heartbeat: {selectedManagedAgent.lastHeartbeat ? new Date(selectedManagedAgent.lastHeartbeat).toLocaleString() : "Never"}</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <label className="text-xs text-gray-600">
                  <span>License Key</span>
                  <input
                    type="text"
                    value={licenseForm.licenseKey}
                    onChange={(e) => setLicenseForm((prev) => ({ ...prev, licenseKey: e.target.value.toUpperCase() }))}
                    disabled={!selectedManagedAgent || licenseSaving}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100"
                    placeholder="Enter assigned license key"
                  />
                </label>

                <label className="text-xs text-gray-600">
                  <span>Tier</span>
                  <select
                    value={licenseForm.tier}
                    onChange={(e) => setLicenseForm((prev) => ({ ...prev, tier: e.target.value }))}
                    disabled={!selectedManagedAgent || licenseSaving}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100"
                  >
                    {LICENSE_TIER_OPTIONS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs text-gray-600">
                  <span>Device Limit</span>
                  <input
                    type="number"
                    min="1"
                    value={licenseForm.deviceLimit}
                    onChange={(e) => setLicenseForm((prev) => ({ ...prev, deviceLimit: e.target.value }))}
                    disabled={!selectedManagedAgent || licenseSaving}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100"
                  />
                </label>

                <label className="text-xs text-gray-600">
                  <span>Expires At</span>
                  <input
                    type="datetime-local"
                    value={licenseForm.expiresAt}
                    onChange={(e) => setLicenseForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                    disabled={!selectedManagedAgent || licenseSaving}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={licenseForm.isActive}
                    onChange={(e) => setLicenseForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    disabled={!selectedManagedAgent || licenseSaving}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>License active</span>
                </label>

                <button
                  type="button"
                  onClick={handleSaveLicense}
                  disabled={!selectedManagedAgent || licenseSaving}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {licenseSaving ? "Saving..." : "Save License"}
                </button>
              </div>

              {licenseFeedback && (
                <div className="mt-3 text-xs text-indigo-700">{licenseFeedback}</div>
              )}
            </div>

            {/* System Requirements & Quick Installation - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              {/* System Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  System Requirements
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {selectedOs === "Windows" && (
                    <>
                      <li>• Windows 10/11 or Windows Server 2016+</li>
                      <li>• 2GB RAM minimum (4GB recommended)</li>
                      <li>• 500MB disk space</li>
                      <li>• .NET Framework 4.7.2 or higher</li>
                    </>
                  )}
                  {selectedOs === "Linux" && (
                    <>
                      <li>• Ubuntu 18.04+, CentOS 7+, or RHEL 7+</li>
                      <li>• 1GB RAM minimum (2GB recommended)</li>
                      <li>• 300MB disk space</li>
                      <li>• Python 3.6 or higher</li>
                    </>
                  )}
                  {selectedOs === "macOS" && (
                    <>
                      <li>• macOS 10.15 (Catalina) or later</li>
                      <li>• 2GB RAM minimum (4GB recommended)</li>
                      <li>• 400MB disk space</li>
                      <li>• Apple Silicon or Intel processor</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Quick Installation Steps */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Upload Instructions
                </h4>
                <ol className="text-xs text-gray-600 space-y-1">
                  {selectedOs === "Windows" && (
                    <>
                      <li>1. Select Windows executable (.exe) file</li>
                      <li>2. Click "Upload Windows agent" button</li>
                      <li>3. Wait for upload confirmation</li>
                      <li>4. Agent will be available for deployment</li>
                    </>
                  )}
                  {selectedOs === "Linux" && (
                    <>
                      <li>1. Select Linux package (.tar.gz, .deb, .rpm)</li>
                      <li>2. Click "Upload Linux agent" button</li>
                      <li>3. Wait for upload confirmation</li>
                      <li>4. Agent will be available for deployment</li>
                    </>
                  )}
                  {selectedOs === "macOS" && (
                    <>
                      <li>1. Select macOS installer (.pkg or .dmg)</li>
                      <li>2. Click "Upload macOS agent" button</li>
                      <li>3. Wait for upload confirmation</li>
                      <li>4. Agent will be available for deployment</li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">Active Sentinel Nodes</h3>
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search"
                value={sentinelSearchQuery}
                onChange={(e) => {
                  setSentinelSearchQuery(e.target.value);
                  setSentinelPage(1);
                }}
                className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {liveAgentsLoading && <div className="px-6 py-3 text-xs text-gray-500">Loading live agent status...</div>}
          {!liveAgentsLoading && liveAgentsError && <div className="px-6 py-3 text-xs text-red-600">{liveAgentsError}</div>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Client</th>
                  <th className="px-4 py-3 text-left font-semibold">Agent UUID</th>
                  <th className="px-4 py-3 text-left font-semibold">Last Seen</th>
                  <th className="px-4 py-3 text-left font-semibold">License Tier</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {visibleSentinelNodes.map((item, index) => (
                  <tr key={item.id} className={`${index !== visibleSentinelNodes.length - 1 && index !== sentinelPageSize - 1 ? 'border-b border-gray-200' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.clientName}</div>
                      <div className="text-xs text-gray-500">{item.agentName}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{item.agentUuid}</td>
                    <td className="px-4 py-3">{item.lastSeen}</td>
                    <td className="px-4 py-3">{item.licenseTier}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Connected' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {sentinelEmptyRowKeys.map((rowKey, rowIndex) => {
                  const hasDivider = rowIndex < sentinelEmptyRowKeys.length - 1;
                  return (
                    <tr key={rowKey} className={hasDivider ? "border-b border-gray-200" : ""}>
                      <td className="px-4 py-3" colSpan={5}>&nbsp;</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredSentinelNodes.length === 0 ? 0 : sentinelStartIndex + 1}-
                {Math.min(sentinelStartIndex + sentinelPageSize, filteredSentinelNodes.length)} of {filteredSentinelNodes.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setSentinelPage((page) => Math.max(1, page - 1))}
                  disabled={sentinelPage === 1}
                >
                  Prev
                </button>
                <span className="text-gray-700">Page {sentinelPage} of {sentinelTotalPages}</span>
                <button
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setSentinelPage((page) => Math.min(sentinelTotalPages, page + 1))}
                  disabled={sentinelPage === sentinelTotalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Scan Queue - Full Width */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">Global Scan Queue</h3>
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search"
              value={globalSearchQuery}
              onChange={(e) => {
                setGlobalSearchQuery(e.target.value);
                setGlobalPage(1);
              }}
              className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left font-semibold">Scan ID</th>
                <th className="px-4 py-3 text-left font-semibold">Target</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Initiated By</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {visibleGlobalQueue.map((item, index) => (
                <tr key={item.id} className={`${index !== visibleGlobalQueue.length - 1 && index !== globalPageSize - 1 ? 'border-b border-gray-200' : ''}`}>
                  <td className="px-4 py-3">{item.scanId}</td>
                  <td className="px-4 py-3">{item.target}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.initiatedBy}</td>
                  <td className="px-4 py-3">{item.action}</td>
                </tr>
              ))}
              {globalEmptyRowKeys.map((rowKey, rowIndex) => {
                const hasDivider = rowIndex < globalEmptyRowKeys.length - 1;
                return (
                  <tr key={rowKey} className={hasDivider ? "border-b border-gray-200" : ""}>
                    <td className="px-4 py-3" colSpan={5}>&nbsp;</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredGlobalQueue.length === 0 ? 0 : globalStartIndex + 1}-
              {Math.min(globalStartIndex + globalPageSize, filteredGlobalQueue.length)} of {filteredGlobalQueue.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setGlobalPage((page) => Math.max(1, page - 1))}
                disabled={globalPage === 1}
              >
                Prev
              </button>
              <span className="text-gray-700">Page {globalPage} of {globalTotalPages}</span>
              <button
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setGlobalPage((page) => Math.min(globalTotalPages, page + 1))}
                disabled={globalPage === globalTotalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
