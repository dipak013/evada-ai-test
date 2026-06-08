"use client";
import { useEffect, useMemo, useState } from "react";
import {
    AiScannerReportRow,
    AiScannerReportsDashboardPayload,
    AiScannerReportsService,
    ReportStatus,
} from "@/services/ai-scanner-reports.service";

const statusStyle: Record<ReportStatus, string> = {
    Ready: "bg-green-100 text-green-700 border border-green-200",
    Generating: "bg-blue-100 text-blue-700 border border-blue-200",
    Scheduled: "bg-purple-100 text-purple-700 border border-purple-200",
    Failed: "bg-red-100 text-red-700 border border-red-200",
};

const statusDot: Record<ReportStatus, string> = {
    Ready: "bg-green-500",
    Generating: "bg-blue-500 animate-pulse",
    Scheduled: "bg-purple-500",
    Failed: "bg-red-500",
};

const severityPriority: Record<string, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
};

const severityChipStyle = (severity?: string): string => {
    const normalized = (severity || "").toUpperCase();
    if (normalized === "CRITICAL") return "bg-red-100 text-red-700 border border-red-200";
    if (normalized === "HIGH") return "bg-orange-100 text-orange-700 border border-orange-200";
    if (normalized === "MEDIUM") return "bg-amber-100 text-amber-700 border border-amber-200";
    if (normalized === "LOW") return "bg-blue-100 text-blue-700 border border-blue-200";
    return "bg-slate-100 text-slate-700 border border-slate-200";
};

const severityHeaderStyle = (severity?: string): string => {
    const normalized = (severity || "").toUpperCase();
    if (normalized === "CRITICAL") return "bg-red-50";
    if (normalized === "HIGH") return "bg-orange-50";
    if (normalized === "MEDIUM") return "bg-amber-50";
    if (normalized === "LOW") return "bg-blue-50";
    return "bg-slate-50";
};

