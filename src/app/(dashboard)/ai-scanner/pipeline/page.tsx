"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    AiScannerJob,
    AiScannerLiveEvent,
    AiScannerPipelineRow,
    AiScannerPipelineService,
    PipelineState,
} from "@/services/ai-scanner-pipeline.service";

const badgeStyle: Record<PipelineState, string> = {
    Waiting: "bg-gray-100 text-gray-600 border border-gray-200",
    Running: "bg-blue-100 text-blue-700 border border-blue-200",
    Completed: "bg-green-100 text-green-700 border border-green-200",
    Failed: "bg-red-100 text-red-700 border border-red-200",
};

const FALLBACK_ROWS: AiScannerPipelineRow[] = [
    { order: "01", key: "ingest", stage: "Ingestion", detail: "Loading and queuing log file", state: "Waiting" },
    { order: "02", key: "parse", stage: "Parser", detail: "Removing noise, normalizing entries", state: "Waiting" },
    { order: "03", key: "match", stage: "Vulnerability identifier", detail: "CVE lookup, pattern matching, CVSS scoring", state: "Waiting" },
    { order: "04", key: "kb", stage: "KB lookup", detail: "Searching knowledgebase for exploit scripts", state: "Waiting" },
    { order: "05", key: "generate", stage: "LLM script generator", detail: "Generating missing scripts via LLM API", state: "Waiting" },
    { order: "06", key: "sandbox", stage: "Sandbox executor", detail: "Isolated exploit execution against target", state: "Waiting" },
    { order: "07", key: "report", stage: "Report generator", detail: "Aggregating findings, CVSS, remediation", state: "Waiting" },
    { order: "08", key: "validator", stage: "Script validator", detail: "Validation and final status confirmation", state: "Waiting" },
];

function formatEventTime(value: string | null): string {
    if (!value) return "[--:--:--]";
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "[--:--:--]";
    return `[${dt.toLocaleTimeString([], { hour12: false })}]`;
}

function buildLogText(event: AiScannerLiveEvent): string {
    const level = (event.level || "info").toUpperCase();
    const stage = event.stage ? `[${event.stage}]` : "[general]";
    return `${level} ${stage} ${event.message}`;
}

function mergeEvents(prev: AiScannerLiveEvent[], incoming: AiScannerLiveEvent[]): AiScannerLiveEvent[] {
    const merged = [...prev, ...incoming];
    const seen = new Set<number>();
    const deduped: AiScannerLiveEvent[] = [];

    for (const event of merged) {
        if (seen.has(event.id)) continue;
        seen.add(event.id);
        deduped.push(event);
    }

    return deduped.slice(-300);
}

