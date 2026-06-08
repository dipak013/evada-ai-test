"use client";
import { useEffect, useRef, useState } from "react";
import { ScheduleService, ScheduleResponse } from "@/services/schedule.service";
import { RemediationNote, RemediationService } from "@/services/remediation.service";
import { PastScanStatsService } from "../../../services/past-scan-stats.service";
import { DashboardAlertsService } from "@/services/dashboard-alerts.service";
import { ScanHistoryRow, ScanHistoryService } from "@/services/scan-history.service";

interface DashboardTabProps {
  selectedClient: string;
  selectedAgent: string;
  selectedClientId?: string;
  selectedAgentId?: string;
  scheduleRefreshKey?: number;
  dashboardRefreshKey?: number;
  showSidebar?: boolean;
}

interface ClientAgent {
  id: string;
  name: string;
  agent: string;
  status: "Active" | "Inactive";
}

interface DashboardAlert {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  cves: Array<{ id: string; severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"; description: string }>;
}

interface ReportData {
  id: string;
  scanDate: string;
  scanTime: string;
  status: "Connected" | "Disconnected";
}

type SeverityKey = "low" | "medium" | "high" | "critical";
type SeverityCount = Record<SeverityKey, number>;

interface PastScanStatsData {
  title: string;
  subtitle: string;
  totalScans: string;
  criticalFinds: string;
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisLabelMonth: string;
  yAxisLabelFindings: string;
  severities: { key: SeverityKey; label: string; color: string }[];
  monthlyCounts: SeverityCount[];
  monthLabels?: string[];
}

// Configuration and structure (data comes from API calls)
const mockDashboardData = {
  clientAdminView: {
    title: "Client View",
    networkScanTable: {
      title: "Network Scan",
    },
    scanHistory: {
      title: "Scan History",
    },
    pastScanStats: {
      title: "Past Scan Stats",
      subtitle: "",
      totalScans: "Total 0 scans",
      criticalFinds: "critical finds 0",
      xAxisLabel: "Severity",
      yAxisLabel: "Count",
      xAxisLabelMonth: "Month",
      yAxisLabelFindings: "Findings",
      severities: [
        { key: "low", label: "Low", color: "#22c55e" },
        { key: "medium", label: "Medium", color: "#facc15" },
        { key: "high", label: "High", color: "#f59e0b" },
        { key: "critical", label: "Critical", color: "#dc2626" },
      ] as { key: SeverityKey; label: string; color: string }[],
      monthlyCounts: [] as SeverityCount[],
    } as PastScanStatsData,
  },
  dashboardAlerts: {
    title: "Dashboard Alerts",
    alerts: [] as DashboardAlert[],
  },
  remedialMeasures: {
    title: "Remedial Measures(FYI)",
  },
};

export function DashboardTab({
  selectedClient,
  selectedAgent,
  selectedClientId: selectedClientIdProp,
  selectedAgentId: selectedAgentIdProp,
  scheduleRefreshKey,
  dashboardRefreshKey,
  showSidebar = false,
}: Readonly<DashboardTabProps>) {
  const defaultPastStats = mockDashboardData.clientAdminView.pastScanStats;
  const [searchQuery, setSearchQuery] = useState("");
  const [isRemedialModalOpen, setIsRemedialModalOpen] = useState(false);
  const [isAlertDetailsOpen, setIsAlertDetailsOpen] = useState(false);
  const [isScanHistoryOpen, setIsScanHistoryOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("1");
  const [scheduledScans, setScheduledScans] = useState<string[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [scanHistorySearch, setScanHistorySearch] = useState("");
  const [scanHistoryFrom, setScanHistoryFrom] = useState("");
  const [scanHistoryTo, setScanHistoryTo] = useState("");
  const [scanHistoryFromInput, setScanHistoryFromInput] = useState("");
  const [scanHistoryToInput, setScanHistoryToInput] = useState("");
  const [scanHistoryPage, setScanHistoryPage] = useState(1);
  const [scanHistoryRefreshKey, setScanHistoryRefreshKey] = useState(0);
  const [scanHistoryRows, setScanHistoryRows] = useState<ScanHistoryRow[]>([]);
  const [scanHistoryTotal, setScanHistoryTotal] = useState(0);
  const [scanHistoryLoading, setScanHistoryLoading] = useState(false);
  const [scanHistoryError, setScanHistoryError] = useState<string | null>(null);
  const [downloadingScanJsonId, setDownloadingScanJsonId] = useState<string | null>(null);
  const [dashboardAlerts, setDashboardAlerts] = useState<typeof mockDashboardData.dashboardAlerts>({ title: "Dashboard Alerts", alerts: [] });
  const [dashboardAlertsLoading, setDashboardAlertsLoading] = useState(false);
  const [dashboardAlertsError, setDashboardAlertsError] = useState<string | null>(null);
  const [pastScanStats, setPastScanStats] = useState<PastScanStatsData>(defaultPastStats);
  const [pastStatsLoading, setPastStatsLoading] = useState(false);
  const [pastStatsError, setPastStatsError] = useState<string | null>(null);
  const scanHistoryPageSize = 6;
  const [remedialNotes, setRemedialNotes] = useState<RemediationNote[]>([]);
  const [remedialLoading, setRemedialLoading] = useState(false);
  const [remedialMessage, setRemedialMessage] = useState<string | null>(null);
  const [remedialSeverityFilter, setRemedialSeverityFilter] = useState("all");
  const remedialPreviewCount = 1;
  const remedialFilteredNotes = remedialNotes.filter((note) =>
    remedialSeverityFilter === "all"
      ? true
      : (note.severity || "").toLowerCase() === remedialSeverityFilter
  );
  const remedialTotal = remedialFilteredNotes.length;
  const remedialSeverities = [
    { key: "all", label: "All" },
    { key: "critical", label: "Critical" },
    { key: "high", label: "High" },
    { key: "medium", label: "Medium" },
    { key: "low", label: "Low" },
  ];
  const chartSvgRef = useRef<SVGSVGElement | null>(null);

  const pastStats = pastScanStats;
  const pastStatsView = { width: 760, height: 160 };
  const pastStatsPadding = { left: 40, right: 10, top: 10, bottom: 26 };
  const pastStatsInner = {
    width: pastStatsView.width - pastStatsPadding.left - pastStatsPadding.right,
    height: pastStatsView.height - pastStatsPadding.top - pastStatsPadding.bottom,
  };
  const fallbackMonthLabels = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - index);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  }).reverse();
  const pastStatsMonthLabels = (pastStats.monthLabels?.length
    ? pastStats.monthLabels
    : fallbackMonthLabels
  ).slice(-6);
  const monthlyCounts = pastStats.monthlyCounts.slice(-pastStatsMonthLabels.length);
  const pastStatsMax = Math.max(
    1,
    ...monthlyCounts.flatMap((counts) =>
      pastStats.severities.map((severity) => counts[severity.key] ?? 0)
    )
  );
  const pastStatsTicks = [...new Set([0, Math.ceil(pastStatsMax / 2), pastStatsMax])];
  const pastStatsGroupWidth =
    (pastStatsInner.width / Math.max(1, pastStatsMonthLabels.length)) * 0.8;
  const pastStatsBarGap = 2;
  const pastStatsBarWidth = Math.max(
    6,
    (pastStatsGroupWidth - pastStatsBarGap * (pastStats.severities.length - 1)) /
      Math.max(1, pastStats.severities.length)
  );
  const pastStatsX = (index: number) =>
    pastStatsPadding.left +
    (pastStatsInner.width * (index + 0.5)) / Math.max(1, pastStatsMonthLabels.length);
  const pastStatsY = (value: number) =>
    pastStatsPadding.top + pastStatsInner.height - (pastStatsInner.height * value) / pastStatsMax;

