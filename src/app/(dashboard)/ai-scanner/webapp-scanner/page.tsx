"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ZapService } from "@/services/zap.service";

export default function WebAppScannerPage() {
    const router = useRouter();
    const [mode, setMode] = useState("standard");
    const [targetUrl, setTargetUrl] = useState("");
    const [targetPort, setTargetPort] = useState("");
    // ZAP address/port are handled server-side; do not show in UI
    const [error, setError] = useState<string | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const [output, setOutput] = useState<string>("");
    const [polling, setPolling] = useState(false);
    const [reportAvailable, setReportAvailable] = useState(false);
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

    useEffect(() => {
        let es: EventSource | null = null;
        if (jobId) {
            setOutput("");
            const url = `${apiBase}/api/zap/jobs/${encodeURIComponent(jobId)}/stream/`;
            // EventSource in browsers may accept an options object with `withCredentials`.
            // TypeScript defs may not include it, so cast to any.
            const EventSourceCtor: any = (window as any).EventSource;
            const instance: any = new EventSourceCtor(url, { withCredentials: true });
            es = instance;
            instance.onmessage = (e: any) => {
                setOutput((s) => s + e.data + "\n");
            };
            instance.addEventListener('report', () => {
                // report ready
                setPolling(false);
                setReportAvailable(true);
            });
            instance.onerror = () => {
                // try reconnects handled by browser; if closed, stop polling flag
            };
            setPolling(true);
        }

        return () => {
            if (es) {
                try { es.close(); } catch (e) {}
            }
        };
    }, [jobId]);

    const startScan = async () => {
        setError(null);
        setOutput("");
        if (!targetUrl.trim()) {
            setError("URL to attack is required");
            return;
        }
        if (!targetPort.trim()) {
            setError("Port number is required");
            return;
        }

        try {
            // Log payload
            console.log("Starting ZAP scan", { mode, target: targetUrl, target_port: targetPort });
            const resp = await ZapService.startScan({
                mode,
                target: targetUrl,
                target_port: targetPort,
            });
            if (!resp.success) throw new Error(resp.error || "Failed to start scan");
            setJobId(resp.job_id);
            setPolling(true);
        } catch (e: any) {
            setError(e?.message || String(e));
        }
    };

    return (
        <div className="page-padding section-spacing">
            <div className="page-header">
                <div>
                    <h1 className="text-page-title">WebApp Scanner</h1>
                    <p className="text-small mt-0.5">Start a ZAP web-application scan against a target URL and port</p>
                </div>
            </div>

            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="card">
                <div className="card-padding grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mode</label>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200"
                        >
                            <option value="standard">Standard Mode</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">URL to attack</label>
                        <input value={targetUrl} onChange={(e)=>setTargetUrl(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200" placeholder="example.com or https://example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Port number</label>
                        <input value={targetPort} onChange={(e)=>setTargetPort(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200" placeholder="80" />
                    </div>
                    {/* ZAP address/port intentionally hidden from UI; backend uses defaults */}
                </div>

                <div className="p-4 border-t flex items-center justify-end gap-3">
                    <button onClick={()=>router.back()} className="px-4 py-2 rounded-lg border bg-white">Cancel</button>
                    <button onClick={startScan} className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">Start Scan</button>
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-padding">
                    <h3 className="text-sm font-semibold">Scan Output</h3>
                    <div className="mt-2 bg-black text-white p-3 rounded-sm font-mono text-sm whitespace-pre-wrap h-64 overflow-auto">
                        {output || "No output yet"}
                    </div>
                    {reportAvailable && jobId && (
                        <div className="mt-3">
                            <a href={`${apiBase}/api/zap/jobs/${encodeURIComponent(jobId)}/report/`} className="inline-block px-4 py-2 rounded-lg bg-green-600 text-white">Download Report</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
