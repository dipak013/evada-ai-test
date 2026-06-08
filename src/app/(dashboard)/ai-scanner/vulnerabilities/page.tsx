"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AiScannerPipelineService } from "@/services/ai-scanner-pipeline.service";
import {
    AiScannerVulnerabilitiesService,
    AiScannerVulnerabilityRow,
    VulnStatus,
} from "@/services/ai-scanner-vulnerabilities.service";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type Vulnerability = AiScannerVulnerabilityRow;

const severityStyle: Record<Severity, string> = {
    CRITICAL: "bg-red-100 text-red-700 border border-red-200",
    HIGH: "bg-orange-100 text-orange-700 border border-orange-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    LOW: "bg-blue-100 text-blue-700 border border-blue-200",
};

const cvssBarColor: Record<Severity, string> = {
    CRITICAL: "bg-red-500",
    HIGH: "bg-orange-400",
    MEDIUM: "bg-yellow-400",
    LOW: "bg-blue-400",
};

const modalHeaderTone: Record<Severity, string> = {
    CRITICAL: "from-red-100 to-rose-50 border-red-300",
    HIGH: "from-orange-100 to-amber-50 border-orange-300",
    MEDIUM: "from-amber-100 to-yellow-50 border-amber-300",
    LOW: "from-blue-100 to-cyan-50 border-blue-300",
};

const modalCardTone: Record<Severity, string> = {
    CRITICAL: "border-red-300 bg-red-50",
    HIGH: "border-orange-300 bg-orange-50",
    MEDIUM: "border-amber-300 bg-amber-50",
    LOW: "border-blue-300 bg-blue-50",
};

const statusBadgeStyle: Record<VulnStatus, string> = {
    Open: "bg-red-100 text-red-700 border border-red-200",
    "In Review": "bg-orange-100 text-orange-700 border border-orange-200",
    Patched: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Accepted: "bg-slate-100 text-slate-700 border border-slate-200",
};

const statusStyle: Record<VulnStatus, string> = {
    Open: "text-red-600",
    "In Review": "text-orange-500",
    Patched: "text-green-600",
    Accepted: "text-gray-500",
};

const severityRank: Record<Severity, number> = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
};

