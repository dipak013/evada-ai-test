import React from 'react';

interface RawScannerData {
  host: string;
  port: number;
  title: string;
  details: string;
  severity: string;
}

interface ValidationEvidence {
  id: string;
  validation_run_id: string;
  execution_log: string;
} 

interface ValidationRun {
  id: string;
  vulnerability_id: string;
  method: string;
  decision: string;
  reason: string;
  executed_at: string;
  evidence: ValidationEvidence[];
}

interface Vulnerability {
  id: string;
  application_id: string;
  job_id: string;
  scanner_name: string;
  title: string;
  name?: string;
  description?: string;
  remediation?: string;
  cve?: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational";
  target_host: string;
  target_port: number;
  raw_scanner_data: RawScannerData;
  validation_runs: ValidationRun[];
}

interface ReportsTabProps {
  isUploading: boolean;
  vulnerabilities: Vulnerability[];
  downloadPDF: () => void;
}

export function ReportsTab({
  isUploading,
  vulnerabilities,
  downloadPDF
}: ReportsTabProps) {
  const [page, setPage] = React.useState<number>(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil((vulnerabilities?.length || 0) / PAGE_SIZE));

  const pageItems = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return (vulnerabilities || []).slice(start, start + PAGE_SIZE);
  }, [page, vulnerabilities]);

  React.useEffect(() => {
    // Reset to first page when new vulnerabilities arrive
    setPage(1);
  }, [vulnerabilities]);

  return (
    <>
      {!isUploading && (
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200">
          {/* Summary Section */}
          <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Critical Issues */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-red-100">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Critical Issues:</p>
                  <p className="text-3xl font-bold text-red-600">
                    {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'CRITICAL').length}
                  </p>
                </div>
              </div>

              {/* High Issues */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-orange-100">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">High Issues:</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'HIGH').length}
                  </p>
                </div>
              </div>

              {/* Medium Issues */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-yellow-100">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Medium Issues:</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'MEDIUM').length}
                  </p>
                </div>
              </div>

              {/* Low Issues */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Low Issues:</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'LOW').length}
                  </p>
                </div>
              </div>

              {/* Informational Issues */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Informational:</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'INFORMATIONAL').length}
                  </p>
                </div>
              </div>

              {/* Scan Date */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Scan Date:</p>
                  <p className="text-base font-semibold text-gray-800">
                    {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Key Findings</h2>
              <button
                onClick={downloadPDF}
                className="btn-secondary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download PDF
              </button>
            </div>

            {vulnerabilities.length > 0 ? (
              <>
                <div className="space-y-4">
                  {pageItems.map((v, index) => (
                    <div
                      key={v.id || index}
                      className="bg-white rounded-lg p-5 shadow-sm border-l-4"
                      style={{
                        borderLeftColor:
                          (String(v.severity || 'Informational')).toUpperCase() === 'CRITICAL' ? '#DC2626' :
                          (String(v.severity || 'Informational')).toUpperCase() === 'HIGH' ? '#EA580C' :
                          (String(v.severity || 'Informational')).toUpperCase() === 'MEDIUM' ? '#CA8A04' :
                          (String(v.severity || 'Informational')).toUpperCase() === 'INFORMATIONAL' ? '#6B7280' : '#0284C7'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              (String(v.severity || 'Informational')).toUpperCase() === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                              (String(v.severity || 'Informational')).toUpperCase() === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                              (String(v.severity || 'Informational')).toUpperCase() === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                              (String(v.severity || 'Informational')).toUpperCase() === 'INFORMATIONAL' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {String(v.severity || 'Informational')}
                            </span>
                            <span className="text-xs text-gray-500">Scanner: {v.scanner_name || 'Unknown'}</span>
                            {v.target_host && v.target_port && (
                              <span className="text-xs text-gray-500">
                                Target: {v.target_host}:{v.target_port}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {v.title || v.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3 whitespace-normal break-words">
                            {v.description}
                          </p>
                          {v.remediation && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm font-medium text-gray-700 mb-1">Remediation:</p>
                              <p className="text-sm text-gray-600">{v.remediation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination controls - compact, responsive with ellipses */}
                {vulnerabilities.length > PAGE_SIZE && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="text-sm text-gray-600">Showing {((page - 1) * PAGE_SIZE) + 1} - {Math.min(page * PAGE_SIZE, vulnerabilities.length)} of {vulnerabilities.length}</div>

                      <div className="flex items-center gap-2">
                        <button
                          className={`px-3 py-1 rounded border text-sm ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                          title="First page"
                        >
                          «
                        </button>

                        <button
                          className={`px-3 py-1 rounded border text-sm ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          title="Previous page"
                        >
                          Prev
                        </button>

                        <div className="flex items-center gap-1 overflow-x-auto max-w-[60vw] lg:max-w-[40vw]">
                          {(() => {
                            const maxButtons = 7;
                            const half = Math.floor(maxButtons / 2);
                            let startPage = Math.max(1, page - half);
                            let endPage = Math.min(totalPages, startPage + maxButtons - 1);
                            if (endPage - startPage + 1 < maxButtons) {
                              startPage = Math.max(1, endPage - maxButtons + 1);
                            }

                            const pages: (number | string)[] = [];
                            if (startPage > 1) {
                              pages.push(1);
                              if (startPage > 2) pages.push('...');
                            }
                            for (let p = startPage; p <= endPage; p++) pages.push(p);
                            if (endPage < totalPages) {
                              if (endPage < totalPages - 1) pages.push('...');
                              pages.push(totalPages);
                            }

                            return pages.map((x, i) => {
                              if (x === '...') {
                                return (
                                  <span key={`e-${i}`} className="px-2 text-sm text-gray-500">…</span>
                                );
                              }
                              const num = Number(x);
                              return (
                                <button
                                  key={`p-${num}`}
                                  onClick={() => setPage(num)}
                                  className={`px-3 py-1 rounded text-sm ${page === num ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
                                >
                                  {num}
                                </button>
                              );
                            });
                          })()}
                        </div>

                        <button
                          className={`px-3 py-1 rounded border text-sm ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          title="Next page"
                        >
                          Next
                        </button>

                        <button
                          className={`px-3 py-1 rounded border text-sm ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                          onClick={() => setPage(totalPages)}
                          disabled={page === totalPages}
                          title="Last page"
                        >
                          »
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">No vulnerabilities found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
