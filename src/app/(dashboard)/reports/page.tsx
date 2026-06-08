"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Vulnerability {
  id: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  vulnerability: string;
  target: string;
  status: "Open" | "Reviewing" | "Patched";
}

export default function ReportsPage() {
  const router = useRouter();
  const [vulnerabilities] = useState<Vulnerability[]>([
    { id: 1, severity: "CRITICAL", vulnerability: "VULN-001", target: "api.production.io", status: "Open" },
    { id: 2, severity: "HIGH", vulnerability: "VULN-002", target: "auth-service.local", status: "Reviewing" },
    { id: 3, severity: "MEDIUM", vulnerability: "VULN-003", target: "192.168.1.105", status: "Patched" },
    { id: 4, severity: "HIGH", vulnerability: "VULN-004", target: "dev-portal.external", status: "Open" },
  ]);

  const [liveOutput] = useState([
    "Starting scan on: 10.2.1.5 Security Penetration Audit... Unusual Connector...",
    "Checking API... Building for production ALERT.",
    "",
    "Type 'launch exploit' command...",
  ]);

  const barChartData = [
    { year: "2017", value: 60 },
    { year: "2018", value: 85 },
    { year: "2019", value: 45 },
    { year: "2020", value: 80 },
    { year: "2021", value: 75 },
    { year: "2022", value: 35 },
    { year: "2023", value: 70 },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-red-600";
      case "Reviewing":
        return "text-orange-600";
      case "Patched":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusDotColor = (status: Vulnerability["status"]) => {
    if (status === "Open") return "bg-red-500";
    if (status === "Reviewing") return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="page-padding">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-page-title">Report & Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-64 md:w-72 lg:w-80 px-3 md:px-4 py-2 pl-3 md:pl-4 pr-10 rounded-full bg-indigo-100 text-sm md:text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

        </div>
      </div>

      {/* Key Vulnerability Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Key Vulnerability</h2>
            <p className="text-xs text-gray-500">View and manage your applications</p>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-white bg-indigo-600 rounded p-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              Filter by: <span className="text-indigo-600 font-medium">dates | Status</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Total Targets */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <span className="absolute top-4 right-4 text-xs font-medium text-green-600">+6%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Targets</p>
          <p className="text-3xl font-bold text-gray-800">42</p>
        </div>

        {/* Critical Vulns */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <span className="absolute top-4 right-4 text-xs font-medium text-red-600">+2 new</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Critical Vulns</p>
          <p className="text-3xl font-bold text-gray-800">12</p>
        </div>

        {/* High Severity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-orange-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <span className="absolute top-4 right-4 text-xs font-medium text-gray-600">Static</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">High Severity</p>
          <p className="text-3xl font-bold text-gray-800">28</p>
        </div>

        {/* System Uptime */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="absolute top-4 right-4 text-xs font-medium text-green-600">Stable</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">System Uptime</p>
          <p className="text-3xl font-bold text-gray-800">99.9%</p>
        </div>
      </div>

      {/* Charts Section - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Pie Charts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Pie Chart</h3>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Chart</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Show Value</span>
              </label>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="h-48 flex items-center">
            <div className="w-full grid grid-cols-3 gap-2">
            {/* Total Open - Red */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#fee2e2" strokeWidth="16" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#ef4444"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(81 / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-800">81%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700">Total Open</p>
            </div>

            {/* Total Patched - Green */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#d1fae5" strokeWidth="16" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(22 / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">22%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Total Patched</p>
            </div>

            {/* Total Reviewing - Blue */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#dbeafe" strokeWidth="16" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#3b82f6"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(62 / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">62%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">Total Reviewing</p>
            </div>
          </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Bar Chart</h3>
            <select className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Yearly</option>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="h-48">
            <svg className="w-full h-full" viewBox="0 0 500 250">
              {/* Grid lines */}
              {[0, 20, 40, 60, 80, 100].map((val) => (
                <line
                  key={val}
                  x1="40"
                  y1={200 - val * 1.8}
                  x2="480"
                  y2={200 - val * 1.8}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              ))}
              {/* Y-axis labels */}
              {[0, 20, 40, 60, 80, 100].map((val) => (
                <text key={val} x="10" y={205 - val * 1.8} fontSize="11" fill="#999">
                  {val}
                </text>
              ))}
              {/* Bars */}
              {barChartData.map((d, i) => (
                <g key={d.year}>
                  <rect
                    x={50 + i * 62}
                    y={200 - d.value * 1.8}
                    width="45"
                    height={d.value * 1.8}
                    fill="#6366f1"
                    rx="4"
                  />
                  <text x={62 + i * 62} y="225" fontSize="11" fill="#999">
                    {d.year}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Vulnerability Feed and Live Output - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Vulnerability Feed Table */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Vulnerability Feed</h3>
            <button className="text-white/80 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Vulnerability</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Target</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {vulnerabilities.map((vuln) => (
                  <tr key={vuln.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                          vuln.severity
                        )}`}
                      >
                        {vuln.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{vuln.vulnerability}</td>
                    <td className="px-4 py-3 text-sm text-white">{vuln.target}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusDotColor(vuln.status)}`}></span>
                        <span className={`text-sm font-medium ${getStatusColor(vuln.status)}`}>
                          {vuln.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-center">
            <button className="text-white hover:text-white/80 text-sm font-medium underline">
              View All Historical Findings
            </button>
          </div>
        </div>

        {/* Live Output Stream */}
        <button
          type="button"
          onClick={() => router.push('/settings')}
          className="bg-gray-900 rounded-xl p-4 shadow-lg cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-xs font-semibold text-white">LIVE OUTPUT STREAM</h3>
          </div>
          <div className="space-y-1 font-mono text-xs text-green-400">
            {liveOutput.map((line, index) => (
              <p key={`${line}-${index}`}>{line || "\u00A0"}</p>
            ))}
            <p className="flex items-center gap-1">
              <span>$ </span>
              <span className="animate-pulse">_</span>
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
