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

interface VulnerabilitiesTabProps {
  isUploading: boolean;
  scanComplete: boolean;
  vulnerabilities: Vulnerability[];
  selectedSeverity: "ALL" | "Critical" | "High" | "Medium" | "Low" | "Informational";
  setSelectedSeverity: (severity: "ALL" | "Critical" | "High" | "Medium" | "Low" | "Informational") => void;
  filteredVulnerabilities: Vulnerability[];
  getSeverityColor: (severity: string) => string;
  downloadPDF: () => void;
}

export function VulnerabilitiesTab({
  isUploading,
  scanComplete,
  vulnerabilities,
  selectedSeverity,
  setSelectedSeverity,
  filteredVulnerabilities,
  getSeverityColor,
  downloadPDF
}: VulnerabilitiesTabProps) {
  return (
    <>
      {!isUploading && (
        <>
          {!scanComplete && (
            <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Scan in progress</h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md">The scan is still running or results are being fetched. Check the Overview tab for live terminal output or wait a moment and switch back.</p>
            </div>
          )}
          <div className="bg-white shadow-sm border-x border-gray-200 flex flex-nowrap">
            {/* Total Vulnerabilities Card */}
            <div 
              onClick={() => setSelectedSeverity("ALL")}
              className={`flex-1 p-3 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                selectedSeverity === "ALL" 
                  ? "border-indigo-600 bg-indigo-50" 
                  : "border-indigo-500 bg-white"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">Total</p>
                  <div className="w-7 h-7 bg-indigo-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-indigo-600">{vulnerabilities.length}</p>
              </div>
            </div>

            {/* Critical Card */}
            <div 
              onClick={() => setSelectedSeverity("Critical")}
              className={`flex-1 p-3 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                String(selectedSeverity || '').toUpperCase() === "CRITICAL" 
                  ? "border-red-600 bg-red-50" 
                  : "border-red-500 bg-white"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">Critical</p>
                  <div className="w-7 h-7 bg-red-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'CRITICAL').length}
                </p>
              </div>
            </div>

            {/* High Card */}
            <div 
              onClick={() => setSelectedSeverity("High")}
              className={`flex-1 p-3 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                String(selectedSeverity || '').toUpperCase() === "HIGH" 
                  ? "border-orange-600 bg-orange-50" 
                  : "border-orange-500 bg-white"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">High</p>
                  <div className="w-7 h-7 bg-orange-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'HIGH').length}
                </p>
              </div>
            </div>

            {/* Medium Card */}
            <div 
              onClick={() => setSelectedSeverity("Medium")}
              className={`flex-1 p-3 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                String(selectedSeverity || '').toUpperCase() === "MEDIUM" 
                  ? "border-yellow-600 bg-yellow-50" 
                  : "border-yellow-500 bg-white"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">Medium</p>
                  <div className="w-7 h-7 bg-yellow-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'MEDIUM').length}
                </p>
              </div>
            </div>

            {/* Low Card */}
            <div 
              onClick={() => setSelectedSeverity("Low")}
              className={`flex-1 p-3 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                String(selectedSeverity || '').toUpperCase() === "LOW" 
                  ? "border-blue-600 bg-blue-50" 
                  : "border-blue-500 bg-white"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">Low</p>
                  <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'LOW').length}
                </p>
              </div>
            </div>

            {/* Informational Card */}
            <div 
              onClick={() => setSelectedSeverity("Informational")}
              className={`flex-1 p-3 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                String(selectedSeverity || '').toUpperCase() === "INFORMATIONAL" 
                  ? "border-gray-600 bg-gray-50" 
                  : "border-gray-500 bg-white"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">Informational</p>
                  <div className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-600">
                  {vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'INFORMATIONAL').length}
                </p>
              </div>
            </div>
          </div>

          {/* Identified Vulnerabilities */}
          <div className="card mt-3">
            <div className="card-padding border-b border-purple-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-card-title">Identified Vulnerabilities</h2>
                <p className="text-tiny">
                  {selectedSeverity === "ALL" 
                    ? "Detailed list of security issues found during the scan" 
                    : `Showing ${selectedSeverity.toLowerCase()} severity vulnerabilities`}
                </p>
              </div>
              {vulnerabilities.length > 0 && (
                <button
                  onClick={downloadPDF}
                  className="btn-secondary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm w-full sm:w-auto flex items-center justify-center gap-2"
                  title="Download PDF Report"
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
              )}
            </div>
            {filteredVulnerabilities.length === 0 ? (
              <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Vulnerabilities Found</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-md">
                  {vulnerabilities.length === 0 
                    ? "Great news! The security scan did not identify any vulnerabilities in this application. Your application appears to be secure."
                    : `No ${selectedSeverity.toLowerCase()} severity vulnerabilities found. Click on "Total" to view all vulnerabilities.`}
                </p>
              </div>
            ) : (
              <div className="responsive-table-container">
                <table className="responsive-table">
                  <colgroup>
                    <col style={{ width: '48px' }} />
                    <col style={{ width: '110px' }} />
                    <col style={{ width: '120px' }} />
                    {/* vulnerability column will take remaining space */}
                    <col />
                    <col style={{ width: '140px' }} />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: '140px' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">#</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Severity</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Scanner</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Vulnerability</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Target</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Port</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVulnerabilities.map((vuln, index) => {
                      const validationStatus = vuln.validation_runs && vuln.validation_runs.length > 0 
                        ? vuln.validation_runs[0].decision 
                        : 'pending';
                      const severitySafe = String(vuln.severity || 'Informational');
                      const severityUpper = severitySafe.toUpperCase();
                      
                      return (
                        <tr key={vuln.id || index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition-colors`}>
                          <td className="px-4 py-3 text-xs text-gray-700">{index + 1}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(severitySafe)}`}>
                              {severityUpper}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-gray-800">
                            {vuln.scanner_name || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-gray-800 break-words">
                            {vuln.title}
                            {vuln.raw_scanner_data?.details && (
                              <p className="text-xs text-gray-500 mt-1 whitespace-normal break-words">{vuln.raw_scanner_data.details}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {vuln.target_host}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{vuln.target_port}</span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              validationStatus === 'exploitable' ? 'bg-red-100 text-red-700' :
                              validationStatus === 'not_exploitable' ? 'bg-green-100 text-green-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {validationStatus === 'exploitable' ? 'Vulnerable' :
                               validationStatus === 'not_exploitable' ? 'Not Vulnerable' :
                               'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
