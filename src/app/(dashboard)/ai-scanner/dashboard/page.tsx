"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AiScannerReportsDashboardPayload, AiScannerReportsService } from "@/services/ai-scanner-reports.service";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
} from "recharts";

type TooltipState = {
    clientX: number;
    clientY: number;
    nearRight: boolean;
    nearBottom: boolean;
    month: string;
    items: { key: string; label: string; color: string; value: number }[];
    total: number;
};

const severityColors: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-700 border border-red-200",
    HIGH: "bg-orange-100 text-orange-700 border border-orange-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    LOW: "bg-blue-100 text-blue-700 border border-blue-200",
};

const statusColors: Record<string, string> = {
    Open: "text-red-600",
    "In Review": "text-orange-500",
    Patched: "text-green-600",
    Accepted: "text-gray-500",
};

const PAGE_SIZE = 10;
const RECURRENCE_PAGE_SIZE = 8;

type PageEntry = { key: string; val: number | "..." };

type TargetRiskBucket = {
    target: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
    exploitable: number;
    weightedRisk: number;
};

function getSeverityWeight(severity: string): number {
    if (severity === "CRITICAL") return 1.4;
    if (severity === "HIGH") return 1.25;
    if (severity === "MEDIUM") return 1.1;
    return 1;
}

function getSeverityLabel(name: string): string {
    const normalized = String(name || "").trim().toLowerCase();
    if (normalized === "critical") return "Critical";
    if (normalized === "high") return "High";
    if (normalized === "medium") return "Medium";
    if (normalized === "low") return "Low";
    return String(name || "Severity");
}

