"use client";
import { useState } from "react";

export default function SettingsPage() {
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

  return (
    <div className="page-padding">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-page-title">Log Report</h1>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Left Column - Live Output Stream */}
        <div className="bg-gray-900 rounded-xl p-4 shadow-lg h-[350px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-xs font-semibold text-white">LIVE OUTPUT STREAM</h3>
          </div>
          <div className="space-y-1 font-mono text-xs text-green-400 h-[280px] overflow-auto">
            {liveOutput.map((line, index) => (
              <p key={`${line}-${index}`}>{line || "\u00A0"}</p>
            ))}
            <p className="flex items-center gap-1 mt-8">
              <span>$ </span>
              <span className="animate-pulse">_</span>
            </p>
          </div>
        </div>

        {/* Right Column - Charts Container */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 h-[350px] overflow-auto">
          {/* Pie Chart */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Pie Chart</h3>
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

            <div className="grid grid-cols-3 gap-4">
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

          {/* Bar Chart */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Bar Chart</h3>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Yearly</option>
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
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
            <div className="h-32">
              <svg className="w-full h-full" viewBox="0 0 500 180">
                {/* Grid lines */}
                {[0, 20, 40, 60, 80].map((val) => (
                  <line
                    key={val}
                    x1="40"
                    y1={140 - val * 1.5}
                    x2="480"
                    y2={140 - val * 1.5}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                {/* Y-axis labels */}
                {[0, 20, 40, 60, 80].map((val) => (
                  <text key={val} x="10" y={145 - val * 1.5} fontSize="10" fill="#999">
                    {val}
                  </text>
                ))}
                {/* Bars */}
                {barChartData.map((d, i) => (
                  <g key={d.year}>
                    <rect
                      x={60 + i * 60}
                      y={140 - d.value * 1.5}
                      width="40"
                      height={d.value * 1.5}
                      fill="#6366f1"
                      rx="3"
                    />
                    <text x={70 + i * 60} y="165" fontSize="10" fill="#999">
                      {d.year}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