  const handleDownloadChartPng = () => {
    if (!chartSvgRef.current) return;
    const svg = chartSvgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const viewBox = svg.viewBox.baseVal;
      canvas.width = viewBox?.width || svg.clientWidth;
      canvas.height = viewBox?.height || svg.clientHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "past-scan-stats.png";
      link.click();
    };

    img.src = url;
  };

  const handleDownloadChartCsv = () => {
    const header = ["Month", ...pastStats.severities.map((severity) => severity.label)];
    const rows = pastStatsMonthLabels.map((label, index) => {
      const counts = monthlyCounts[index] ?? ({} as SeverityCount);
      return [
        label,
        ...pastStats.severities.map((severity) => String(counts[severity.key] ?? 0)),
      ];
    });
    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll("\"", "\"\"")}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "past-scan-stats.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredClients: ClientAgent[] = [];
  const resolvedClientId = selectedClientIdProp ?? selectedClientId;
  const resolvedAgentId = selectedAgentIdProp ?? "";

  const selectedClientLabel = selectedClient || "Unknown Client";
  const selectedClientName = selectedClientLabel.replace(/^Client:\s*/i, "");

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    if (Number.isNaN(hour)) return time;
    const period = hour >= 12 ? "PM" : "AM";
    const normalizedHour = ((hour + 11) % 12) + 1;
    return `${normalizedHour}:${minuteStr ?? "00"}${period}`;
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (isDateOnly) {
      const [year, month, day] = date.split("-").map(Number);
      const utcDate = new Date(Date.UTC(year, month - 1, day));
      return utcDate.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    }
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  };

  const weekdayLabel = (weekday?: string) => {
    if (!weekday) return "";
    const map: Record<string, string> = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };
    return map[weekday.toLowerCase()] ?? weekday;
  };

  const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  };

  const addMonths = (date: Date, months: number) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  };

  const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

  const frequencyToStep = (frequency?: string) => {
    switch (frequency) {
      case "daily":
        return { unit: "day", value: 1 } as const;
      case "bi-weekly":
        return { unit: "day", value: 14 } as const;
      case "monthly":
        return { unit: "month", value: 1 } as const;
      case "quarterly":
        return { unit: "month", value: 3 } as const;
      case "half-yearly":
        return { unit: "month", value: 6 } as const;
      case "annually":
        return { unit: "month", value: 12 } as const;
      default:
        return { unit: "month", value: 1 } as const;
    }
  };

  const formatScheduleLabel = (schedule: ScheduleResponse, runDate: Date) => {
    if (schedule.schedule_type === "weekday") {
      return `Weekly Full Scan - ${weekdayLabel(schedule.weekday)} ${formatTime(schedule.scheduled_time)}`;
    }
    if (schedule.schedule_type === "recurring") {
      const frequencyLabel = schedule.frequency
        ? schedule.frequency
            .replaceAll("-", " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "Recurring";
      return `${frequencyLabel} Full Scan - ${formatDate(runDate.toISOString())} ${formatTime(schedule.scheduled_time)}`;
    }
    if (schedule.schedule_type === "once") {
      return `One-Time Scan - ${formatDate(schedule.scheduled_date ?? "")} ${formatTime(schedule.scheduled_time)}`;
    }
    return `Scheduled Scan - ${formatTime(schedule.scheduled_time)}`;
  };

  const getBaseScheduleDate = (schedule: ScheduleResponse) => {
    if (schedule.next_run_at) return new Date(schedule.next_run_at);
    if (schedule.start_date) return new Date(schedule.start_date);
    if (schedule.scheduled_date) return new Date(schedule.scheduled_date);
    return null;
  };

  const buildSeriesLabels = (schedule: ScheduleResponse, baseDate: Date, step: { unit: "day" | "month"; value: number }) => {
    const labels: string[] = [];
    let cursor = new Date(baseDate);
    for (let i = 0; i < 5; i += 1) {
      labels.push(formatScheduleLabel(schedule, cursor));
      cursor = step.unit === "day" ? addDays(cursor, step.value) : addMonths(cursor, step.value);
    }
    return labels;
  };

  const getUpcomingScheduleLabels = (schedule: ScheduleResponse) => {
    const baseDate = getBaseScheduleDate(schedule);
    if (!baseDate || Number.isNaN(baseDate.getTime())) {
      const fallback = formatScheduleLabel(schedule, new Date());
      return fallback ? [fallback] : [];
    }

    switch (schedule.schedule_type) {
      case "once":
        return [formatScheduleLabel(schedule, baseDate)];
      case "weekday":
        return buildSeriesLabels(schedule, baseDate, { unit: "day", value: 7 });
      case "recurring":
        return buildSeriesLabels(schedule, baseDate, frequencyToStep(schedule.frequency));
      default:
        return [formatScheduleLabel(schedule, baseDate)];
    }
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!resolvedClientId || !resolvedAgentId) {
        setScheduledScans([]);
        return;
      }
      setIsScheduleLoading(true);
      setScheduleError(null);
      try {
        const response = await ScheduleService.getSchedulesByClientAgentAndType(
          resolvedClientId,
          resolvedAgentId,
          "network_scan"
        );
        const labels = response.data.flatMap(getUpcomingScheduleLabels).filter(Boolean);
        setScheduledScans(labels);
      } catch (error) {
        console.error("Failed to load schedules", error);
        setScheduleError("Unable to load scheduled scans.");
        setScheduledScans([]);
      } finally {
        setIsScheduleLoading(false);
      }
    };

    fetchSchedules();
  }, [resolvedClientId, resolvedAgentId, scheduleRefreshKey]);

  useEffect(() => {
    const fetchDashboardAlerts = async () => {
      if (!resolvedClientId || !resolvedAgentId) {
        setDashboardAlerts({ title: "Dashboard Alerts", alerts: [] });
        setDashboardAlertsError("Select a client and agent to load alerts.");
        return;
      }
      setDashboardAlertsLoading(true);
      setDashboardAlertsError(null);
      try {
        const response = await DashboardAlertsService.getLastScanAlerts({
          clientId: resolvedClientId,
          agentId: resolvedAgentId,
        });
        setDashboardAlerts(response.data);
      } catch (error) {
        console.error("Failed to load dashboard alerts", error);
        setDashboardAlertsError("Unable to load dashboard alerts.");
        setDashboardAlerts({ title: "Dashboard Alerts", alerts: [] });
      } finally {
        setDashboardAlertsLoading(false);
      }
    };

    fetchDashboardAlerts();
  }, [resolvedClientId, resolvedAgentId]);

  useEffect(() => {
    const fetchPastScanStats = async () => {
      if (!resolvedClientId || !resolvedAgentId) {
        setPastScanStats(defaultPastStats);
        setPastStatsError("Select a client and agent to load stats.");
        return;
      }
      setPastStatsLoading(true);
      setPastStatsError(null);
      try {
        const response = await PastScanStatsService.getPastScanStats({
          clientId: resolvedClientId,
          agentId: resolvedAgentId,
          months: 6,
        });
        const data = response.data;
        const monthLabels = Array.isArray(data.months) ? data.months : [];
        const counts = Array.isArray(data.counts) ? data.counts : [];
        const totalScansText =
          typeof data.total_scans === "number"
            ? `Total ${data.total_scans} scans`
            : defaultPastStats.totalScans;
        const criticalFindsText =
          typeof data.critical_finds === "number"
            ? `critical finds ${data.critical_finds}`
            : defaultPastStats.criticalFinds;
        setPastScanStats({
          ...defaultPastStats,
          title: data.title ?? defaultPastStats.title,
          subtitle: data.subtitle ?? defaultPastStats.subtitle,
          totalScans: totalScansText,
          criticalFinds: criticalFindsText,
          monthLabels,
          monthlyCounts: counts,
        });
      } catch (error) {
        console.error("Failed to load past scan stats", error);
        setPastStatsError("Unable to load past scan stats.");
        setPastScanStats(defaultPastStats);
      } finally {
        setPastStatsLoading(false);
      }
    };

    fetchPastScanStats();
  }, [resolvedClientId, resolvedAgentId, defaultPastStats]);

  useEffect(() => {
    const fetchRemediationNotes = async () => {
      if (!resolvedClientId || !resolvedAgentId) {
        setRemedialNotes([]);
        setRemedialMessage("No Remediation Found");
        return;
      }
      setRemedialLoading(true);
      setRemedialMessage(null);
      try {
        const response = await RemediationService.getRemediationNotes({
          clientId: resolvedClientId,
          agentId: resolvedAgentId,
        });
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setRemedialNotes(data);
        setRemedialMessage(data.length === 0 ? "No Remediation Found" : null);
      } catch (error) {
        console.error("Failed to load remediation notes", error);
        setRemedialNotes([]);
        setRemedialMessage("No Remediation Found");
      } finally {
        setRemedialLoading(false);
      }
    };

    fetchRemediationNotes();
  }, [resolvedClientId, resolvedAgentId]);

  // Initialize default date range on component mount or when client/agent changes
  useEffect(() => {
    if (!resolvedClientId || !resolvedAgentId) return;
    
    if (!scanHistoryFrom && !scanHistoryTo) {
      const today = new Date();
      const sixMonthsAgo = addMonths(new Date(today), -6);
      const defaultFrom = formatDateInput(sixMonthsAgo);
      const defaultTo = formatDateInput(today);
      setScanHistoryFrom(defaultFrom);
      setScanHistoryTo(defaultTo);
      setScanHistoryFromInput(defaultFrom);
      setScanHistoryToInput(defaultTo);
    }
  }, [resolvedClientId, resolvedAgentId]);

  useEffect(() => {
    if (!isScanHistoryOpen) {
      return;
    }
    setScanHistoryPage(1);
  }, [isScanHistoryOpen, scanHistorySearch, scanHistoryFrom, scanHistoryTo]);

  // Keep dashboard preview fresh. Apply heavy filters/pagination only while modal is open.
  useEffect(() => {
    const fetchScanHistory = async () => {
      if (!resolvedClientId || !resolvedAgentId || !scanHistoryFrom || !scanHistoryTo) return;

      const effectiveFromDate = isScanHistoryOpen ? scanHistoryFrom : undefined;
      const effectiveToDate = isScanHistoryOpen ? scanHistoryTo : undefined;
      const effectiveSearch = isScanHistoryOpen ? scanHistorySearch : "";
      const effectivePage = isScanHistoryOpen ? scanHistoryPage : 1;

      setScanHistoryLoading(true);
      setScanHistoryError(null);
      try {
        const response = await ScanHistoryService.getScanHistory({
          clientId: resolvedClientId,
          agentId: resolvedAgentId,
          fromDate: effectiveFromDate,
          toDate: effectiveToDate,
          search: effectiveSearch,
          page: effectivePage,
          pageSize: scanHistoryPageSize,
        });
        setScanHistoryRows(response.data.results || []);
        setScanHistoryTotal(response.data.total ?? 0);
      } catch (error) {
        console.error("Failed to load scan history", error);
        setScanHistoryError("Unable to load scan history.");
        setScanHistoryRows([]);
        setScanHistoryTotal(0);
      } finally {
        setScanHistoryLoading(false);
      }
    };

    fetchScanHistory();
  }, [
    resolvedClientId,
    resolvedAgentId,
    isScanHistoryOpen,
    scanHistoryFrom,
    scanHistoryTo,
    scanHistorySearch,
    scanHistoryPage,
    scanHistoryRefreshKey,
    dashboardRefreshKey,
  ]);

  const scanHistoryMinDate = "2026-01-01";
  const scanHistoryMaxDate = formatDateInput(new Date());
  const scanHistoryTotalPages = Math.max(
    1,
    Math.ceil(scanHistoryTotal / scanHistoryPageSize)
  );
  const scanHistoryPageSafe = Math.min(scanHistoryPage, scanHistoryTotalPages);
  const scanHistoryStartIndex = (scanHistoryPageSafe - 1) * scanHistoryPageSize;

  const getDownloadFileName = (contentDisposition: string | undefined, fallbackScanId: string) => {
    if (!contentDisposition) {
      return `network_scan_${fallbackScanId}.json`;
    }

    const utf8Regex = /filename\*=UTF-8''([^;]+)/i;
    const utf8Match = utf8Regex.exec(contentDisposition);
    if (utf8Match?.[1]) {
      try {
        return decodeURIComponent(utf8Match[1]);
      } catch {
        return utf8Match[1];
      }
    }

    const basicRegex = /filename="?([^";]+)"?/i;
    const basicMatch = basicRegex.exec(contentDisposition);
    return basicMatch?.[1] || `network_scan_${fallbackScanId}.json`;
  };

  const handleDownloadScanJson = async (row: ScanHistoryRow) => {
    if (row.status !== "Completed") {
      return;
    }

    setDownloadingScanJsonId(row.id);
    try {
      const response = await ScanHistoryService.downloadScanJson(row.id);
      const blob = response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: "application/json" });
      const contentDisposition = response.headers?.["content-disposition"] as string | undefined;
      const fileName = getDownloadFileName(contentDisposition, row.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download scan JSON", error);
    } finally {
      setDownloadingScanJsonId(null);
    }
  };

  const handleDownloadScanRawJson = async (row: ScanHistoryRow) => {
    if (row.status !== "Completed") {
      return;
    }

    setDownloadingScanJsonId(row.id);
    try {
      const response = await ScanHistoryService.downloadScanRawJson(row.id);
      const blob = response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: "application/json" });
      const contentDisposition = response.headers?.["content-disposition"] as string | undefined;
      const fileName = getDownloadFileName(contentDisposition, row.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download raw graph JSON", error);
    } finally {
      setDownloadingScanJsonId(null);
    }
  };

  const handleRefreshScanHistory = () => {
    setScanHistoryRefreshKey((prev) => prev + 1);
  };

  const severityBadgeClass = (severity?: string | null) => {
    switch ((severity || "").toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const alertSeverityColor = (severity: DashboardAlert["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "MEDIUM":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const lastScanCves = dashboardAlerts.alerts.flatMap((alert) => alert.cves);
  const criticalHighCves = lastScanCves.filter(
    (cve) => cve.severity === "CRITICAL" || cve.severity === "HIGH"
  );
  const criticalHighCount = criticalHighCves.length;

  const scanHistoryStatusClass = (status: ScanHistoryRow["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Running":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const handleApplyScanHistoryFilters = () => {
    setScanHistoryFrom(scanHistoryFromInput);
    setScanHistoryTo(scanHistoryToInput);
    setScanHistoryPage(1);
  };

  // Handle modal open - ensure we have the latest data
  const handleOpenScanHistory = () => {
    setScanHistoryPage(1);
    setIsScanHistoryOpen(true);
  };

  // If showSidebar is true, render only the sidebar content for the left panel
  if (showSidebar) {
    return (
      <div className="bg-white rounded-lg p-3 h-full overflow-y-auto">
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search Client or Agent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="space-y-2">
          {/* Clients will be loaded from API */}
          {[].map((client: ClientAgent) => {
            const isSelected = selectedClientId === client.id;
            const isActive = client.status === "Active";
            let statusClass = "bg-gray-100 hover:bg-gray-200";
            if (isSelected) {
              statusClass = "bg-gray-200 border-l-4 border-indigo-600";
            } else if (isActive) {
              statusClass = "bg-green-50 hover:bg-green-100";
            }
            return (
            <button
              key={client.id}
              type="button"
              onClick={() => setSelectedClientId(client.id)}
              className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${statusClass}`}
            >
              <div className="flex items-start gap-2">
                <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${client.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}></span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{client.name}</div>
                  <div className="text-gray-600 truncate">{client.agent}</div>
                  <span className="text-sm text-gray-500">{client.status === "Active" ? "(Active)" : "(Inactive)"}</span>
                </div>
              </div>
            </button>
          );
          })}
        </div>
      </div>
    );
  }

  // Otherwise, render the main content
  return (
    <div className="space-y-6">
      {/* Client Admin View */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        {/* Purple Header */}
        <div className="bg-indigo-600 text-white px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{mockDashboardData.clientAdminView.title}</h2>
        </div>

        <div className="p-6">
        {/* Client Info Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Client: {selectedClientName}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="flex flex-col h-full gap-2">
              <div className="bg-gray-50 border border-gray-200 rounded p-4 flex-1">
                <div className="text-sm text-gray-600 mb-1">Scheduled Scan(s)</div>
                {isScheduleLoading && (
                  <div className="text-sm text-gray-500">Loading schedules...</div>
                )}
                {!isScheduleLoading && scheduleError && (
                  <div className="text-sm text-red-600">{scheduleError}</div>
                )}
                {!isScheduleLoading && !scheduleError && scheduledScans.length === 0 && (
                  <div className="text-sm text-gray-500">No scheduled scans</div>
                )}
                {!isScheduleLoading && !scheduleError && scheduledScans.map((scan) => (
                  <div key={scan} className="text-sm font-semibold text-gray-800">
                    {scan}
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-4 flex-1">
                <div className="text-sm text-gray-600 mb-1">Queued/Pending Scan</div>
                <div className="text-sm font-semibold text-gray-800">-</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-4 flex-1">
                <div className="text-sm text-gray-700 mb-1">Critical Findings</div>
                <div className="text-base font-semibold text-red-600">
                  {dashboardAlertsLoading
                    ? "Loading..."
                    : `Critical Findings: ${criticalHighCount}`}
                </div>
                <button
                  className="mt-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => setIsAlertDetailsOpen(true)}
                  disabled={dashboardAlertsLoading || Boolean(dashboardAlertsError)}
                >
                  View details
                </button>
                {!dashboardAlertsLoading && dashboardAlertsError && (
                  <div className="mt-2 text-xs text-red-600">{dashboardAlertsError}</div>
                )}
              </div>

            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-white px-4 py-3 flex items-center justify-between gap-4 border-b border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900">{mockDashboardData.clientAdminView.networkScanTable.title}</h4>
                  <button
                    type="button"
                    onClick={handleRefreshScanHistory}
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                    title="Refresh Network Scan"
                    aria-label="Refresh Network Scan"
                    disabled={scanHistoryLoading}
                  >
                    <svg
                      className={`h-4 w-4 ${scanHistoryLoading ? "animate-spin" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 2v6h-6" />
                      <path d="M3 12a9 9 0 0 1 15.55-6.36L21 8" />
                      <path d="M3 22v-6h6" />
                      <path d="M21 12a9 9 0 0 1-15.55 6.36L3 16" />
                    </svg>
                  </button>
                </div>
                {scanHistoryLoading ? (
                  <div className="flex items-center justify-center py-16 bg-white">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-100">
                        <svg className="w-6 h-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">Loading scans...</p>
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="px-4 py-3 text-left font-semibold">Scan Date/Time</th>
                        <th className="px-4 py-3 text-left font-semibold">Scan Type</th>
                        <th className="px-4 py-3 text-left font-semibold">Findings</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {scanHistoryRows.slice(0, 5).map((item, index) => {
                        const isLastRow = index === Math.min(4, scanHistoryRows.length - 1);
                        return (
                          <tr key={item.id} className={isLastRow ? "" : "border-b border-gray-200"}>
                            <td className="px-4 py-3">{item.scanDate} | {item.scanTime}</td>
                            <td className="px-4 py-3">{item.scanType}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-2 text-xs font-medium">
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                  C: {item.findings?.critical ?? 0}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                  H: {item.findings?.high ?? 0}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                                  M: {item.findings?.medium ?? 0}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  L: {item.findings?.low ?? 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${scanHistoryStatusClass(item.status)}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {(() => {
                                const canDownload = item.status === "Completed";
                                const isDownloading = downloadingScanJsonId === item.id;
                                return (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  title={canDownload ? "Download Launch JSON" : "Available after scan completion"}
                                  aria-label="Download Launch JSON"
                                  onClick={() => handleDownloadScanJson(item)}
                                  disabled={!canDownload || isDownloading}
                                >
                                  <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3v12" />
                                    <path d="m7 10 5 5 5-5" />
                                    <path d="M5 21h14" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  title={canDownload ? "Download Raw graph_json" : "Available after scan completion"}
                                  aria-label="Download Raw graph JSON"
                                  onClick={() => handleDownloadScanRawJson(item)}
                                  disabled={!canDownload || isDownloading}
                                >
                                  <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="M8 8h8" />
                                    <path d="M8 12h8" />
                                    <path d="M8 16h5" />
                                  </svg>
                                </button>
                              </div>
                                );
                              })()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {!scanHistoryLoading && (
                  <div className="px-4 py-3 bg-white border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Showing latest 5 scans</span>
                      <button
                        className="px-3 py-1.5 text-sm rounded hover:bg-indigo-700 font-medium bg-indigo-600 text-white"
                        onClick={handleOpenScanHistory}
                      >
                        View All Scans
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden h-full flex flex-col">
          <div className="bg-gray-600 text-white py-2 px-4">
            <h3 className="text-lg font-semibold">{dashboardAlerts.title}</h3>
          </div>
          <div className="p-4 flex-1">
            {dashboardAlertsLoading && (
              <div className="text-sm text-gray-600">Loading alerts...</div>
            )}
            {!dashboardAlertsLoading && dashboardAlertsError && (
              <div className="text-sm text-red-600">{dashboardAlertsError}</div>
            )}
            {!dashboardAlertsLoading && !dashboardAlertsError && dashboardAlerts.alerts.map((alert) => (
              <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="text-base font-semibold text-gray-900 mb-2">{alert.title}</div>
                    <div className="space-y-2">
                      {alert.cves.map((cve) => (
                        <div key={cve.id} className="flex items-start gap-2">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${alertSeverityColor(
                              cve.severity
                            )}`}
                          >
                            <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">{cve.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden h-full flex flex-col">
          <div className="bg-indigo-600 text-white py-2 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{mockDashboardData.remedialMeasures.title}</h3>
              <span className="text-xs font-medium text-white/80">
                {remedialTotal > 0 ? `Total ${remedialTotal}` : ""}
              </span>
            </div>
            <button
              type="button"
              className="p-1.5 rounded hover:bg-indigo-500 transition-colors"
              onClick={() => setIsRemedialModalOpen(true)}
              aria-label="Maximize remedial measures"
              title="Maximize"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6" />
                <path d="M9 21H3v-6" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
            </button>
          </div>
          <div className="px-4 pt-4">
            <div className="flex flex-wrap gap-2">
              {remedialSeverities.map((severity) => (
                <button
                  key={severity.key}
                  type="button"
                  onClick={() => setRemedialSeverityFilter(severity.key)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    remedialSeverityFilter === severity.key
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {severity.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 flex-1">
            {remedialLoading && (
              <div className="text-sm text-gray-500">Loading remediation notes...</div>
            )}
            {!remedialLoading && remedialMessage && (
              <div className="text-sm text-gray-500">{remedialMessage}</div>
            )}
            {!remedialLoading && !remedialMessage && (
              <div className="space-y-3">
                {remedialFilteredNotes.slice(0, remedialPreviewCount).map((note, index) => (
                  <div key={note.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className="text-base font-semibold text-gray-900">
                        {note.title || `Recommended Remediation for ${note.cve_id}`}
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {`Remedy ${index + 1} of ${remedialTotal || 1}`}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${severityBadgeClass(note.severity)}`}>
                        {note.severity || "Unknown"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{note.cve_id}</div>
                    <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                      {(note.remediation_steps || []).map((item, index) => (
                        <li key={`${note.id}-step-${index}`}>{item}</li>
                      ))}
                    </ul>
                    {note.notes && (
                      <p className="text-xs text-gray-500 mt-4 italic">{note.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isRemedialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[80vw] max-w-[80vw] h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{mockDashboardData.remedialMeasures.title}</h3>
                <span className="text-xs font-medium text-gray-500">
                  {remedialTotal > 0 ? `Total ${remedialTotal}` : ""}
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded hover:bg-gray-100"
                onClick={() => setIsRemedialModalOpen(false)}
                aria-label="Close remedial measures"
              >
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 pt-4">
              <div className="flex flex-wrap gap-2">
                {remedialSeverities.map((severity) => (
                  <button
                    key={severity.key}
                    type="button"
                    onClick={() => setRemedialSeverityFilter(severity.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      remedialSeverityFilter === severity.key
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {severity.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5 overflow-y-auto h-[calc(90vh-52px)]">
              {remedialLoading && (
                <div className="text-sm text-gray-500">Loading remediation notes...</div>
              )}
              {!remedialLoading && remedialMessage && (
                <div className="text-sm text-gray-500">{remedialMessage}</div>
              )}
              {!remedialLoading && !remedialMessage && (
                <div className="space-y-3">
                  {remedialFilteredNotes.map((note, index) => (
                    <div key={note.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="text-base font-semibold text-gray-900">
                          {note.title || `Recommended Remediation for ${note.cve_id}`}
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                          {`Remedy ${index + 1} of ${remedialTotal || 1}`}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${severityBadgeClass(note.severity)}`}>
                          {note.severity || "Unknown"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{note.cve_id}</div>
                      <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                        {(note.remediation_steps || []).map((item, index) => (
                          <li key={`${note.id}-step-${index}`}>{item}</li>
                        ))}
                      </ul>
                      {note.notes && (
                        <p className="text-xs text-gray-500 mt-4 italic">{note.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAlertDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[520px] max-w-[92vw] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Critical & High Findings</h3>
                <p className="text-xs text-gray-500">Last scan</p>
              </div>
              <button
                type="button"
                className="p-1.5 rounded hover:bg-gray-100"
                onClick={() => setIsAlertDetailsOpen(false)}
                aria-label="Close alert details"
              >
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {criticalHighCves.length === 0 && (
                <div className="text-sm text-gray-500">No critical or high findings for the last scan.</div>
              )}
              {criticalHighCves.length > 0 && (
                <div className="space-y-3">
                  {criticalHighCves.map((cve) => (
                    <div key={cve.id} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${severityBadgeClass(cve.severity)}`}>
                        {cve.severity}
                      </span>
                      <div className="text-sm text-gray-700">{cve.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isScanHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[88vw] max-w-6xl h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{mockDashboardData.clientAdminView.scanHistory.title}</h3>
              </div>
              <button
                type="button"
                className="p-1.5 rounded hover:bg-gray-100"
                onClick={() => setIsScanHistoryOpen(false)}
                aria-label="Close scan history"
              >
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 border-b border-gray-200 flex flex-wrap items-end gap-4">
              <div>
                <label htmlFor="scan-history-from" className="block text-xs font-medium text-gray-600 mb-1">
                  From
                </label>
                <input
                  id="scan-history-from"
                  type="date"
                  value={scanHistoryFromInput}
                  onChange={(e) => setScanHistoryFromInput(e.target.value)}
                  min={scanHistoryMinDate}
                  max={scanHistoryMaxDate}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="scan-history-to" className="block text-xs font-medium text-gray-600 mb-1">
                  To
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="scan-history-to"
                    type="date"
                    value={scanHistoryToInput}
                    onChange={(e) => setScanHistoryToInput(e.target.value)}
                    min={scanHistoryMinDate}
                    max={scanHistoryMaxDate}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyScanHistoryFilters}
                    className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Filter
                  </button>
                </div>
              </div>
              <div className="ml-auto min-w-[240px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search history"
                    value={scanHistorySearch}
                    onChange={(e) => setScanHistorySearch(e.target.value)}
                    className="w-full px-3 py-2 pr-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {scanHistoryError && (
                <div className="mx-5 mt-4 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {scanHistoryError}
                </div>
              )}
              <table className="w-full text-sm">
                <thead className="bg-indigo-600 text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Scan Date/Time</th>
                    <th className="px-4 py-3 text-left font-semibold">Scan Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Findings</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {scanHistoryLoading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Loading scan history...
                      </td>
                    </tr>
                  )}
                  {!scanHistoryLoading && scanHistoryRows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-gray-800">
                        {formatDate(row.scanDate)} | {formatTime(row.scanTime)}
                      </td>
                      <td className="px-4 py-3 text-gray-800">{row.scanType}</td>
                      <td className="px-4 py-3 text-gray-800">
                        <div className="flex flex-wrap gap-2 text-xs font-medium">
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            C: {row.findings.critical}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                            H: {row.findings.high}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                            M: {row.findings.medium}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            L: {row.findings.low}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${scanHistoryStatusClass(row.status)}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const canDownload = row.status === "Completed";
                          const isDownloading = downloadingScanJsonId === row.id;
                          return (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadScanJson(row)}
                            className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            title={canDownload ? "Download Launch JSON" : "Available after scan completion"}
                            aria-label="Download Launch JSON"
                            disabled={!canDownload || isDownloading}
                          >
                            <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 3v12" />
                              <path d="m7 10 5 5 5-5" />
                              <path d="M5 21h14" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadScanRawJson(row)}
                            className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            title={canDownload ? "Download Raw graph_json" : "Available after scan completion"}
                            aria-label="Download Raw graph JSON"
                            disabled={!canDownload || isDownloading}
                          >
                            <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M8 8h8" />
                              <path d="M8 12h8" />
                              <path d="M8 16h5" />
                            </svg>
                          </button>
                        </div>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                  {!scanHistoryLoading && scanHistoryRows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No scans found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
              <span>
                Showing {scanHistoryTotal === 0 ? 0 : scanHistoryStartIndex + 1}-
                {Math.min(scanHistoryStartIndex + scanHistoryPageSize, scanHistoryTotal)} of {scanHistoryTotal}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setScanHistoryPage((page) => Math.max(1, page - 1))}
                  disabled={scanHistoryPageSafe === 1}
                >
                  Prev
                </button>
                <span className="text-gray-700">Page {scanHistoryPageSafe} of {scanHistoryTotalPages}</span>
                <button
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setScanHistoryPage((page) => Math.min(scanHistoryTotalPages, page + 1))}
                  disabled={scanHistoryPageSafe === scanHistoryTotalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h4 className="text-base font-semibold text-gray-700">{pastStats.title}</h4>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="px-2.5 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                onClick={handleDownloadChartPng}
              >
                Download PNG
              </button>
              <button
                className="px-2.5 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                onClick={handleDownloadChartCsv}
              >
                Download Excel (CSV)
              </button>
              <span className="text-sm text-gray-600">
                {pastStatsLoading ? "Loading..." : pastStatsError || ""}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {pastStats.severities.map((severity) => (
              <div key={severity.key} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: severity.color }}></span>
                {severity.label}
              </div>
            ))}
          </div>
          <div className="h-48">
            <svg ref={chartSvgRef} className="w-full h-full" viewBox="0 0 760 160">
              <line
                x1={pastStatsPadding.left}
                y1={pastStatsPadding.top}
                x2={pastStatsPadding.left}
                y2={pastStatsView.height - pastStatsPadding.bottom}
                stroke="#e5e7eb"
              />
              <line
                x1={pastStatsPadding.left}
                y1={pastStatsView.height - pastStatsPadding.bottom}
                x2={pastStatsView.width - pastStatsPadding.right}
                y2={pastStatsView.height - pastStatsPadding.bottom}
                stroke="#e5e7eb"
              />

              {pastStatsTicks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={pastStatsPadding.left - 4}
                    y1={pastStatsY(tick)}
                    x2={pastStatsPadding.left}
                    y2={pastStatsY(tick)}
                    stroke="#9ca3af"
                  />
                  <text
                    x={pastStatsPadding.left - 6}
                    y={pastStatsY(tick) + 3}
                    textAnchor="end"
                    className="fill-gray-500"
                    fontSize="10"
                  >
                    {tick}
                  </text>
                </g>
              ))}

              {monthlyCounts.map((counts, index) => {
                const groupCenterX = pastStatsX(index);
                const groupStartX = groupCenterX - pastStatsGroupWidth / 2;
                return (
                  <g key={pastStatsMonthLabels[index]}>
                    {pastStats.severities.map((severity, severityIndex) => {
                      const value = counts[severity.key] ?? 0;
                      if (value === 0) {
                        return null;
                      }
                      const barX =
                        groupStartX +
                        severityIndex * (pastStatsBarWidth + pastStatsBarGap);
                      const y = pastStatsY(value);
                      const height = pastStatsY(0) - y;
                      return (
                        <g key={`${pastStatsMonthLabels[index]}-${severity.key}`}>
                          <rect
                            x={barX}
                            y={y}
                            width={pastStatsBarWidth}
                            height={height}
                            fill={severity.color}
                            rx="3"
                          >
                            <title>{`${pastStatsMonthLabels[index]} ${severity.label}: ${value}`}</title>
                          </rect>
                        </g>
                      );
                    })}
                    <text
                      x={pastStatsX(index)}
                      y={pastStatsView.height - pastStatsPadding.bottom + 12}
                      textAnchor="middle"
                      className="fill-gray-500"
                      fontSize="10"
                    >
                      {pastStatsMonthLabels[index]}
                    </text>
                  </g>
                );
              })}

              <text
                x={pastStatsView.width / 2}
                y={pastStatsView.height - 6}
                textAnchor="middle"
                className="fill-gray-500"
                fontSize="10"
              >
                {pastStats.xAxisLabelMonth}
              </text>
              <text
                x={10}
                y={pastStatsView.height / 2}
                textAnchor="middle"
                className="fill-gray-500"
                fontSize="10"
                transform={`rotate(-90 10 ${pastStatsView.height / 2})`}
              ></text>
            </svg>
          </div>
          <div className="mt-3 flex justify-between text-sm text-gray-600"></div>
        </div>

      </div>
    </div>
  );
}