export default function VulnerabilitiesPage() {
    const searchParams = useSearchParams();
    const requestedJobId = (searchParams.get("job_id") || "").trim();

    const [selectedJobId, setSelectedJobId] = useState<string>(requestedJobId);
    const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadMessage, setLoadMessage] = useState("Resolving selected job...");
    const [loadError, setLoadError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
    const reportFetchedRef = useRef<string | null>(null);

    useEffect(() => {
        if (!selectedVulnerability) return;
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedVulnerability(null); };
        globalThis.addEventListener("keydown", onKeyDown);
        return () => globalThis.removeEventListener("keydown", onKeyDown);
    }, [selectedVulnerability]);

    useEffect(() => {
        setSelectedJobId(requestedJobId);
        setVulnerabilities([]);
        setLoadError(null);
        reportFetchedRef.current = null;
    }, [requestedJobId]);

    useEffect(() => {
        let cancelled = false;

        const resolveJob = async () => {
            if (selectedJobId) return;
            try {
                setLoadMessage("Finding latest AI Pentester job...");
                const payload = await AiScannerPipelineService.getActive();
                const fallbackJobId = payload.job?.id || "";

                if (!cancelled) {
                    if (fallbackJobId) {
                        setSelectedJobId(fallbackJobId);
                    } else {
                        setLoadError("No AI Pentester job found. Launch a scan first.");
                        setIsLoading(false);
                    }
                }
            } catch (error: any) {
                if (!cancelled) {
                    setLoadError(error?.message || "Failed to resolve AI Pentester job");
                    setIsLoading(false);
                }
            }
        };

        void resolveJob();
        return () => {
            cancelled = true;
        };
    }, [selectedJobId]);

    useEffect(() => {
        let cancelled = false;
        if (!selectedJobId) return;

        const fetchReport = async (jobId: string) => {
            try {
                setLoadMessage("Fetching vulnerability report...");
                const report = await AiScannerVulnerabilitiesService.getByJobId(jobId);
                if (cancelled) return;
                setVulnerabilities(report.vulnerabilities || []);
                setLoadError(null);
                setIsLoading(false);
                reportFetchedRef.current = jobId;
            } catch (error: any) {
                if (cancelled) return;
                setLoadError(error?.response?.data?.error || error?.message || "Failed to fetch vulnerability report");
                setIsLoading(false);
            }
        };

        const pollForCompletionThenFetch = async () => {
            if (reportFetchedRef.current === selectedJobId) return;
            try {
                const payload = await AiScannerPipelineService.getJobLive(selectedJobId);
                if (cancelled) return;

                const pipelineComplete = payload.pipeline?.length > 0 && payload.pipeline.every((step) => step.state === "Completed");
                const jobFailed = (payload.job?.status || "").toLowerCase() === "failed";

                if (jobFailed) {
                    setLoadError("Selected pipeline failed. Vulnerability report is unavailable.");
                    setIsLoading(false);
                    return;
                }

                if (pipelineComplete) {
                    if (reportFetchedRef.current !== selectedJobId) {
                        await fetchReport(selectedJobId);
                    }
                    return;
                }

                setLoadMessage("Pipeline is still running. Waiting for completion...");
                setIsLoading(true);
            } catch (error: any) {
                if (cancelled) return;
                setLoadError(error?.message || "Failed to poll pipeline status");
                setIsLoading(false);
            }
        };

        void pollForCompletionThenFetch();
        const timer = globalThis.setInterval(() => {
            void pollForCompletionThenFetch();
        }, 2000);

        return () => {
            cancelled = true;
            globalThis.clearInterval(timer);
        };
    }, [selectedJobId]);

    const filteredAndSorted = useMemo(() => {
        const filtered = vulnerabilities.filter((v) => {
            const query = search.toLowerCase().trim();
            if (!query) return true;

            const rowText = [
                v.cve,
                v.title,
                v.cvss,
                v.severity,
                v.affected,
                v.status,
                v.exploitable ? "yes" : "no",
                v.published,
            ]
                .map((value) => String(value || "").toLowerCase())
                .join(" ");

            return rowText.includes(query);
        });

        return filtered.sort((a, b) => {
            if (a.exploitable !== b.exploitable) {
                return Number(b.exploitable) - Number(a.exploitable);
            }

            const severityDelta = severityRank[a.severity] - severityRank[b.severity];
            if (severityDelta !== 0) {
                return severityDelta;
            }

            const cvssDelta = b.cvss - a.cvss;
            if (cvssDelta !== 0) {
                return cvssDelta;
            }

            return a.cve.localeCompare(b.cve);
        });
    }, [vulnerabilities, search]);

    return (
        <div className="page-padding section-spacing">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-page-title">Vulnerabilities</h1>
                    <p className="text-small mt-0.5">CVE tracking, severity scoring, and remediation status</p>
                </div>
                <Link
                    href="/ai-scanner/new-scan"
                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                    </svg>
                    New Scan
                </Link>
            </div>

            {/* Filters + Table */}
            <div className="card">
                <div className="card-padding border-b border-purple-100 flex items-center justify-between gap-3 flex-wrap">
                    <h2 className="text-card-title">{filteredAndSorted.length} Vulnerabilities</h2>
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search entire table..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>
                <div className="responsive-table-container">
                    {(isLoading || loadError) && (
                        <div className="px-4 py-3 border-b border-purple-50 text-xs">
                            {isLoading && <p className="text-gray-600">{loadMessage}</p>}
                            {loadError && <p className="text-red-600">{loadError}</p>}
                            {!isLoading && !loadError && selectedJobId && (
                                <p className="text-gray-500">Job: {selectedJobId}</p>
                            )}
                        </div>
                    )}
                    <table className="responsive-table">
                        <thead>
                            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <th className="px-4 py-3 text-left text-xs font-semibold">CVE ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Title</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">CVSS</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Severity</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Affected</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Vulnerable</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Published</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && !loadError && filteredAndSorted.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-6 text-center text-xs text-gray-500">
                                        No vulnerabilities found for this job.
                                    </td>
                                </tr>
                            )}
                            {filteredAndSorted.map((v, idx) => (
                                <tr
                                    key={v.id}
                                    className={`border-b border-purple-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-400 ${idx % 2 === 0 ? "bg-purple-50/30" : "bg-white"} ${
                                        v.exploitable ? "hover:bg-purple-100/70" : "hover:bg-purple-50/70"
                                    }`}
                                    tabIndex={0}
                                    aria-label={`View execution details for ${v.cve}`}
                                    onClick={() => setSelectedVulnerability(v)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setSelectedVulnerability(v);
                                        }
                                    }}
                                    title="Click to view execution details"
                                >
                                    <td className="px-4 py-3 text-xs font-mono font-semibold text-indigo-600">{v.cve}</td>
                                    <td className="px-4 py-3 text-xs text-gray-800 max-w-xs">
                                        <p className="truncate" title={v.title}>{v.title}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                                <div className={`${cvssBarColor[v.severity]} h-1.5 rounded-full`} style={{ width: `${(v.cvss / 10) * 100}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{v.cvss.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${severityStyle[v.severity]}`}>{v.severity}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                                        <p className="truncate" title={v.affected}>{v.affected}</p>
                                    </td>
                                    <td className={`px-4 py-3 text-xs font-semibold ${statusStyle[v.status]}`}>{v.status}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-semibold ${v.exploitable ? "text-red-600" : "text-gray-400"}`}>
                                            {v.exploitable ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{v.published || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedVulnerability && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
                    <div className="w-full max-w-6xl max-h-[90vh] overflow-auto rounded-xl bg-white shadow-2xl border border-slate-200">
                        <div className={`sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between bg-gradient-to-r ${modalHeaderTone[selectedVulnerability.severity]}`}>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{selectedVulnerability.cve} Execution Details</h3>
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{selectedVulnerability.title}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                                    <span className={`px-2 py-0.5 rounded-full font-semibold ${severityStyle[selectedVulnerability.severity]}`}>
                                        {selectedVulnerability.severity}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700 font-semibold">
                                        CVSS {Number.isFinite(selectedVulnerability.cvss) ? selectedVulnerability.cvss.toFixed(1) : "-"}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full font-semibold ${statusBadgeStyle[selectedVulnerability.status]}`}>
                                        {selectedVulnerability.status}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full font-semibold ${selectedVulnerability.exploitable ? "bg-red-100 text-red-700 border border-red-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}>
                                        {selectedVulnerability.exploitable ? "Vulnerable" : "Not Vulnerable"}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                autoFocus
                                onClick={() => setSelectedVulnerability(null)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-4 md:p-5 text-xs grid grid-cols-1 xl:grid-cols-3 gap-4">
                            <div className="xl:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div className={`rounded-lg border p-3 ${modalCardTone[selectedVulnerability.severity]}`}>
                                        <p className="text-[10px] uppercase tracking-wide text-gray-500">CVSS Score</p>
                                        <p className="font-semibold text-gray-800 mt-0.5">{Number.isFinite(selectedVulnerability.cvss) ? selectedVulnerability.cvss.toFixed(1) : "-"}</p>
                                    </div>
                                    <div className={`rounded-lg border p-3 ${modalCardTone[selectedVulnerability.severity]}`}>
                                        <p className="text-[10px] uppercase tracking-wide text-gray-500">Workflow Status</p>
                                        <p className={`font-semibold mt-0.5 ${statusStyle[selectedVulnerability.status]}`}>{selectedVulnerability.status || "-"}</p>
                                    </div>
                                    <div className={`rounded-lg border p-3 ${modalCardTone[selectedVulnerability.severity]}`}>
                                        <p className="text-[10px] uppercase tracking-wide text-gray-500">Attempts</p>
                                        <p className="font-semibold text-gray-800 mt-0.5">{selectedVulnerability.attempts?.length ?? 0}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                                        <p className="text-gray-500 mb-1">Action</p>
                                        <p className="font-semibold text-gray-800">{selectedVulnerability.action || "-"}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                                        <p className="text-gray-500 mb-1">Published</p>
                                        <p className="font-semibold text-gray-800">{selectedVulnerability.published || "-"}</p>
                                    </div>
                                    <div className="md:col-span-2 rounded-lg border border-slate-200 p-3 bg-slate-50">
                                        <p className="text-gray-500 mb-1">Target</p>
                                        <p className="font-mono text-[11px] leading-5 text-gray-800 break-all">{selectedVulnerability.target || selectedVulnerability.affected || "-"}</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-red-200 p-3 bg-red-50/70">
                                    <p className="text-gray-500 mb-1">Error</p>
                                    <pre className="whitespace-pre-wrap break-words text-[11px] leading-5 text-red-700 font-mono">{selectedVulnerability.error || "-"}</pre>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-gray-500 mb-1">STDOUT</p>
                                        <pre className="whitespace-pre-wrap break-words text-[11px] leading-5 text-gray-800 font-mono bg-slate-50 border border-slate-200 rounded-md p-2 min-h-16 max-h-72 overflow-auto">
                                            {selectedVulnerability.stdout || "-"}
                                        </pre>
                                    </div>

                                    <div className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-gray-500 mb-1">STDERR</p>
                                        <pre className="whitespace-pre-wrap break-words text-[11px] leading-5 text-gray-800 font-mono bg-slate-50 border border-slate-200 rounded-md p-2 min-h-16 max-h-72 overflow-auto">
                                            {selectedVulnerability.stderr || "-"}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            <aside className="space-y-3">
                                <div className={`rounded-lg border p-3 ${modalCardTone[selectedVulnerability.severity]}`}>
                                    <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Triage Snapshot</p>
                                    <div className="mt-2 space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-gray-500">Severity</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${severityStyle[selectedVulnerability.severity]}`}>
                                                {selectedVulnerability.severity}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-gray-500">CVSS</span>
                                            <span className="font-semibold text-gray-800">{Number.isFinite(selectedVulnerability.cvss) ? selectedVulnerability.cvss.toFixed(1) : "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-gray-500">Status</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusBadgeStyle[selectedVulnerability.status]}`}>
                                                {selectedVulnerability.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Affected Endpoint</p>
                                    <p className="mt-2 font-mono text-[11px] leading-5 text-slate-700 break-all">
                                        {selectedVulnerability.affected || selectedVulnerability.target || "-"}
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