function renderBlastRadiusTooltip({ active, payload, label }: { active?: boolean; payload?: readonly any[]; label?: string | number }) {
    if (!active || !payload || payload.length === 0) return null;

    const severityOrder: Record<string, number> = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
    };

    const rows = payload
        .filter((item) => item?.dataKey)
        .sort((a, b) => {
            const aRank = severityOrder[String(a.dataKey).toLowerCase()] ?? 99;
            const bRank = severityOrder[String(b.dataKey).toLowerCase()] ?? 99;
            return aRank - bRank;
        });

    const title = String(label || "-");
    const shortTitle = title.length > 36 ? `${title.slice(0, 36)}...` : title;

    return (
        <div
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 shadow-lg"
            style={{ minWidth: "170px", maxWidth: "240px" }}
        >
            <p className="mb-1 text-[11px] font-semibold text-slate-900">{shortTitle}</p>
            <div className="space-y-0.5">
                {rows.map((item, index) => (
                    <div key={`${item.dataKey}-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>{getSeverityLabel(String(item.dataKey))}</span>
                        </div>
                        <span className="font-semibold text-slate-800">{Number(item.value || 0)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderRiskQuadrantTooltip({ active, payload }: { active?: boolean; payload?: readonly any[] }) {
    if (!active || !payload || payload.length === 0) return null;
    const point = payload[0]?.payload;
    if (!point) return null;

    return (
        <div className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[11px] shadow-md">
            <p className="font-semibold text-slate-900 mb-0.5">{String(point.cve || "CVE")}</p>
            <p className="text-slate-600">Severity: {getSeverityLabel(point.maxSeverity)}</p>
            <p className="text-slate-600">CVSS: {Number(point.cvss || 0).toFixed(1)}</p>
            <p className="text-slate-600">Age: {point.ageDays}d</p>
            <p className="text-slate-600">Count: {point.count}</p>
        </div>
    );
}

function createTargetRiskBucket(target: string): TargetRiskBucket {
    return {
        target,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        exploitable: 0,
        weightedRisk: 0,
    };
}

function parseDateSafe(raw: string | null | undefined): Date | null {
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function monthKeyFromDate(raw: string | null | undefined): string | null {
    const dt = parseDateSafe(raw);
    if (!dt) return null;
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    return `${dt.getFullYear()}-${month}`;
}

function formatMonthKey(monthKey: string): string {
    const [year, month] = monthKey.split("-");
    if (!year || !month) return monthKey;
    const dt = new Date(Number(year), Number(month) - 1, 1);
    return dt.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

function getSeverityColorHex(severity: string): string {
    const normalized = String(severity || "").toUpperCase();
    if (normalized === "CRITICAL") return "#ef4444";
    if (normalized === "HIGH") return "#f97316";
    if (normalized === "MEDIUM") return "#eab308";
    return "#3b82f6";
}

function getSeverityRank(severity: string): number {
    const normalized = String(severity || "").toUpperCase();
    if (normalized === "CRITICAL") return 4;
    if (normalized === "HIGH") return 3;
    if (normalized === "MEDIUM") return 2;
    if (normalized === "LOW") return 1;
    return 0;
}

function escapeXml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function downloadPngFromContainer(containerId: string, fileName: string): void {
    const container = document.getElementById(containerId);
    const svg = container?.querySelector("svg");
    if (!svg) return;

    const cloned = svg.cloneNode(true) as SVGElement;
    cloned.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    cloned.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    const serializer = new XMLSerializer();
    const svgText = serializer.serializeToString(cloned);
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
        const width = Number(svg.getAttribute("width")) || svg.clientWidth || 1200;
        const height = Number(svg.getAttribute("height")) || svg.clientHeight || 700;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
            URL.revokeObjectURL(url);
            return;
        }
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        canvas.toBlob((pngBlob) => {
            if (!pngBlob) {
                URL.revokeObjectURL(url);
                return;
            }
            const pngUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = `${fileName}.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
            URL.revokeObjectURL(url);
        }, "image/png");
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
}

function downloadRecurrenceTableImage(
    fileName: string,
    rows: Array<{ cve: string; counts: number[] }>,
    monthKeys: string[]
): void {
    const colWidth = 88;
    const cveColWidth = 180;
    const rowHeight = 24;
    const width = cveColWidth + monthKeys.length * colWidth + 24;
    const height = 56 + rows.length * rowHeight;

    const headerMonths = monthKeys
        .map((month, idx) => `<text x="${cveColWidth + idx * colWidth + 14}" y="36" font-size="10" fill="#64748b">${escapeXml(formatMonthKey(month))}</text>`)
        .join("");

    const bodyRows = rows
        .map((row, rowIdx) => {
            const y = 56 + rowIdx * rowHeight;
            const cells = row.counts
                .map((count, colIdx) => {
                    const x = cveColWidth + colIdx * colWidth;
                    const alpha = Math.max(0.14, Math.min(1, count / 8));
                    return `<rect x="${x}" y="${y - 14}" width="${colWidth - 4}" height="18" rx="4" fill="rgba(59,130,246,${alpha})" /><text x="${x + 10}" y="${y}" font-size="10" fill="#0f172a">${count}</text>`;
                })
                .join("");
            return `<text x="10" y="${y}" font-size="10" fill="#334155">${escapeXml(row.cve.slice(0, 28))}</text>${cells}`;
        })
        .join("");

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="10" y="20" font-size="12" font-weight="700" fill="#0f172a">CVE Recurrence Heat Strip</text>
  <text x="10" y="36" font-size="10" fill="#64748b">CVE</text>
  ${headerMonths}
  ${bodyRows}
</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
            URL.revokeObjectURL(url);
            return;
        }
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        canvas.toBlob((pngBlob) => {
            if (!pngBlob) {
                URL.revokeObjectURL(url);
                return;
            }
            const pngUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = `${fileName}.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
            URL.revokeObjectURL(url);
        }, "image/png");
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
}

function downloadRecurrenceTableExcel(
    fileName: string,
    rows: Array<{ cve: string; counts: number[] }>,
    monthKeys: string[]
): void {
    const monthHeaders = monthKeys.map((month) => "<th>" + escapeXml(formatMonthKey(month)) + "</th>").join("");
    const body = rows
        .map((row) => {
            const cells = row.counts.map((count) => "<td>" + String(count) + "</td>").join("");
            return "<tr><td>" + escapeXml(row.cve) + "</td>" + cells + "</tr>";
        })
        .join("");

    const tableHtml = "<table><thead><tr><th>CVE</th>" + monthHeaders + "</tr></thead><tbody>" + body + "</tbody></table>";
    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xls`;
    a.click();
    URL.revokeObjectURL(url);
}

function openRecurrenceTablePrintView(rows: Array<{ cve: string; counts: number[] }>, monthKeys: string[]): void {
    const monthHeaders = monthKeys.map((month) => "<th>" + escapeXml(formatMonthKey(month)) + "</th>").join("");
    const body = rows
        .map((row) => {
            const cells = row.counts.map((count) => "<td>" + String(count) + "</td>").join("");
            return "<tr><td>" + escapeXml(row.cve) + "</td>" + cells + "</tr>";
        })
        .join("");

    const popup = window.open("", "_blank", "width=1000,height=720");
    if (!popup) {
        window.alert("Unable to open PDF preview. Please allow popups for this site and try again.");
        return;
    }

    const html =
        "<html><head><title>CVE Recurrence Table</title><style>" +
        "body { font-family: Arial, sans-serif; padding: 16px; }" +
        "h1 { font-size: 16px; margin: 0 0 12px 0; }" +
        "table { border-collapse: collapse; width: 100%; font-size: 12px; }" +
        "th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }" +
        "th { background: #f1f5f9; }" +
        "</style></head><body>" +
        "<h1>CVE Recurrence Heat Strip</h1>" +
        "<table><thead><tr><th>CVE</th>" + monthHeaders + "</tr></thead><tbody>" + body + "</tbody></table>" +
        "<script>window.onload = () => { window.focus(); window.print(); };</script>" +
        "</body></html>";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const printUrl = URL.createObjectURL(blob);
    popup.location.href = printUrl;
    popup.addEventListener("beforeunload", () => URL.revokeObjectURL(printUrl), { once: true });
}

function downloadThreatTableExcel(
    fileName: string,
    rows: Array<any>
): void {
    const headers = ["Job ID", "CVE", "Title", "Target", "Severity", "Status", "Vulnerable", "Discovered"];
    const headerHtml = headers.map((header) => "<th>" + escapeXml(header) + "</th>").join("");
    const body = rows
        .map((row) => {
            const cells = [
                row.job_id,
                row.cve,
                row.title,
                row.target || row.affected || "-",
                row.severity,
                row.status,
                row.exploitable ? "Yes" : "No",
                row.report_generated || "-",
            ].map((value) => "<td>" + escapeXml(String(value ?? "")) + "</td>").join("");
            return "<tr>" + cells + "</tr>";
        })
        .join("");
    const tableHtml = "<table><thead><tr>" + headerHtml + "</tr></thead><tbody>" + body + "</tbody></table>";
    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xls`;
    a.click();
    URL.revokeObjectURL(url);
}

function openThreatTablePrintView(rows: Array<any>): void {
    const headers = ["Job ID", "CVE", "Title", "Target", "Severity", "Status", "Vulnerable", "Discovered"];
    const headerHtml = headers.map((header) => "<th>" + escapeXml(header) + "</th>").join("");
    const body = rows
        .map((row) => {
            const cells = [
                row.job_id,
                row.cve,
                row.title,
                row.target || row.affected || "-",
                row.severity,
                row.status,
                row.exploitable ? "Yes" : "No",
                row.report_generated || "-",
            ].map((value) => "<td>" + escapeXml(String(value ?? "")) + "</td>").join("");
            return "<tr>" + cells + "</tr>";
        })
        .join("");

    const popup = window.open("", "_blank", "width=1200,height=760");
    if (!popup) {
        window.alert("Unable to open PDF preview. Please allow popups for this site and try again.");
        return;
    }
    const html =
        "<html><head><title>Recent Threat Activity</title><style>" +
        "body { font-family: Arial, sans-serif; padding: 16px; }" +
        "h1 { font-size: 16px; margin: 0 0 12px 0; }" +
        "table { border-collapse: collapse; width: 100%; font-size: 11px; }" +
        "th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; vertical-align: top; }" +
        "th { background: #f1f5f9; }" +
        "</style></head><body>" +
        "<h1>Recent Threat Activity</h1>" +
        "<table><thead><tr>" + headerHtml + "</tr></thead><tbody>" + body + "</tbody></table>" +
        "<script>window.onload = () => { window.focus(); window.print(); };</script>" +
        "</body></html>";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const printUrl = URL.createObjectURL(blob);
    popup.location.href = printUrl;
    popup.addEventListener("beforeunload", () => URL.revokeObjectURL(printUrl), { once: true });
}

function getPageNumbers(current: number, total: number): PageEntry[] {
    const entry = (val: number | "...", key: string): PageEntry => ({ key, val });
    if (total <= 7) return Array.from({ length: total }, (_, i) => entry(i + 1, `p-${i + 1}`));
    const pages: PageEntry[] = [entry(1, "p-1")];
    if (current > 3) pages.push(entry("...", "ellipsis-left"));
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let p = start; p <= end; p++) pages.push(entry(p, `p-${p}`));
    if (current < total - 2) pages.push(entry("...", "ellipsis-right"));
    pages.push(entry(total, `p-${total}`));
    return pages;
}

export default function AiScannerDashboardPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [recurrencePage, setRecurrencePage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [dashboard, setDashboard] = useState<AiScannerReportsDashboardPayload | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                setIsLoading(true);
                const payload = await AiScannerReportsService.getDashboard();
                if (cancelled) return;
                setDashboard(payload);
                setLoadError(null);
            } catch (error: any) {
                if (cancelled) return;
                setLoadError(error?.response?.data?.error || error?.message || "Failed to load dashboard data");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    const vulnerabilities = dashboard?.latest_vulnerabilities || [];
    const severityDistribution = dashboard?.severity_distribution || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, total: 0 };
    const vulnerabilityCards = dashboard?.vulnerability_cards || {
        total_cves_tracked: 0,
        active_exploits: 0,
        intel_sources: 0,
        avg_risk_score: 0,
    };
    const trendSeries = dashboard?.vulnerability_monthly || [];

    const filtered = useMemo(() => {
        return vulnerabilities
            .filter((r: any) => {
                const q = searchQuery.toLowerCase().trim();
                if (!q) return true;

                const tableText = [
                    r.job_id,
                    r.cve,
                    r.title,
                    r.target || r.affected,
                    r.severity,
                    r.status,
                    r.exploitable ? "yes" : "no",
                    r.report_generated,
                ]
                    .map((value) => String(value || "").toLowerCase())
                    .join(" ");

                return tableText.includes(q);
            })
            .sort((a: any, b: any) => {
                const aTs = a.report_generated ? Date.parse(a.report_generated) : 0;
                const bTs = b.report_generated ? Date.parse(b.report_generated) : 0;
                if (bTs !== aTs) return bTs - aTs;
                return (b.cvss || 0) - (a.cvss || 0);
            });
    }, [vulnerabilities, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const showFrom = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const showTo = Math.min(currentPage * PAGE_SIZE, filtered.length);

    const months = trendSeries.map((item: any) => item.label || "-");
    const rawMax = Math.max(
        1,
        ...trendSeries.flatMap((item: any) => [
            item.CRITICAL || 0,
            item.HIGH || 0,
            item.MEDIUM || 0,
            item.LOW || 0,
        ])
    );
    // Round up to a nice tick ceiling
    const niceMax = (() => {
        if (rawMax <= 5) return 5;
        if (rawMax <= 10) return 10;
        const mag = Math.pow(10, Math.floor(Math.log10(rawMax)));
        return Math.ceil(rawMax / mag) * mag;
    })();
    const maxVal = niceMax;
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);

    const CHART_SEVERITIES = [
        { key: "CRITICAL", label: "Critical", color: "#ef4444" },
        { key: "HIGH",     label: "High",     color: "#f97316" },
        { key: "MEDIUM",   label: "Medium",   color: "#eab308" },
        { key: "LOW",      label: "Low",      color: "#3b82f6" },
    ] as const;
    const CHART_LEFT = 48, CHART_RIGHT = 592, CHART_TOP = 10, CHART_BOTTOM = 160;
    const CHART_W = CHART_RIGHT - CHART_LEFT;
    const CHART_H = CHART_BOTTOM - CHART_TOP;
    const chartN = trendSeries.length;
    const xOf = (i: number) => CHART_LEFT + (chartN <= 1 ? CHART_W / 2 : (i * CHART_W) / (chartN - 1));
    const yOf = (v: number) => CHART_BOTTOM - (v / maxVal) * CHART_H;
    const Y_TICKS = [0, 1, 2, 3, 4].map(k => Math.round((maxVal * k) / 4));

    function handlePointHover(i: number, e: React.MouseEvent) {
        const monthData = trendSeries[i];
        const items = CHART_SEVERITIES.map(sv => ({
            key: sv.key, label: sv.label, color: sv.color,
            value: monthData[sv.key] || 0,
        }));
        setTooltip({
            clientX: e.clientX,
            clientY: e.clientY,
            nearRight: e.clientX > window.innerWidth * 0.7,
            nearBottom: e.clientY > window.innerHeight * 0.65,
            month: monthData.label || "-",
            items,
            total: items.reduce((acc, it) => acc + it.value, 0),
        });
    }

    const totalSeverity = Math.max(1, severityDistribution.total || 0);

    const targetBlastRadiusData = useMemo(() => {
        const buckets = new Map<string, TargetRiskBucket>();

        for (const vuln of vulnerabilities) {
            const target = (vuln.target || vuln.affected || "Unknown target").trim();
            if (!buckets.has(target)) buckets.set(target, createTargetRiskBucket(target));

            const row = buckets.get(target)!;
            if (vuln.severity === "CRITICAL") row.critical += 1;
            else if (vuln.severity === "HIGH") row.high += 1;
            else if (vuln.severity === "MEDIUM") row.medium += 1;
            else if (vuln.severity === "LOW") row.low += 1;

            if (vuln.exploitable) row.exploitable += 1;

            const cvss = Number(vuln.cvss || 0);
            const severityWeight = getSeverityWeight(vuln.severity || "");
            const exploitWeight = vuln.exploitable ? 1.2 : 1;
            row.weightedRisk += cvss * severityWeight * exploitWeight;
        }

        return Array.from(buckets.values())
            .sort((a, b) => {
                if (b.weightedRisk !== a.weightedRisk) return b.weightedRisk - a.weightedRisk;
                return a.target.localeCompare(b.target);
            })
            .slice(0, 7)
            .map((item) => ({
                ...item,
                weightedRisk: Number(item.weightedRisk.toFixed(1)),
            }));
    }, [vulnerabilities]);

    const blastRadiusChartHeight = useMemo(() => {
        const rows = Math.max(1, targetBlastRadiusData.length);
        return Math.min(340, Math.max(180, rows * 42 + 56));
    }, [targetBlastRadiusData.length]);

    const riskQuadrantData = useMemo(() => {
        const byCve = new Map<string, {
            cve: string;
            count: number;
            cvss: number;
            exploitableCount: number;
            maxSeverity: string;
            lastSeenTs: number;
        }>();

        for (const vuln of vulnerabilities) {
            const cve = String(vuln.cve || vuln.id || "UNKNOWN");
            const existing = byCve.get(cve) || {
                cve,
                count: 0,
                cvss: 0,
                exploitableCount: 0,
                maxSeverity: "LOW",
                lastSeenTs: 0,
            };
            existing.count += 1;
            existing.cvss = Math.max(existing.cvss, Number(vuln.cvss || 0));
            if (vuln.exploitable) existing.exploitableCount += 1;
            if (getSeverityRank(vuln.severity || "") > getSeverityRank(existing.maxSeverity)) {
                existing.maxSeverity = String(vuln.severity || "LOW");
            }

            const latestRef = parseDateSafe(vuln.report_generated || vuln.published)?.getTime() || 0;
            existing.lastSeenTs = Math.max(existing.lastSeenTs, latestRef);
            byCve.set(cve, existing);
        }

        const now = Date.now();
        return Array.from(byCve.values())
            .map((row) => {
                const ageDays = row.lastSeenTs > 0 ? Math.max(0, Math.round((now - row.lastSeenTs) / 86400000)) : 0;
                return {
                    ...row,
                    ageDays,
                    z: Math.min(24, 6 + row.count * 2 + row.exploitableCount),
                    color: getSeverityColorHex(row.maxSeverity),
                };
            })
            .sort((a, b) => {
                const bScore = b.cvss * b.count;
                const aScore = a.cvss * a.count;
                return bScore - aScore;
            })
            .slice(0, 50);
    }, [vulnerabilities]);

    const driftData = useMemo(() => {
        const grouped = new Map<string, { month: string; exploitable: number; nonExploitable: number; total: number }>();
        for (const vuln of vulnerabilities) {
            const key = monthKeyFromDate(vuln.report_generated || vuln.published);
            if (!key) continue;
            if (!grouped.has(key)) grouped.set(key, { month: formatMonthKey(key), exploitable: 0, nonExploitable: 0, total: 0 });
            const row = grouped.get(key)!;
            row.total += 1;
            if (vuln.exploitable) row.exploitable += 1;
            else row.nonExploitable += 1;
        }
        return Array.from(grouped.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([, value]) => value)
            .slice(-8);
    }, [vulnerabilities]);

    const recurrenceHeatmap = useMemo(() => {
        const monthKeys = Array.from(new Set(vulnerabilities
            .map((vuln) => monthKeyFromDate(vuln.report_generated || vuln.published))
            .filter(Boolean) as string[]))
            .sort((a, b) => a.localeCompare(b))
            .slice(-6);

        const cveTotals = new Map<string, number>();
        const cveMonthCounts = new Map<string, Map<string, number>>();
        for (const vuln of vulnerabilities) {
            const cve = String(vuln.cve || "UNKNOWN");
            const monthKey = monthKeyFromDate(vuln.report_generated || vuln.published);
            cveTotals.set(cve, (cveTotals.get(cve) || 0) + 1);
            if (!monthKey) continue;
            if (!cveMonthCounts.has(cve)) cveMonthCounts.set(cve, new Map<string, number>());
            const monthMap = cveMonthCounts.get(cve)!;
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
        }

        const topCves = Array.from(cveTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([cve, total]) => ({
                cve,
                total,
                counts: monthKeys.map((m) => cveMonthCounts.get(cve)?.get(m) || 0),
            }));

        const maxCell = Math.max(1, ...topCves.flatMap((row) => row.counts));
        return { monthKeys, rows: topCves, maxCell };
    }, [vulnerabilities]);

    const recurrenceTotalPages = Math.max(1, Math.ceil(recurrenceHeatmap.rows.length / RECURRENCE_PAGE_SIZE));
    const recurrenceRows = recurrenceHeatmap.rows.slice((recurrencePage - 1) * RECURRENCE_PAGE_SIZE, recurrencePage * RECURRENCE_PAGE_SIZE);

    useEffect(() => {
        setRecurrencePage(1);
    }, [recurrenceHeatmap.rows.length]);

    return (
        <div className="page-padding section-spacing">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-page-title">Dashboard</h1>
                    <p className="text-small mt-0.5">Real-time threat intelligence overview</p>
                </div>
                <div className="flex items-center w-full md:w-auto">
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
            </div>

            {(isLoading || loadError) && (
                <div className="card p-3 mb-4 text-xs">
                    {isLoading && <p className="text-gray-600">Loading dashboard data...</p>}
                    {loadError && <p className="text-red-600">{loadError}</p>}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-5">
                {[
                    { label: "Total CVEs Tracked", value: vulnerabilityCards.total_cves_tracked.toLocaleString(), change: "latest report set", icon: "shield", color: "from-red-400 to-red-600" },
                    { label: "Active Exploits", value: vulnerabilityCards.active_exploits.toLocaleString(), change: "vulnerable: yes", icon: "bolt", color: "from-orange-400 to-orange-600" },
                    { label: "Intel Sources", value: vulnerabilityCards.intel_sources.toLocaleString(), change: "distinct source_type", icon: "database", color: "from-indigo-400 to-indigo-600" },
                    { label: "Avg Risk Score", value: String(vulnerabilityCards.avg_risk_score), change: "avg CVSS", icon: "chart", color: "from-purple-400 to-purple-600" },
                ].map((stat) => (
                    <div key={stat.label} className="card p-3 md:p-4">
                        <div className="flex items-start gap-2">
                            <div className={`w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                    {stat.icon === "shield" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />}
                                    {stat.icon === "bolt" && <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />}
                                    {stat.icon === "database" && <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 6c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />}
                                    {stat.icon === "chart" && <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />}
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-[10px] md:text-xs text-gray-600 leading-tight">{stat.label}</p>
                                <p className="text-[10px] text-indigo-500 font-medium mt-0.5">{stat.change}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">
                {/* Severity Discovery Trend Chart */}
                <div id="severity-trend-chart" className="lg:col-span-2 card p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-card-title">Severity Discovery Trend</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Last 12 months</span>
                            <button
                                type="button"
                                onClick={() => downloadPngFromContainer("severity-trend-chart", "severity-discovery-trend")}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                                aria-label="Download severity discovery trend image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h3l1.5-2h6l1.5 2h3v10.5a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18V7.5z" />
                                    <circle cx="12" cy="13" r="3.25" />
                                </svg>
                                PNG
                            </button>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 mb-3">
                        {CHART_SEVERITIES.map((s) => (
                            <div key={s.key} className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                                <span className="text-[11px] text-gray-600 font-medium">{s.label}</span>
                            </div>
                        ))}
                    </div>
                    {/* Chart area */}
                    <div
                        role="img"
                        aria-label="Severity discovery trend chart"
                        className="relative h-52"
                        onMouseLeave={() => setTooltip(null)}
                    >
                        {/* Tooltip — fixed positioning escapes card's overflow-hidden */}
                        {tooltip && createPortal((() => {
                            const posStyle: React.CSSProperties = {
                                ...(tooltip.nearRight
                                    ? { right: window.innerWidth - tooltip.clientX + 8 }
                                    : { left: tooltip.clientX + 12 }),
                                ...(tooltip.nearBottom
                                    ? { bottom: window.innerHeight - tooltip.clientY + 8 }
                                    : { top: tooltip.clientY + 12 }),
                            };
                            return (
                                <div className="pointer-events-none fixed z-[9999]" style={posStyle}>
                                    <div className="bg-slate-800 text-white rounded-lg shadow-xl px-3 py-2.5 min-w-[140px] text-xs border border-slate-700">
                                        <p className="font-semibold text-slate-200 mb-1.5 border-b border-slate-600 pb-1">{tooltip.month}</p>
                                        {tooltip.items.filter(it => it.value > 0).map(it => (
                                            <div key={it.key} className="flex items-center justify-between gap-4 mb-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: it.color }} />
                                                    <span className="text-slate-300">{it.label}</span>
                                                </div>
                                                <span className="font-bold tabular-nums">{it.value}</span>
                                            </div>
                                        ))}
                                        {tooltip.total > 0 && (
                                            <div className="flex items-center justify-between gap-4 mt-1.5 pt-1.5 border-t border-slate-600">
                                                <span className="text-slate-400">Total</span>
                                                <span className="font-bold tabular-nums text-white">{tooltip.total}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })(), document.body)}
                        <svg className="w-full h-full" viewBox="0 0 600 190" preserveAspectRatio="none">
                            <defs>
                                {CHART_SEVERITIES.map((s) => (
                                    <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={s.color} stopOpacity="0.7" />
                                        <stop offset="100%" stopColor={s.color} />
                                    </linearGradient>
                                ))}
                            </defs>

                            {/* Y-axis grid lines + labels */}
                            {Y_TICKS.map((tick) => {
                                const y = yOf(tick);
                                return (
                                    <g key={`ytick-${tick}`}>
                                        <line x1={CHART_LEFT} y1={y} x2={CHART_RIGHT} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                                        <text x={CHART_LEFT - 6} y={y + 3.5} textAnchor="end" fontSize="9" fill="#9ca3af" fontFamily="sans-serif">
                                            {tick}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Y-axis line */}
                            <line x1={CHART_LEFT} y1={CHART_TOP} x2={CHART_LEFT} y2={CHART_BOTTOM} stroke="#e5e7eb" strokeWidth="1" />

                            {/* Lines per severity */}
                            {CHART_SEVERITIES.map((s) => (
                                <g key={s.key}>
                                    {/* Solid segments between consecutive non-zero points */}
                                    {trendSeries.map((item: any, i: number) => {
                                        if (i === 0) return null;
                                        const vPrev = trendSeries[i - 1][s.key] || 0;
                                        const vCurr = item[s.key] || 0;
                                        if (vPrev === 0 || vCurr === 0) return null;
                                        return (
                                            <line
                                                key={`${s.key}-seg-${i}`}
                                                x1={xOf(i - 1)} y1={yOf(vPrev)}
                                                x2={xOf(i)}     y2={yOf(vCurr)}
                                                stroke={s.color}
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        );
                                    })}
                                    {/* Data point circles — only where value > 0 */}
                                    {trendSeries.map((item: any, i: number) => {
                                        const v = item[s.key] || 0;
                                        if (v === 0) return null;
                                        const cx = xOf(i);
                                        const cy = yOf(v);
                                        const ptKey = `${s.key}-pt-${item.year ?? ""}-${item.month ?? i}`;
                                        return (
                                            <g key={ptKey}>
                                                {/* Invisible larger hit area */}
                                                <circle
                                                    cx={cx} cy={cy} r="10"
                                                    fill="transparent"
                                                    style={{ cursor: "pointer" }}
                                                    onMouseEnter={(e) => handlePointHover(i, e)}
                                                />
                                                {/* Visible dot */}
                                                <circle cx={cx} cy={cy} r="3.5" fill={s.color} stroke="white" strokeWidth="1.5" style={{ pointerEvents: "none" }} />
                                            </g>
                                        );
                                    })}
                                </g>
                            ))}

                            {/* Month labels */}
                            {months.map((m: string) => {
                                const idx = months.indexOf(m);
                                return (
                                    <text key={`lbl-${m}`} x={xOf(idx)} y="178" textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="sans-serif">{m}</text>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* Severity Distribution */}
                <div className="card p-4">
                    <h2 className="text-card-title mb-4">Severity Distribution</h2>
                    <div className="space-y-3">
                        {[
                            { label: "Critical", count: severityDistribution.CRITICAL, pct: Math.round((severityDistribution.CRITICAL / totalSeverity) * 100), color: "bg-red-500" },
                            { label: "High", count: severityDistribution.HIGH, pct: Math.round((severityDistribution.HIGH / totalSeverity) * 100), color: "bg-orange-400" },
                            { label: "Medium", count: severityDistribution.MEDIUM, pct: Math.round((severityDistribution.MEDIUM / totalSeverity) * 100), color: "bg-yellow-400" },
                            { label: "Low", count: severityDistribution.LOW, pct: Math.round((severityDistribution.LOW / totalSeverity) * 100), color: "bg-blue-400" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600">{item.label}</span>
                                    <span className="text-xs font-semibold text-gray-700">{item.count.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Total vulnerabilities tracked: <span className="font-semibold text-gray-700">{severityDistribution.total.toLocaleString()}</span></p>
                    </div>
                </div>
            </div>

            {/* Advanced Threat Surfaces (8 Charts) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
                <div id="risk-quadrant-chart" className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-card-title">Risk Quadrant</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">CVSS vs age</span>
                            <button
                                type="button"
                                onClick={() => downloadPngFromContainer("risk-quadrant-chart", "risk-quadrant")}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                                aria-label="Download risk quadrant image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h3l1.5-2h6l1.5 2h3v10.5a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18V7.5z" />
                                    <circle cx="12" cy="13" r="3.25" />
                                </svg>
                                PNG
                            </button>
                        </div>
                    </div>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="2 3" stroke="#e5e7eb" />
                                <XAxis type="number" dataKey="cvss" name="CVSS" domain={[0, 10]} tick={{ fontSize: 10 }} />
                                <YAxis type="number" dataKey="ageDays" name="Age (days)" tick={{ fontSize: 10 }} />
                                <ZAxis type="number" dataKey="z" range={[50, 450]} />
                                <Tooltip content={renderRiskQuadrantTooltip} cursor={{ strokeDasharray: "3 3" }} />
                                <Legend wrapperStyle={{ fontSize: "10px" }} />
                                <Scatter data={riskQuadrantData.filter((item) => String(item.maxSeverity).toUpperCase() === "CRITICAL")} name="Critical" fill="#ef4444" />
                                <Scatter data={riskQuadrantData.filter((item) => String(item.maxSeverity).toUpperCase() === "HIGH")} name="High" fill="#f97316" />
                                <Scatter data={riskQuadrantData.filter((item) => String(item.maxSeverity).toUpperCase() === "MEDIUM")} name="Medium" fill="#eab308" />
                                <Scatter data={riskQuadrantData.filter((item) => String(item.maxSeverity).toUpperCase() === "LOW")} name="Low" fill="#3b82f6" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div id="exploitability-drift-chart" className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-card-title">Exploitability Drift</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Recent months</span>
                            <button
                                type="button"
                                onClick={() => downloadPngFromContainer("exploitability-drift-chart", "exploitability-drift")}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                                aria-label="Download exploitability drift image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h3l1.5-2h6l1.5 2h3v10.5a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18V7.5z" />
                                    <circle cx="12" cy="13" r="3.25" />
                                </svg>
                                PNG
                            </button>
                        </div>
                    </div>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={driftData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="2 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: "0.5rem", padding: "6px 8px", borderColor: "#cbd5e1", fontSize: "11px" }}
                                    itemStyle={{ fontSize: "11px", color: "#334155" }}
                                    labelStyle={{ fontSize: "11px", color: "#0f172a", fontWeight: 600 }}
                                />
                                <Legend wrapperStyle={{ fontSize: "10px" }} />
                                <Area type="monotone" dataKey="nonExploitable" stackId="a" stroke="#94a3b8" fill="#cbd5e1" name="Non-exploitable" />
                                <Area type="monotone" dataKey="exploitable" stackId="a" stroke="#dc2626" fill="#f87171" name="Exploitable" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div id="recurrence-table-chart" className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-card-title">CVE Recurrence Heat Strip</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Max 6 months</span>
                            <button
                                type="button"
                                onClick={() => downloadRecurrenceTableImage("cve-recurrence", recurrenceRows, recurrenceHeatmap.monthKeys)}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                                aria-label="Download recurrence table image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h3l1.5-2h6l1.5 2h3v10.5a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18V7.5z" />
                                    <circle cx="12" cy="13" r="3.25" />
                                </svg>
                                PNG
                            </button>
                            <button
                                type="button"
                                onClick={() => openRecurrenceTablePrintView(recurrenceRows, recurrenceHeatmap.monthKeys)}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                                aria-label="Download recurrence table PDF"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3h7.5l3 3v13.5a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5V4.5A1.5 1.5 0 016.75 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25h6M9 11.25h6" />
                                </svg>
                                PDF
                            </button>
                            <button
                                type="button"
                                onClick={() => downloadRecurrenceTableExcel("cve-recurrence", recurrenceRows, recurrenceHeatmap.monthKeys)}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                                aria-label="Download recurrence table Excel"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3h7.5l3 3v13.5a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5V4.5A1.5 1.5 0 016.75 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6M15 9l-6 6" />
                                </svg>
                                Excel
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[11px]">
                            <thead>
                                <tr>
                                    <th className="text-left font-semibold text-slate-500 pb-1">CVE</th>
                                    {recurrenceHeatmap.monthKeys.map((monthKey) => (
                                        <th key={`hm-col-${monthKey}`} className="text-center font-medium text-slate-400 pb-1">{formatMonthKey(monthKey)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recurrenceRows.map((row) => (
                                    <tr key={`hm-row-${row.cve}`}>
                                        <td className="py-1 pr-2 text-slate-700 truncate max-w-[120px]">{row.cve}</td>
                                        {row.counts.map((count, idx) => {
                                            const intensity = Math.max(0.14, count / recurrenceHeatmap.maxCell);
                                            return (
                                                <td key={`hm-cell-${row.cve}-${idx}`} className="px-1 py-1">
                                                    <div
                                                        className="h-5 rounded-md text-center leading-5 text-[10px] font-semibold"
                                                        style={{
                                                            backgroundColor: `rgba(59,130,246,${intensity})`,
                                                            color: intensity > 0.5 ? "#ffffff" : "#1e293b",
                                                        }}
                                                    >
                                                        {count}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Page {recurrencePage} of {recurrenceTotalPages}</span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={recurrencePage === 1}
                                onClick={() => setRecurrencePage((p) => Math.max(1, p - 1))}
                                className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <button
                                type="button"
                                disabled={recurrencePage === recurrenceTotalPages}
                                onClick={() => setRecurrencePage((p) => Math.min(recurrenceTotalPages, p + 1))}
                                className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <div id="fix-priority-chart" className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-card-title">Fix Priority Leaderboard</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Weighted risk order</span>
                            <button
                                type="button"
                                onClick={() => downloadPngFromContainer("fix-priority-chart", "fix-priority")}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                                aria-label="Download fix priority chart image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h3l1.5-2h6l1.5 2h3v10.5a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 18V7.5z" />
                                    <circle cx="12" cy="13" r="3.25" />
                                </svg>
                                PNG
                            </button>
                        </div>
                    </div>
                    <div style={{ height: `${blastRadiusChartHeight}px` }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={targetBlastRadiusData} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 2 }} barCategoryGap={8}>
                                <CartesianGrid strokeDasharray="2 3" stroke="#e5e7eb" />
                                <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} />
                                <YAxis
                                    dataKey="target"
                                    type="category"
                                    width={110}
                                    tick={{ fontSize: 10, fill: "#475569" }}
                                    tickFormatter={(value) => String(value).length > 18 ? `${String(value).slice(0, 18)}...` : String(value)}
                                />
                                <Tooltip content={renderBlastRadiusTooltip} />
                                <Legend verticalAlign="top" align="right" iconSize={9} wrapperStyle={{ fontSize: "10px", paddingBottom: "2px" }} />
                                <Bar barSize={16} maxBarSize={20} dataKey="critical" stackId="severity" name="Critical" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                <Bar barSize={16} maxBarSize={20} dataKey="high" stackId="severity" name="High" fill="#f97316" radius={[0, 4, 4, 0]} />
                                <Bar barSize={16} maxBarSize={20} dataKey="medium" stackId="severity" name="Medium" fill="#eab308" radius={[0, 4, 4, 0]} />
                                <Bar barSize={16} maxBarSize={20} dataKey="low" stackId="severity" name="Low" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            <div className="card mb-4">
                <div className="card-padding border-b border-purple-100 flex items-center justify-between">
                    <h2 className="text-card-title">Recent Threat Activity</h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => downloadThreatTableExcel("recent-threat-activity", filtered)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                            aria-label="Download recent threat activity excel"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3h7.5l3 3v13.5a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5V4.5A1.5 1.5 0 016.75 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6M15 9l-6 6" />
                            </svg>
                            Excel
                        </button>
                        <button
                            type="button"
                            onClick={() => openThreatTablePrintView(filtered)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                            aria-label="Download recent threat activity pdf"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3h7.5l3 3v13.5a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5V4.5A1.5 1.5 0 016.75 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25h6M9 11.25h6" />
                            </svg>
                            PDF
                        </button>
                        <div className="relative w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Search table..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <span className="text-xs text-indigo-600 font-medium whitespace-nowrap">{filtered.length} records</span>
                    </div>
                </div>
                <div className="responsive-table-container">
                    <table className="responsive-table">
                        <thead>
                            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <th className="px-4 py-3 text-left text-xs font-semibold">Job ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">CVE Reference</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Title</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Target</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Severity</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Vulnerable</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Discovered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && !loadError && paginated.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-6 text-xs text-gray-500">No vulnerabilities found.</td>
                                </tr>
                            )}

                            {paginated.map((row: any, idx: number) => (
                                <tr key={row.id} className={`border-b border-purple-50 hover:bg-purple-50/50 transition-colors ${idx % 2 === 0 ? "bg-purple-50/30" : "bg-white"}`}>
                                    <td className="px-4 py-3 text-xs font-mono text-gray-700">{row.job_id}</td>
                                    <td className="px-4 py-3 text-xs text-indigo-600 font-medium">{row.cve}</td>
                                    <td className="px-4 py-3 text-xs text-gray-700 max-w-xs"><p className="truncate" title={row.title}>{row.title}</p></td>
                                    <td className="px-4 py-3 text-xs text-gray-700 max-w-xs"><p className="truncate" title={row.target || row.affected}>{row.target || row.affected || "-"}</p></td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${severityColors[row.severity]}`}>{row.severity}</span>
                                    </td>
                                    <td className={`px-4 py-3 text-xs font-semibold ${statusColors[row.status]}`}>{row.status}</td>
                                    <td className={`px-4 py-3 text-xs font-semibold ${row.exploitable ? "text-red-600" : "text-gray-400"}`}>{row.exploitable ? "Yes" : "No"}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{row.report_generated || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filtered.length > 0 && (
                <div className="card card-padding flex flex-wrap items-center gap-3">
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                        Showing <span className="font-semibold text-gray-800">{showFrom}-{showTo}</span> of <span className="font-semibold text-gray-800">{filtered.length.toLocaleString()}</span> vulnerabilities
                    </p>

                    <div className="flex items-center gap-1 mx-auto">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2.5 py-1.5 rounded-md border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            ← Prev
                        </button>

                        {getPageNumbers(currentPage, totalPages).map((pg) => {
                            if (pg.val === "...") {
                                return <span key={pg.key} className="px-1.5 text-xs text-gray-400">...</span>;
                            }
                            const pageVal = pg.val;
                            return (
                                <button
                                    key={pg.key}
                                    type="button"
                                    onClick={() => setCurrentPage(pageVal)}
                                    className={`min-w-[32px] px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-all ${
                                        pageVal === currentPage
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-sm"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {pageVal}
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-2.5 py-1.5 rounded-md border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next →
                        </button>
                    </div>

                    <div className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                        Per page: <span className="font-semibold text-gray-600">10</span>
                    </div>
                </div>
            )}
        </div>
    );
}
