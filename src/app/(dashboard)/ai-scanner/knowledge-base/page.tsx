"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { KnowledgeBaseService, KnowledgeBaseEntry, KnowledgeBasePagination } from "@/services/knowledge-base.service";

const PAGE_SIZE = 30;

const SEV_BADGE: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-700 border border-red-200",
    HIGH:     "bg-orange-100 text-orange-700 border border-orange-200",
    MEDIUM:   "bg-amber-100 text-amber-700 border border-amber-200",
    LOW:      "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

function SeverityBadge({ severity }: Readonly<{ severity: string | null }>) {
    if (!severity) return <span className="text-gray-400 text-xs">—</span>;
    const key = severity.toUpperCase();
    const cls = SEV_BADGE[key] ?? "bg-gray-100 text-gray-600 border border-gray-200";
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
            {severity.toUpperCase()}
        </span>
    );
}

function Pagination({
    pagination,
    onPageChange,
}: Readonly<{
    pagination: KnowledgeBasePagination;
    onPageChange: (page: number) => void;
}>) {
    const { page, total_pages } = pagination;
    if (total_pages <= 1) return null;

    const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [1];
    if (page > 3) pages.push("ellipsis-left");
    for (let p = Math.max(2, page - 1); p <= Math.min(total_pages - 1, page + 1); p++) pages.push(p);
    if (page < total_pages - 2) pages.push("ellipsis-right");
    if (total_pages > 1) pages.push(total_pages);

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                ‹ Prev
            </button>
            {pages.map((p) =>
                typeof p === "string" ? (
                    <span key={p} className="px-2 text-gray-400 text-sm">...</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`px-3 py-1.5 rounded border text-sm ${
                            p === page
                                ? "bg-indigo-600 text-white border-indigo-600 font-semibold"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}
            <button
                disabled={page === total_pages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Next ›
            </button>
        </div>
    );
}

export default function KnowledgeBasePage() {
    const [search, setSearch]             = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage]   = useState(1);
    const [entries, setEntries]           = useState<KnowledgeBaseEntry[]>([]);
    const [pagination, setPagination]     = useState<KnowledgeBasePagination>({
        total: 0, page: 1, page_size: PAGE_SIZE, total_pages: 1,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState<string | null>(null);
    const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce search input
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [search]);

    const fetchData = useCallback(async (page: number, q: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await KnowledgeBaseService.list({ page, page_size: PAGE_SIZE, search: q || undefined });
            setEntries(res.data);
            setPagination(res.pagination);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load knowledge base");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch, fetchData]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const rowStart = (pagination.page - 1) * pagination.page_size + 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        CVE vulnerability records tracked by the AI Pentester
                    </p>
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

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 mb-5 flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search CVE ID, CWE, title, description…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Table card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Table meta bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">
                        {isLoading ? "Loading…" : `${pagination.total.toLocaleString()} vulnerabilities`}
                    </span>
                    {!isLoading && pagination.total > 0 && (
                        <span className="text-xs text-gray-400">
                            Showing {rowStart}–{Math.min(rowStart + entries.length - 1, pagination.total)} of {pagination.total.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Error state */}
                {error && (
                    <div className="px-5 py-10 text-center text-red-600 text-sm">{error}</div>
                )}

                {/* Loading skeleton */}
                {isLoading && !error && (
                    <div className="divide-y divide-gray-50">
                        {["s0","s1","s2","s3","s4","s5","s6","s7","s8","s9"].map((sk) => (
                            <div key={sk} className="flex gap-4 px-5 py-3 animate-pulse">
                                <div className="h-4 w-20 bg-gray-100 rounded" />
                                <div className="h-4 w-16 bg-gray-100 rounded" />
                                <div className="h-4 w-48 bg-gray-100 rounded flex-1" />
                                <div className="h-4 w-16 bg-gray-100 rounded" />
                                <div className="h-4 w-16 bg-gray-100 rounded" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Table */}
                {!isLoading && !error && entries.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">CVE</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">CWE</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right whitespace-nowrap">CVSS</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Severity</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {entries.map((entry, idx) => (
                                    <tr key={entry.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-5 py-3 text-gray-400 text-xs">{rowStart + idx}</td>
                                        <td className="px-5 py-3 font-mono text-indigo-700 font-medium whitespace-nowrap text-xs">
                                            {entry.cve}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 text-xs whitespace-nowrap">
                                            {entry.cwe ?? <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-5 py-3 text-gray-800 max-w-xs">
                                            <span className="line-clamp-2">{entry.title ?? <span className="text-gray-400">—</span>}</span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-500 text-xs max-w-sm">
                                            <span className="line-clamp-2">{entry.description ?? <span className="text-gray-300">—</span>}</span>
                                        </td>
                                        <td className="px-5 py-3 text-right text-gray-700 font-mono text-xs whitespace-nowrap">
                                            {entry.cvss_score === null ? <span className="text-gray-300">&mdash;</span> : entry.cvss_score.toFixed(1)}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <SeverityBadge severity={entry.severity} />
                                        </td>
                                        <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                                            {entry.updated_at
                                                ? new Date(entry.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                : <span className="text-gray-300">—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && entries.length === 0 && (
                    <div className="px-5 py-16 text-center">
                        <svg className="mx-auto w-10 h-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                        </svg>
                        <p className="text-gray-500 text-sm">No vulnerabilities found{debouncedSearch ? ` for "${debouncedSearch}"` : ""}.</p>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && !error && pagination.total_pages > 1 && (
                    <div className="px-5 pb-6">
                        <Pagination pagination={pagination} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>
        </div>
    );
}