export default function ReportsPage() {
    const [modalFindingFilter, setModalFindingFilter] = useState<"All" | "Exploitable">("All");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | ReportStatus>("All");
    const [dashboard, setDashboard] = useState<AiScannerReportsDashboardPayload | null>(null);
    const [selectedReport, setSelectedReport] = useState<AiScannerReportRow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadDashboard = async () => {
            try {
                setIsLoading(true);
                const payload = await AiScannerReportsService.getDashboard();
                if (cancelled) return;
                setDashboard(payload);
                setLoadError(null);
            } catch (error: any) {
                if (cancelled) return;
                setLoadError(error?.response?.data?.error || error?.message || "Failed to load reports dashboard");
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void loadDashboard();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!selectedReport) return;
        setModalFindingFilter("All");
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedReport(null);
            }
        };
        globalThis.addEventListener("keydown", onKeyDown);
        return () => globalThis.removeEventListener("keydown", onKeyDown);
    }, [selectedReport]);

    const reports = dashboard?.reports || [];
    const monthly = dashboard?.monthly || [];
    const cards = dashboard?.cards || { ready: 0, generating: 0, scheduled: 0, failed: 0, total: 0 };

    const filtered = useMemo(() => {
        const matched = reports.filter((r) => {
            const query = search.toLowerCase();
            const matchSearch =
                r.title.toLowerCase().includes(query) ||
                r.author.toLowerCase().includes(query) ||
                r.scope.toLowerCase().includes(query) ||
                r.job_id.toLowerCase().includes(query) ||
                r.id.toLowerCase().includes(query);
            const matchStatus = statusFilter === "All" || r.status === statusFilter;
            return matchSearch && matchStatus;
        });

        return matched.sort((a, b) => {
            const aTs = a.generated ? Date.parse(a.generated) : 0;
            const bTs = b.generated ? Date.parse(b.generated) : 0;
            if (bTs !== aTs) {
                return bTs - aTs;
            }

            if (b.exploitable_count !== a.exploitable_count) {
                return b.exploitable_count - a.exploitable_count;
            }

            if (b.vulnerabilities_count !== a.vulnerabilities_count) {
                return b.vulnerabilities_count - a.vulnerabilities_count;
            }

            return a.job_id.localeCompare(b.job_id);
        });
    }, [reports, search, statusFilter]);

    const maxBar = Math.max(1, ...monthly.map((item) => item.value));
    const modalVulnerabilities = useMemo(() => {
        if (!selectedReport) return [];
        return [...selectedReport.vulnerabilities].sort((a, b) => {
            if (a.exploitable !== b.exploitable) {
                return Number(b.exploitable) - Number(a.exploitable);
            }
            const aSeverity = severityPriority[(a.severity || "").toUpperCase()] || 0;
            const bSeverity = severityPriority[(b.severity || "").toUpperCase()] || 0;
            if (aSeverity !== bSeverity) {
                return bSeverity - aSeverity;
            }
            const aCvss = Number.isFinite(a.cvss) ? a.cvss : -1;
            const bCvss = Number.isFinite(b.cvss) ? b.cvss : -1;
            if (aCvss !== bCvss) {
                return bCvss - aCvss;
            }
            return (a.cve || "").localeCompare(b.cve || "");
        });
    }, [selectedReport]);

    const severityBreakdown = useMemo(() => {
        return modalVulnerabilities.reduce(
            (acc, vuln) => {
                const normalized = (vuln.severity || "UNKNOWN").toUpperCase();
                acc[normalized] = (acc[normalized] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );
    }, [modalVulnerabilities]);

    const exploitableCount = useMemo(() => {
        return modalVulnerabilities.filter((vuln) => vuln.exploitable).length;
    }, [modalVulnerabilities]);

    const visibleModalVulnerabilities = useMemo(() => {
        if (modalFindingFilter === "Exploitable") {
            return modalVulnerabilities.filter((vuln) => vuln.exploitable);
        }
        return modalVulnerabilities;
    }, [modalFindingFilter, modalVulnerabilities]);

    return (
        <div className="page-padding section-spacing">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-page-title">Reports</h1>
                    <p className="text-small mt-0.5">Generate, schedule, and download security reports</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search report/job/scope..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input md:w-64"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>
            </div>

            {(isLoading || loadError) && (
                <div className="card p-3 mb-4 text-xs">
                    {isLoading && <p className="text-gray-600">Loading reports dashboard...</p>}
                    {loadError && <p className="text-red-600">{loadError}</p>}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
                {[
                    { label: "Ready", value: String(cards.ready), sub: "latest reports complete", color: "from-green-400 to-green-600" },
                    { label: "Generating", value: String(cards.generating), sub: "in progress", color: "from-blue-400 to-blue-600" },
                    { label: "Scheduled", value: String(cards.scheduled), sub: "queued", color: "from-purple-400 to-purple-600" },
                    { label: "Failed", value: String(cards.failed), sub: cards.failed > 0 ? "needs retry" : "none", color: cards.failed > 0 ? "from-red-400 to-red-600" : "from-gray-400 to-gray-500" },
                ].map((s) => (
                    <div key={s.label} className="card p-3 md:p-4">
                        <div className={`w-10 h-1.5 bg-gradient-to-r ${s.color} rounded-full mb-3`} />
                        <p className="text-lg md:text-2xl font-bold text-gray-800">{s.value}</p>
                        <p className="text-[10px] md:text-xs text-gray-600 mt-0.5">{s.label}</p>
                        <p className="text-[10px] text-indigo-500 font-medium">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                {/* Monthly Reports Bar Chart */}
                <div className="lg:col-span-2 card p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-card-title">Reports Generated (Last 12 Months)</h2>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Rolling Year</span>
                    </div>
                    <div className="flex items-end justify-between gap-1 h-36 px-2">
                        {monthly.map((bar) => (
                            <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
                                <span className="text-[10px] text-gray-600 font-semibold">{bar.value}</span>
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t"
                                    style={{ height: `${(bar.value / maxBar) * 100}px` }}
                                />
                                <span className="text-[9px] text-gray-400">{bar.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Overview */}
                <div className="card p-4">
                    <h2 className="text-card-title mb-3">Overview</h2>
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-gray-600">Total Jobs (latest report)</span>
                            <span className="text-sm font-bold text-gray-800">{cards.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-gray-600">Visible in Table</span>
                            <span className="text-sm font-bold text-gray-800">{filtered.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-gray-600">Total Vulnerabilities (visible)</span>
                            <span className="text-sm font-bold text-gray-800">
                                {filtered.reduce((sum, row) => sum + row.vulnerabilities_count, 0)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-gray-600">Vulnerable (visible)</span>
                            <span className="text-sm font-bold text-red-600">
                                {filtered.reduce((sum, row) => sum + row.exploitable_count, 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters + Table */}
            <div className="card">
                <div className="card-padding border-b border-purple-100">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <h2 className="text-card-title">{filtered.length} Reports</h2>
                        <div className="flex gap-2 flex-wrap">
                            {(["All", "Ready", "Generating", "Scheduled", "Failed"] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s as "All" | ReportStatus)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${
                                        statusFilter === s
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="responsive-table-container">
                    <table className="responsive-table">
                        <thead>
                            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <th className="px-4 py-3 text-left text-xs font-semibold">Report ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Job ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Title</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Generated</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Vulnerabilities</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Vulnerable</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Author</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Scope</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && !loadError && filtered.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-xs text-gray-500" colSpan={9}>
                                        No reports found.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((r, idx) => (
                                <tr
                                    key={r.id}
                                    className={`border-b border-purple-50 hover:bg-purple-50/50 transition-colors cursor-pointer ${idx % 2 === 0 ? "bg-purple-50/30" : "bg-white"}`}
                                    onClick={() => setSelectedReport(r)}
                                    title="Click to view vulnerability execution details"
                                >
                                    <td className="px-4 py-3 text-xs font-mono text-gray-600">{r.id}</td>
                                    <td className="px-4 py-3 text-xs font-mono text-indigo-600">{r.job_id}</td>
                                    <td className="px-4 py-3 text-xs font-medium text-gray-800 max-w-xs">
                                        <p className="truncate" title={r.title}>{r.title}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle[r.status]}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[r.status]}`} />
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{r.generated || "-"}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600 font-semibold">{r.vulnerabilities_count}</td>
                                    <td className="px-4 py-3 text-xs text-red-600 font-semibold">{r.exploitable_count}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600">{r.author}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600">{r.scope}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
                    <div className="w-full max-w-7xl max-h-[90vh] overflow-auto rounded-xl bg-white shadow-2xl border border-slate-200">
                        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{selectedReport.id} Vulnerability Execution Details</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Job {selectedReport.job_id} • Scope {selectedReport.scope || "-"}</p>
                            </div>
                            <button
                                type="button"
                                autoFocus
                                onClick={() => setSelectedReport(null)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>

                        <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/50">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 text-xs">
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Generated</p>
                                    <p className="font-semibold text-slate-800 mt-0.5">{selectedReport.generated || "-"}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Status</p>
                                    <p className="font-semibold text-slate-800 mt-0.5">{selectedReport.status}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Findings</p>
                                    <p className="font-semibold text-slate-800 mt-0.5">{modalVulnerabilities.length}</p>
                                </div>
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-red-600">Exploitable</p>
                                    <p className="font-semibold text-red-700 mt-0.5">{exploitableCount}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Author</p>
                                    <p className="font-semibold text-slate-800 mt-0.5 truncate">{selectedReport.author || "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-2.5 border-b border-slate-200 bg-white">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Severity Distribution</span>
                                {Object.entries(severityBreakdown)
                                    .sort((a, b) => (severityPriority[b[0]] || 0) - (severityPriority[a[0]] || 0))
                                    .map(([severity, count]) => (
                                        <span key={severity} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${severityChipStyle(severity)}`}>
                                            <span>{severity}</span>
                                            <span className="text-[10px] opacity-80">{count}</span>
                                        </span>
                                    ))}
                                {Object.keys(severityBreakdown).length === 0 && (
                                    <span className="text-[11px] text-slate-500">No severity data available.</span>
                                )}
                            </div>
                        </div>

                        <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/70">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    {([
                                        { key: "All", label: "All Findings", count: modalVulnerabilities.length },
                                        { key: "Exploitable", label: "Exploitable", count: exploitableCount },
                                    ] as const).map((option) => (
                                        <button
                                            key={option.key}
                                            type="button"
                                            onClick={() => setModalFindingFilter(option.key)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold border transition-colors ${
                                                modalFindingFilter === option.key
                                                    ? "bg-slate-900 text-white border-slate-900"
                                                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                                            }`}
                                        >
                                            <span>{option.label}</span>
                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${modalFindingFilter === option.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                                                {option.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[11px] text-slate-500">Showing {visibleModalVulnerabilities.length} of {modalVulnerabilities.length} findings</p>
                            </div>
                        </div>

                        <div className="p-4 space-y-3">
                            {visibleModalVulnerabilities.length === 0 && (
                                <p className="text-xs text-gray-500">
                                    {modalVulnerabilities.length === 0
                                        ? "No vulnerabilities found in this report."
                                        : "No findings match the selected filter."}
                                </p>
                            )}

                            {visibleModalVulnerabilities.map((vuln) => {
                                return (
                                <details key={vuln.id} className="border border-slate-200 rounded-lg overflow-visible bg-white">
                                    <summary className={`cursor-pointer list-none px-3 py-2.5 flex items-center justify-between gap-2 ${severityHeaderStyle(vuln.severity)}`}>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <p className="text-xs font-semibold text-indigo-700 truncate">{vuln.cve}</p>
                                                <span className="relative inline-flex items-center shrink-0 group" aria-label="Vulnerability metadata">
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-indigo-200 bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-50 transition-colors duration-150 group-hover:border-indigo-300 group-hover:text-indigo-700 group-hover:bg-indigo-50/50 group-focus-within:border-indigo-300 group-focus-within:text-indigo-700 group-focus-within:bg-indigo-50/50">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3 h-3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25m0 3.75h.008v.008H12v-.008z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25h-7.5a2.25 2.25 0 00-2.25 2.25v4.087a2.25 2.25 0 00.659 1.591l4.5 4.5a2.25 2.25 0 003.182 0l4.5-4.5A2.25 2.25 0 0019.5 11.587V7.5a2.25 2.25 0 00-2.25-2.25z" />
                                                        </svg>
                                                    </span>
                                                    <span className="pointer-events-none absolute left-0 top-6 z-20 w-52 sm:w-56 rounded-lg border border-slate-200 bg-white/95 px-3 py-2.5 text-[11px] text-slate-700 shadow-xl backdrop-blur-sm opacity-0 -translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                                                        <span className="block text-[10px] font-semibold tracking-wide uppercase text-slate-500">Vulnerability Info</span>
                                                        <span className="mt-2 flex items-center justify-between gap-2">
                                                            <span className="text-slate-500">Severity</span>
                                                            <span className={`px-1.5 py-0.5 rounded font-semibold text-[10px] ${severityChipStyle(vuln.severity)}`}>
                                                                {vuln.severity || "-"}
                                                            </span>
                                                        </span>
                                                        <span className="mt-1.5 flex items-center justify-between gap-2">
                                                            <span className="text-slate-500">CVSS</span>
                                                            <span className="font-semibold text-slate-800">{Number.isFinite(vuln.cvss) ? vuln.cvss.toFixed(1) : "-"}</span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-700 truncate">{vuln.title}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] shrink-0">
                                            <span className={`px-2 py-0.5 rounded-full font-semibold ${vuln.exploitable ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                                                {vuln.exploitable ? "Vulnerable" : "Not Vulnerable"}
                                            </span>
                                        </div>
                                    </summary>

                                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        <div className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
                                            <p className="text-gray-500">Action</p>
                                            <p className="font-semibold text-gray-800">{vuln.action || "-"}</p>
                                        </div>
                                        <div className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
                                            <p className="text-gray-500">Attempts</p>
                                            <p className="font-semibold text-gray-800">{vuln.attempts?.length ?? 0}</p>
                                        </div>
                                        <div className="md:col-span-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
                                            <p className="text-gray-500">Target</p>
                                            <p className="font-mono text-[11px] text-gray-800 break-all">{vuln.target || vuln.affected || "-"}</p>
                                        </div>
                                        <div className="md:col-span-2 rounded-md border border-red-100 bg-red-50 px-2.5 py-2">
                                            <p className="text-gray-500">Error</p>
                                            <pre className="whitespace-pre-wrap break-words text-[11px] text-red-700 font-mono">{vuln.error || "-"}</pre>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">STDOUT</p>
                                            <pre className="whitespace-pre-wrap break-words text-[11px] leading-5 text-gray-800 font-mono bg-gray-50 border border-gray-200 rounded-md p-2 max-h-52 overflow-auto">
                                                {vuln.stdout || "-"}
                                            </pre>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">STDERR</p>
                                            <pre className="whitespace-pre-wrap break-words text-[11px] leading-5 text-gray-800 font-mono bg-gray-50 border border-gray-200 rounded-md p-2 max-h-52 overflow-auto">
                                                {vuln.stderr || "-"}
                                            </pre>
                                        </div>
                                    </div>
                                </details>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
