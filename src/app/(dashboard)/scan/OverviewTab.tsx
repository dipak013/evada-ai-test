import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational" | string;
  target_host: string;
  target_port: number;
  raw_scanner_data: any;
  validation_runs: any[];
}

interface OverviewTabProps {
  isUploading: boolean;
  vulnerabilities: Vulnerability[];
  scanComplete: boolean;
  logLines: string[];
  terminalRef: React.RefObject<HTMLDivElement | null>;
  onDownloadTerminalLog: () => void;
}

export function OverviewTab({
  isUploading,
  vulnerabilities,
  scanComplete,
  logLines,
  terminalRef,
  onDownloadTerminalLog,
}: OverviewTabProps) {
  return (
    <>
      {!isUploading && (
        <div className="flex flex-col gap-6">
          {/* Terminal - Full Width */}
          <div className="bg-gray-900 rounded-xl p-4 shadow-lg w-full">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 ${scanComplete ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'} rounded-full`} />
                <h3 className="text-xs font-semibold text-white">
                  {scanComplete ? 'SCAN COMPLETED' : 'SCANNING IN PROGRESS...'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onDownloadTerminalLog}
                disabled={logLines.length === 0}
                className="px-2.5 py-1 rounded-md border border-slate-600 text-[11px] font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download full terminal log"
              >
                Download Full Log
              </button>
            </div>

            <div ref={terminalRef} className="bg-black rounded-lg p-3 h-[500px] overflow-auto font-mono text-xs">
              {logLines.map((line, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap break-words ${
                    (line || '').includes('ERROR') || (line || '').includes('CRITICAL') ? 'text-red-400' :
                    (line || '').includes('HIGH') ? 'text-orange-400' :
                    (line || '').includes('MEDIUM') ? 'text-yellow-400' :
                    (line || '').includes('LOW') ? 'text-blue-400' :
                    (line || '').includes('✓') || (line || '').includes('completed') || (line || '').includes('successfully') ? 'text-green-400' :
                    (line || '').includes('===') ? 'text-cyan-400 font-bold' :
                    'text-green-300'
                  }`}
                >
                  {line}
                </div>
              ))}
              {!scanComplete && (
                <div className="flex items-center gap-1 text-green-400 mt-2">
                  <span>$</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>
          </div>

          {/* Pie Chart - Full Width, below terminal */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg border border-indigo-100 p-6 w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Vulnerabilities Overview</h3>
              <div className="px-3 py-1 bg-indigo-100 rounded-full">
                <span className="text-xs font-semibold text-indigo-700">Total: {scanComplete ? vulnerabilities.length : '—'}</span>
              </div>
            </div>

            {(() => {
              if (!scanComplete) {
                return (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Waiting for scan to complete...</p>
                    </div>
                  </div>
                );
              }

              if (vulnerabilities.length === 0) {
                return (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-8 h-8 text-green-600"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">No vulnerabilities found</p>
                    </div>
                  </div>
                );
              }

              // Build ordered chart data and legend payload to ensure stable legend ordering
              const priorityOrder = ['Critical', 'High', 'Medium', 'Low', 'Informational'];
              const baseData = [
                { name: 'Critical', value: vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'CRITICAL').length, color: '#DC2626' },
                { name: 'High', value: vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'HIGH').length, color: '#EA580C' },
                { name: 'Medium', value: vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'MEDIUM').length, color: '#CA8A04' },
                { name: 'Low', value: vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'LOW').length, color: '#2563EB' },
                { name: 'Informational', value: vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'INFORMATIONAL').length, color: '#6B7280' }
              ];

              const filtered = baseData.filter(item => item.value > 0).sort((a, b) => {
                return priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name);
              });

              const legendPayload = filtered.map(item => ({ value: item.name, type: 'circle', id: item.name, color: item.color, payload: item }));

              return (
                <div className="relative">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={filtered}
                        cx="50%"
                        cy="45%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {filtered.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: any, name: any, props: any) => {
                          const total = vulnerabilities.length;
                          const percentage = ((value / total) * 100).toFixed(1);
                          return [`${value} (${percentage}%)`, 'Vulnerabilities'];
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={50}
                        iconType="circle"
                        iconSize={10}
                        content={() => (
                          <div style={{ paddingTop: '20px' }}>
                            {legendPayload.map((entry) => {
                              const colors: Record<string, string> = {
                                'Critical': 'text-red-700',
                                'High': 'text-orange-700',
                                'Medium': 'text-yellow-700',
                                'Low': 'text-blue-700',
                                'Informational': 'text-gray-700'
                              };
                              const total = vulnerabilities.length;
                              const percentage = ((entry.payload.value / total) * 100).toFixed(1);
                              return (
                                <div key={entry.value} className="inline-block mr-4">
                                  <span className={`text-sm font-medium ${colors[entry.value] || 'text-gray-700'}`}>
                                    {entry.value} <span className="font-bold">{entry.payload.value} ({percentage}%)</span>
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Statistics */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ marginTop: '-25px' }}>
                    <div className="text-3xl font-bold text-gray-800">{vulnerabilities.length}</div>
                    <div className="text-xs text-gray-600 font-medium">Issues Found</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}

export default OverviewTab;
