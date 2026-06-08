"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OverviewService } from "@/services/overview.service";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

function getPaginationButtonClass(currentPage: number, page: PaginationItem): string {
  if (typeof page === "number" && currentPage === page) {
    return "min-w-9 rounded-lg px-3 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm";
  }
  if (typeof page !== "number") {
    return "text-slate-400 cursor-default px-3 py-2";
  }
  return "px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100";
}

function buildPagination(currentPage: number, totalPages: number): PaginationItem[] {
  const pages = new Set<number>();

  if (totalPages <= 7) {
    for (let p = 1; p <= totalPages; p += 1) pages.add(p);
    return Array.from(pages);
  }

  pages.add(1);
  pages.add(totalPages);

  for (let p = currentPage - 1; p <= currentPage + 1; p += 1) {
    if (p > 1 && p < totalPages) pages.add(p);
  }

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sorted = Array.from(pages).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let prev: number | null = null;
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) {
      items.push(prev < currentPage ? "ellipsis-left" : "ellipsis-right");
    }
    items.push(p);
    prev = p;
  }
  return items;
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Yearly");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedRecent, setSelectedRecent] = useState<any | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<{ jobs?: boolean; web?: boolean; ai?: boolean; vuln?: boolean }>({ jobs: true, web: true, ai: true, vuln: true });

  const { data: overviewResp, isLoading } = useQuery({
    queryKey: ["overview", selectedPeriod, page, limit],
    queryFn: async () => {
      const range = (selectedPeriod || "Yearly").toLowerCase();
      const resp = await OverviewService.getOverview({ range, page, limit });
      return resp.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const totals = overviewResp?.totals || { applications: 0, vulnerabilities: 0, validated_vulnerable: 0, validated_not_vulnerable: 0 };
  const recentActivity = overviewResp?.recent_activity || [];
  const chartData = overviewResp?.chart || [];

  const filteredRecent = useMemo(() => {
    if (!search) return recentActivity;
    const q = search.toLowerCase();
    return recentActivity.filter((r: any) => {
      return (
        String(r.investigation_id || "").toLowerCase().includes(q) ||
        String(r.vulnerability_name || "").toLowerCase().includes(q) ||
        String(r.application_name || "").toLowerCase().includes(q) ||
        String(r.summary || "").toLowerCase().includes(q)
      );
    });
  }, [search, recentActivity]);

  function timeAgo(iso?: string | null) {
    if (!iso) return "-";
    try {
      const then = new Date(iso).getTime();
      if (Number.isNaN(then)) return iso;
      const diff = Math.floor((Date.now() - then) / 1000);
      if (diff < 5) return "just now";
      if (diff < 60) return `${diff}s`; 
      const mins = Math.floor(diff / 60);
      if (mins < 60) return `${mins}m`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}d`;
      const weeks = Math.floor(days / 7);
      if (weeks < 5) return `${weeks}w`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months}mo`;
      const years = Math.floor(days / 365);
      return `${years}y`;
    } catch (e) {
      return iso;
    }
  }

  function formatSource(src?: string | null) {
    const s = (src || 'vulnerability').replace('_', ' ');
    return s.replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function formatNumber(n: number | null | undefined) {
    if (n === null || n === undefined) return "0";
    return n >= 1000 ? n.toLocaleString() : String(n);
  }

  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;
    const dataPoint = payload[0]?.payload || payload[0]?.payload || {};
    const updatedAt = dataPoint?.updated_at || dataPoint?.updatedAt || null;
    return (
      <div className="p-2 bg-white rounded-lg shadow-md border border-slate-200 text-xs text-gray-800">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
            <span style={{ width: 10, height: 10, background: p.color, display: 'inline-block', borderRadius: 3 }} />
            <span className="flex-1 text-[13px]">{p.name}</span>
            <span className="font-mono text-sm">{formatNumber(p.value)}</span>
          </div>
        ))}
        {updatedAt && (
          <div className="mt-1 text-[11px] text-gray-500">Updated: {new Date(updatedAt).toLocaleString()}</div>
        )}
      </div>
    );
  }

  function CustomLegend(props: any) {
    const { payload } = props;
    if (!payload) return null;
    const mapNameToKey = (name: string) => {
      if (/agent jobs/i.test(name)) return 'jobs';
      if (/web scans?/i.test(name)) return 'web';
      if (/ai runs?/i.test(name)) return 'ai';
      if (/vulnerabilities?/i.test(name)) return 'vuln';
      return name;
    };
    return (
      <div className="flex items-center gap-3 flex-wrap text-xs">
        {payload.map((entry: any) => {
          const key = mapNameToKey(entry.value || '');
          const active = (visibleSeries as any)[key] !== false;
          return (
            <button
              key={entry.value}
              onClick={() => setVisibleSeries((s: any) => ({ ...s, [key]: !(s as any)[key] }))}
              className={`flex items-center gap-2 ${active ? 'text-gray-800' : 'text-gray-400 opacity-60'}`}
              style={{ background: 'transparent', border: 'none', padding: 0 }}
            >
              <span style={{ width: 10, height: 10, background: entry.color, display: 'inline-block', borderRadius: 3 }} />
              <span className="font-medium">{entry.value}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="page-padding">
      <div className="page-header">
        <h1 className="text-page-title">Home</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-5">
        <div className="card p-3 md:p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{totals.applications}</p>
              <p className="text-[10px] md:text-xs text-gray-600">Total Applications</p>
            </div>
          </div>
        </div>

        <div className="card p-3 md:p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{totals.vulnerabilities}</p>
              <p className="text-[10px] md:text-xs text-gray-600">Total Vulnerabilities</p>
            </div>
          </div>
        </div>

        <div className="card p-3 md:p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{totals.validated_vulnerable}</p>
              <p className="text-[10px] md:text-xs text-gray-600">Validated as Vulnerable</p>
            </div>
          </div>
        </div>

        <div className="card p-3 md:p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{totals.validated_not_vulnerable}</p>
              <p className="text-[10px] md:text-xs text-gray-600">Validated as Not Vulnerable</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 md:mb-6">
        <div className="card-padding border-b border-purple-100 flex items-center justify-between gap-3">
          <h2 className="text-card-title">Recent Activity</h2>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table..."
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="px-2 py-1 border rounded-md text-sm">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        <div className="responsive-table-container">
          <table className="responsive-table">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Investigation ID</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Vulnerability Name</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Application Name</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Summary</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">When</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecent.map((r: any) => (
                <tr key={r.investigation_id} className="border-b border-purple-50 bg-white hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-700">{r.investigation_id}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">{formatSource(r.source_type)}</span>
                      <span className="truncate">{r.vulnerability_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">{r.application_name}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{r.summary}</td>
                  <td className="px-4 py-3 text-xs text-gray-600"><span title={r.timestamp ? new Date(r.timestamp).toLocaleString() : ''}>{timeAgo(r.timestamp)}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedRecent(r)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full transition-all">View</button>
                  </td>
                </tr>
              ))}
              {filteredRecent.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-sm text-gray-600">No recent activity</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-600">Page {page}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`px-3 py-2 rounded-lg text-sm font-medium border ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
            >
              Prev
            </button>

            {buildPagination(page, 5).map((it, idx) => {
              if (typeof it === 'string') {
                return (
                  <span key={`e-${idx}`} className="px-2 text-slate-400">&hellip;</span>
                );
              }
              return (
                <button
                  key={it}
                  onClick={() => setPage(it)}
                  className={getPaginationButtonClass(page, it)}
                >
                  {it}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(5, p + 1))}
              disabled={recentActivity.length < limit && page !== 1}
              className={`px-3 py-2 rounded-lg text-sm font-medium border ${recentActivity.length < limit && page !== 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Total Scan</h3>
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              <option>Yearly</option>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="p-3">
            {chartData.length === 0 ? (
              <p className="text-sm text-gray-500">No chart data</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="period_label" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} />
                  <Legend content={<CustomLegend />} />
                  {visibleSeries.jobs && (
                    <Line type="monotone" dataKey="total_jobs" name="Agent Jobs" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  )}
                  {visibleSeries.web && (
                    <Line type="monotone" dataKey="total_web" name="Web Scans" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  )}
                  {visibleSeries.ai && (
                    <Line type="monotone" dataKey="total_ai" name="AI Runs" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  )}
                  {visibleSeries.vuln && (
                    <Line type="monotone" dataKey="total_vulnerabilities" name="Vulnerabilities" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Total Vulnerabilities</h3>
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              <option>Yearly</option>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="p-3">
            {chartData.length === 0 ? (
              <p className="text-sm text-gray-500">No chart data</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVuln" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period_label" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} />
                  {visibleSeries.vuln && (
                    <Area type="monotone" dataKey="total_vulnerabilities" name="Vulnerabilities" stroke="#ef4444" fillOpacity={1} fill="url(#colorVuln)" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      {selectedRecent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3">
          <div className="w-full max-w-4xl max-h-[85vh] overflow-auto rounded-xl bg-white shadow-2xl border border-slate-200">
            <div className="sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-xl">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold">{selectedRecent.vulnerability_name || 'Vulnerability'}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white text-[12px] font-semibold">{formatSource(selectedRecent.source_type)}</span>
                </div>
                <p className="text-xs opacity-90 mt-0.5">Investigation <span className="font-mono">{selectedRecent.investigation_id}</span> • {selectedRecent.application_name || '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    try { navigator.clipboard?.writeText(String(selectedRecent.investigation_id)); } catch (_) {}
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20"
                >
                  Copy ID
                </button>
                <button onClick={() => setSelectedRecent(null)} className="px-3 py-1 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20">Close</button>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Summary</p>
                  <p className="mt-2 text-sm text-gray-800 font-semibold">{selectedRecent.summary || selectedRecent.vulnerability_name || '-'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                    <p className="text-[11px] text-gray-500">Application</p>
                    <p className="font-semibold text-gray-800 mt-1">{selectedRecent.application_name || '-'}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                    <p className="text-[11px] text-gray-500">Client</p>
                    <p className="font-mono text-[13px] text-gray-800 mt-1">{selectedRecent.client_id || '-'}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-[11px] text-gray-500">Details</p>
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Investigation ID</span>
                      <span className="font-mono">{selectedRecent.investigation_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Timestamp</span>
                      <span className="font-semibold">{selectedRecent.timestamp ? `${timeAgo(selectedRecent.timestamp)} · ${new Date(selectedRecent.timestamp).toLocaleString()}` : (selectedRecent.created_at ? `${timeAgo(selectedRecent.created_at)} · ${new Date(selectedRecent.created_at).toLocaleString()}` : '-')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Summary Text</span>
                      <span className="text-sm text-gray-700 max-w-[60%] truncate">{selectedRecent.summary || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="text-[11px] text-gray-500">Triage Snapshot</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Severity</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[12px] font-semibold">Unknown</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="text-sm font-semibold text-gray-800">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">CVSS</span>
                      <span className="font-semibold">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Published</span>
                      <span className="text-sm">-</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-[11px] text-gray-500">Actions</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <button onClick={() => { try { navigator.clipboard?.writeText(JSON.stringify(selectedRecent)); } catch (_) {} }} className="px-3 py-2 rounded-lg border text-sm">Copy JSON</button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
