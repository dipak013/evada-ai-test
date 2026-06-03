"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AiScannerLaunchService } from "@/services/ai-scanner-launch.service";

type LogSource = "file" | "api" | "blob";

const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
const FALLBACK_LLMS = ["OpenAI GPT-4"] as const;

const priorityBadge: Record<string, string> = {
    Low:      "bg-blue-100   text-blue-700   border-blue-200",
    Medium:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    High:     "bg-orange-100 text-orange-700 border-orange-200",
    Critical: "bg-red-100    text-red-700    border-red-200",
};
//blank commit

const priorityDot: Record<string, string> = {
    Low:      "bg-blue-400",
    Medium:   "bg-yellow-400",
    High:     "bg-orange-400",
    Critical: "bg-red-500",
};

export default function NewScanPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [jobName,          setJobName]          = useState("SCAN-2024-001");
    const [priority,         setPriority]         = useState<(typeof PRIORITIES)[number]>("Medium");
    const [logSource,        setLogSource]        = useState<LogSource>("file");
    const [droppedFile,      setDroppedFile]      = useState<File | null>(null);
    const [isDragging,       setIsDragging]       = useState(false);
    const [fallbackLlm,      setFallbackLlm]      = useState<(typeof FALLBACK_LLMS)[number]>("OpenAI GPT-4");
    const [sandboxTarget,    setSandboxTarget]    = useState("");
    const [isLaunching,      setIsLaunching]      = useState(false);
    const [launchError,      setLaunchError]      = useState<string | null>(null);
    const [launchSuccess,    setLaunchSuccess]    = useState<string | null>(null);

    const validateAndSetJsonFile = useCallback((file: File | null) => {
        if (!file) return;
        const isJson = file.name.toLowerCase().endsWith(".json") || file.type === "application/json";
        if (!isJson) {
            setDroppedFile(null);
            setLaunchSuccess(null);
            setLaunchError("Only one JSON file is allowed.");
            return;
        }
        setLaunchError(null);
        setLaunchSuccess(null);
        setDroppedFile(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;
        if (files.length > 1) {
            setDroppedFile(null);
            setLaunchSuccess(null);
            setLaunchError("Upload exactly one JSON file.");
            return;
        }
        validateAndSetJsonFile(files[0]);
    }, [validateAndSetJsonFile]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => setIsDragging(false), []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        validateAndSetJsonFile(file || null);
    };

    const handleLaunch = async () => {
        if (logSource !== "file") {
            setLaunchSuccess(null);
            setLaunchError("This flow supports File Upload only.");
            return;
        }
        if (!droppedFile) {
            setLaunchSuccess(null);
            setLaunchError("Please upload one JSON file before launching.");
            return;
        }
        if (!sandboxTarget.trim()) {
            setLaunchSuccess(null);
            setLaunchError("Please provide a sandbox target before launching.");
            return;
        }

        setLaunchError(null);
        setLaunchSuccess(null);
        setIsLaunching(true);
        try {
            const response = await AiScannerLaunchService.launch(droppedFile, {
                jobName,
                sandboxTarget,
            });

            if (!response.success) {
                throw new Error(response.error || "Failed to launch AI Pentester");
            }

            const jobId = response.data?.job_id;
            setLaunchSuccess("Scan started. Opening live pipeline monitor...");
            if (jobId) {
                router.push(`/ai-scanner/pipeline?job_id=${encodeURIComponent(jobId)}`);
            } else {
                router.push("/ai-scanner/pipeline");
            }
        } catch (error: any) {
            setLaunchError(error?.message || "Failed to launch scan");
        } finally {
            setIsLaunching(false);
        }
    };

    const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
    const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-400";
    const selectCls = "w-full px-3 py-2.5 pr-9 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all appearance-none cursor-pointer";

    const logSourceMeta: Record<LogSource, { label: string; sub: string; icon: React.ReactNode }> = {
        file: {
            label: "File Upload",
            sub: "Browse local file",
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />,
        },
        api: {
            label: "API Endpoint",
            sub: "REST / Webhook",
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />,
        },
        blob: {
            label: "Blob / S3",
            sub: "Cloud storage",
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />,
        },
    };

    /* Drop-zone class helper without nested ternaries */
    let dropZoneCls = "border-gray-200 bg-gray-50/60 hover:border-indigo-300 hover:bg-indigo-50/30";
    if (isDragging) dropZoneCls = "border-indigo-400 bg-indigo-50";
    else if (droppedFile) dropZoneCls = "border-green-400 bg-green-50";

    let fileValue = "N/A";
    if (logSource === "file") fileValue = droppedFile ? droppedFile.name : "Not selected";

    const summaryRows = [
        { label: "Job Name",           value: jobName || "—" },
        { label: "Priority",           value: priority },
        { label: "Log Source",         value: logSourceMeta[logSource].label },
        { label: "File",               value: fileValue },
        { label: "Fallback LLM",       value: fallbackLlm },
        { label: "Sandbox Target",     value: sandboxTarget || "—" },
    ];

    return (
        <div className="page-padding section-spacing">
            {/* ── Page Header ───────────────────────────────────────────── */}
            <div className="page-header">
                <div>
                    <h1 className="text-page-title">New Scan Job</h1>
                    <p className="text-small mt-0.5">Configure and launch a new AI-assisted penetration test</p>
                </div>
                <div className="flex w-full sm:w-auto items-stretch sm:items-center gap-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleLaunch}
                        disabled={isLaunching}
                        className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-70 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        {isLaunching ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                                <span>Launching...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                                </svg>
                                Launch Scan
                            </>
                        )}
                    </button>
                </div>
            </div>

            {launchError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {launchError}
                </div>
            )}

            {launchSuccess && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {launchSuccess}
                </div>
            )}

            {/* ── Two-Column Layout ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5">

                {/* ── LEFT: Form (2/3 width on xl) ──────────────────────── */}
                <div className="xl:col-span-2 space-y-4">

                    {/* Job Details */}
                    <div className="card">
                        {/* Card heading stripe */}
                        <div className="px-4 md:px-5 py-3 border-b border-purple-100 flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <span className="text-card-title">Job Details</span>
                        </div>
                        <div className="card-padding grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="job-name" className={labelCls}>Job Name</label>
                                <input
                                    id="job-name"
                                    type="text"
                                    value={jobName}
                                    onChange={(e) => setJobName(e.target.value)}
                                    className={inputCls}
                                    placeholder="e.g. SCAN-2024-001"
                                />
                            </div>
                            <div>
                                <label htmlFor="priority" className={labelCls}>Priority</label>
                                <div className="relative">
                                    <select
                                        id="priority"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as typeof priority)}
                                        className={selectCls}
                                    >
                                        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                                {/* Inline priority badge */}
                                <div className="mt-2">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityBadge[priority]}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[priority]}`}></span>
                                        {priority} Priority
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Log Source */}
                    <div className="card">
                        <div className="px-4 md:px-5 py-3 border-b border-purple-100 flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 6c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                </svg>
                            </div>
                            <span className="text-card-title">Log Source</span>
                        </div>
                        <div className="card-padding space-y-4">
                            {/* Source type selector */}
                            <div className="grid grid-cols-3 gap-3">
                                {(Object.keys(logSourceMeta) as LogSource[]).map((src) => {
                                    const m = logSourceMeta[src];
                                    const active = logSource === src;
                                    return (
                                        <button
                                            key={src}
                                            type="button"
                                            onClick={() => setLogSource(src)}
                                            className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all ${
                                                active
                                                    ? "border-indigo-400 bg-gradient-to-b from-indigo-50 to-purple-50 shadow-sm"
                                                    : "border-gray-200 bg-gray-50 hover:border-purple-200 hover:bg-purple-50/40"
                                            }`}
                                        >
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? "bg-gradient-to-br from-indigo-100 to-purple-100" : "bg-white border border-gray-200"}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400"}`}>
                                                    {m.icon}
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-[11px] font-bold uppercase tracking-wide leading-tight ${active ? "text-indigo-700" : "text-gray-500"}`}>{m.label}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{m.sub}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* File drop zone */}
                            {logSource === "file" && (
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center gap-3 py-8 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${dropZoneCls}`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    <input
                                        id="file-upload"
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".json,application/json"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${droppedFile ? "bg-green-100" : "bg-white border border-indigo-100"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${droppedFile ? "text-green-600" : "text-indigo-500"}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    {droppedFile ? (
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-green-700">{droppedFile.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{(droppedFile.size / 1024).toFixed(1)} KB · Ready to scan</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Drop file here or <span className="text-indigo-600 font-semibold">click to browse</span></p>
                                            <p className="text-xs text-gray-400 mt-1">Only one .json file</p>
                                        </div>
                                    )}
                                </label>
                            )}

                            {logSource === "api" && (
                                <div>
                                    <label htmlFor="api-endpoint" className={labelCls}>API Endpoint URL</label>
                                    <input id="api-endpoint" type="url" className={inputCls} placeholder="https://api.example.com/webhook/scan-logs" />
                                </div>
                            )}

                            {logSource === "blob" && (
                                <div>
                                    <label htmlFor="blob-uri" className={labelCls}>Storage URI</label>
                                    <input id="blob-uri" type="text" className={inputCls} placeholder="s3://my-bucket/path/to/logs" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Engine Configuration */}
                    <div className="card">
                        <div className="px-4 md:px-5 py-3 border-b border-purple-100 flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                                </svg>
                            </div>
                            <span className="text-card-title">Engine Configuration</span>
                        </div>
                        <div className="card-padding grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fallback-llm" className={labelCls}>Fallback LLM</label>
                                <div className="relative">
                                    <select id="fallback-llm" value={fallbackLlm} onChange={(e) => setFallbackLlm(e.target.value as typeof fallbackLlm)} className={selectCls}>
                                        {FALLBACK_LLMS.map((l) => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="sandbox-target" className={labelCls}>Sandbox Target</label>
                                <input
                                    id="sandbox-target"
                                    type="text"
                                    value={sandboxTarget}
                                    onChange={(e) => setSandboxTarget(e.target.value)}
                                    className={inputCls}
                                    placeholder="Enter target URL"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Summary Panel (1/3 width on xl) ────────────── */}
                <div className="space-y-4">

                    {/* Job Summary */}
                    <div className="card">
                        <div className="px-4 md:px-5 py-3 border-b border-purple-100 flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </div>
                            <span className="text-card-title">Job Summary</span>
                        </div>
                        <div className="card-padding">
                            <ul className="space-y-3">
                                {summaryRows.map((row) => (
                                    <li key={row.label} className="flex items-start justify-between gap-3">
                                        <span className="text-xs text-gray-500 flex-shrink-0 pt-0.5">{row.label}</span>
                                        <span className="text-xs font-semibold text-gray-800 text-right break-all">{row.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="card">
                        <div className="px-4 md:px-5 py-3 border-b border-purple-100 flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <span className="text-card-title">Pre-launch Checklist</span>
                        </div>
                        <div className="card-padding space-y-2.5">
                            {[
                                { label: "Job name provided",     ok: !!jobName.trim() },
                                { label: "Log source selected",   ok: true },
                                { label: "JSON file attached",    ok: logSource !== "file" || !!droppedFile },
                                { label: "Sandbox target set",    ok: !!sandboxTarget.trim() },
                                { label: "LLM configured",        ok: true },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2.5">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.ok ? "bg-green-100" : "bg-gray-100"}`}>
                                        {item.ok ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-green-600">
                                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        )}
                                    </div>
                                    <span className={`text-xs ${item.ok ? "text-gray-700" : "text-gray-400"}`}>{item.label}</span>
                                </div>
                            ))}
                            {/* Launch readiness */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                {[!!jobName.trim(), !!sandboxTarget.trim(), logSource !== "file" || !!droppedFile].every(Boolean) ? (
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"></span>
                                        <span className="text-xs font-semibold text-green-700">Ready to launch</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></span>
                                        <span className="text-xs font-semibold text-yellow-700">Complete checklist above</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 flex gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                            Once launched, findings are automatically published to the <span className="font-semibold">Vulnerabilities</span> dashboard and correlated against the active threat pipeline.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