export default function PipelinePage() {
    const searchParams = useSearchParams();
    const requestedJobId = (searchParams.get("job_id") || "").trim();

    const [pipelineRows, setPipelineRows] = useState<AiScannerPipelineRow[]>(FALLBACK_ROWS);
    const [events, setEvents] = useState<AiScannerLiveEvent[]>([]);
    const [job, setJob] = useState<AiScannerJob | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const latestEventIdRef = useRef<number>(0);

    const pollLiveData = useCallback(async () => {
        try {
            const payload = requestedJobId
                ? await AiScannerPipelineService.getJobLive(requestedJobId, latestEventIdRef.current || undefined)
                : await AiScannerPipelineService.getActive(undefined, latestEventIdRef.current || undefined);

            setJob(payload.job);
            setPipelineRows(payload.pipeline?.length ? payload.pipeline : FALLBACK_ROWS);
            setIsActive(Boolean(payload.is_active));

            if (payload.events?.length) {
                setEvents((prev) => mergeEvents(prev, payload.events));
                const lastEvent = payload.events.at(-1);
                if (lastEvent) {
                    latestEventIdRef.current = lastEvent.id;
                }
            }

            setFetchError(null);
        } catch (error: any) {
            setFetchError(error?.message || "Failed to fetch live pipeline data");
        } finally {
            setIsLoading(false);
        }
    }, [requestedJobId]);

    useEffect(() => {
        latestEventIdRef.current = 0;
        setEvents([]);
        setPipelineRows(FALLBACK_ROWS);
        setIsLoading(true);
        setFetchError(null);
    }, [requestedJobId]);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            if (!mounted) return;
            await pollLiveData();
        };

        void load();
        const timer = globalThis.setInterval(() => {
            void load();
        }, 2000);

        return () => {
            mounted = false;
            globalThis.clearInterval(timer);
        };
    }, [pollLiveData]);

    const statusText = useMemo(() => {
        if (!job) return "No active job";
        const rawStatus = (job.status || "unknown").toLowerCase();
        if (rawStatus === "running" || rawStatus === "created") return "Active";
        if (rawStatus === "finished" || rawStatus === "completed") return "Completed";
        if (rawStatus === "failed") return "Failed";
        return rawStatus;
    }, [job]);

    const renderedLogs = useMemo(() => {
        if (!events.length) {
            return [{ key: "system-ready", at: "[--:--:--]", text: "System ready. Launch a scan to begin." }];
        }
        return events.slice(-180).map((event) => ({
            key: `event-${event.id}`,
            at: formatEventTime(event.created_at),
            text: buildLogText(event),
        }));
    }, [events]);

    const activePipelineLabel = useMemo(() => {
        if (!job) return "No active job";
        if (!job.stage) return statusText;
        return `${statusText} • ${job.stage}`;
    }, [job, statusText]);

    const heartbeatText = useMemo(() => {
        if (isLoading) return "Loading live feed...";
        if (isActive) return "Waiting for next event...";
        return "Job is not active";
    }, [isLoading, isActive]);

    return (
        <div className="page-padding section-spacing">
            <div className="page-header">
                <div>
                    <h1 className="text-page-title">Pipeline Dashboard</h1>
                    <p className="text-small mt-0.5">Real-time pipeline overview</p>
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

            <section className="card mb-5">
                <div className="card-padding border-b border-purple-100 flex items-center justify-between gap-3">
                    <h2 className="text-card-title tracking-[0.08em] uppercase">Active Pipeline</h2>
                    <p className="text-[11px] font-semibold text-cyan-600">
                        {activePipelineLabel}
                    </p>
                </div>

                {job && (
                    <div className="px-4 pt-3 text-[11px] text-gray-500 border-b border-purple-50 pb-3">
                        <span className="font-semibold text-gray-700">Job:</span> {job.job_name || job.id}
                    </div>
                )}

                <div className="px-2 md:px-4 pb-4 md:pb-5">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[760px]">
                            <thead>
                                <tr className="text-left text-[10px] tracking-[0.08em] uppercase text-gray-400">
                                    <th className="py-2 px-3 font-semibold">ID</th>
                                    <th className="py-2 px-3 font-semibold">Stage</th>
                                    <th className="py-2 px-3 font-semibold">Description</th>
                                    <th className="py-2 px-3 font-semibold text-right">State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pipelineRows.map((step) => (
                                    <tr key={`${step.key || step.order}-${step.stage}`} className="border-b border-purple-50 last:border-b-0 hover:bg-indigo-50/40 transition-colors">
                                        <td className="py-3 px-3 text-xs font-mono text-gray-500">{step.order}</td>
                                        <td className="py-3 px-3 text-xs font-semibold text-gray-800">{step.stage}</td>
                                        <td className="py-3 px-3 text-xs text-gray-500">{step.detail}</td>
                                        <td className="py-3 px-3 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${badgeStyle[step.state]}`}>
                                                {step.state}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden space-y-2">
                        {pipelineRows.map((step) => (
                            <div key={`${step.key || step.order}-${step.stage}`} className="rounded-lg border border-purple-100 px-3 py-2 bg-white">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold text-gray-800">
                                        <span className="text-gray-400 mr-2 font-mono">{step.order}</span>
                                        {step.stage}
                                    </p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeStyle[step.state]}`}>
                                        {step.state}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1">{step.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="card">
                <div className="card-padding border-b border-purple-100 flex items-center justify-between gap-3">
                    <h2 className="text-card-title tracking-[0.08em] uppercase">Live Log Feed</h2>
                    <p className="text-[11px] text-gray-500">poll every 2s</p>
                </div>

                <div className="p-3 md:p-4 lg:p-5">
                    <div className="min-h-40 md:min-h-52 rounded-lg border border-indigo-100 bg-gradient-to-b from-slate-100 to-slate-50 p-3 md:p-4 font-mono text-[11px] text-slate-600 space-y-1.5">
                        {fetchError && (
                            <p className="text-red-600">{fetchError}</p>
                        )}

                        {renderedLogs.map((line) => (
                            <p key={line.key}>
                                <span className="text-cyan-700">{line.at}</span>
                                <span className="text-slate-500"> :: </span>
                                {line.text}
                            </p>
                        ))}
                        <p className="inline-flex items-center gap-1 text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            {heartbeatText}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
