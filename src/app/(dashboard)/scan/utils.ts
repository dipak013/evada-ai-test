// Utility functions for scan page

import type { ScanData, Vulnerability } from './types';

/**
 * Generate detailed logs from scan data
 */
export function generateDetailedLogs(parsedData: ScanData): string[] {
  const logs: string[] = [];
  const timestamp = () => `[${new Date().toLocaleTimeString()}]`;
  
  logs.push(`${timestamp()} Connecting to backend...`);
  logs.push(`${timestamp()} Starting vulnerability assessment...`);
  logs.push(`${timestamp()} Initiating security scan...`);
  logs.push('');
  
  // Job information
  if (parsedData.job) {
    logs.push(`${timestamp()} Job ID: ${parsedData.job.job_id}`);
    logs.push(`${timestamp()} Application: ${parsedData.job.application_id}`);
    logs.push(`${timestamp()} Status: ${parsedData.job.status}`);
    logs.push('');
  }
  
  // Network scan details
  if (parsedData.network_scan?.graph_json) {
    logs.push(`${timestamp()} Analyzing network topology...`);
    const graph = parsedData.network_scan.graph_json;
    
    if (graph.nodes && graph.edges) {
      const hosts = graph.nodes.filter((n: any) => n.type === 'host');
      const services = graph.nodes.filter((n: any) => n.type === 'service' || n.type === 'port');
      
      logs.push(`${timestamp()} Network scan completed`);
      logs.push(`${timestamp()}   - Total nodes discovered: ${graph.nodes.length}`);
      logs.push(`${timestamp()}   - Hosts found: ${hosts.length}`);
      logs.push(`${timestamp()}   - Services detected: ${services.length}`);
      logs.push(`${timestamp()}   - Network connections: ${graph.edges.length}`);
      
      // Show each host
      hosts.forEach((host: any, idx: number) => {
        const hostServices = services.filter((s: any) => 
          s.id.startsWith(host.id) || s.label?.includes(host.label)
        );
        logs.push(`${timestamp()}   [Host ${idx + 1}] ${host.label} (${hostServices.length} services)`);
      });
      
      logs.push('');
    }
  }
  
  // Baseline scan details
  if (parsedData.baseline_scan) {
    logs.push(`${timestamp()} Baseline scan executed`);
    logs.push(`${timestamp()}   - Target: ${parsedData.baseline_scan.result?.host || 'N/A'}`);
    logs.push(`${timestamp()}   - Open ports: ${parsedData.baseline_scan.result?.open_ports?.length || 0}`);
    logs.push('');
  }
  
  // Vulnerability scanning
  logs.push(`${timestamp()} Running vulnerability scanners...`);
  
  if (parsedData.vulnerabilities && parsedData.vulnerabilities.length > 0) {
    logs.push(`${timestamp()} Found ${parsedData.vulnerabilities.length} potential vulnerabilities`);
    logs.push('');
    logs.push(`${timestamp()} Validating vulnerabilities...`);
    
    // Count by severity
    const severityCounts = parsedData.vulnerabilities.reduce((acc: any, vuln: Vulnerability) => {
      const sev = String(vuln.severity || 'Informational').toLowerCase();
      acc[sev] = (acc[sev] || 0) + 1;
      return acc;
    }, {});
    
    if (severityCounts.critical) logs.push(`${timestamp()}   - Critical: ${severityCounts.critical}`);
    if (severityCounts.high) logs.push(`${timestamp()}   - High: ${severityCounts.high}`);
    if (severityCounts.medium) logs.push(`${timestamp()}   - Medium: ${severityCounts.medium}`);
    if (severityCounts.low) logs.push(`${timestamp()}   - Low: ${severityCounts.low}`);
    if (severityCounts.informational) logs.push(`${timestamp()}   - Informational: ${severityCounts.informational}`);
    logs.push('');
    
    // Show each vulnerability being validated
    parsedData.vulnerabilities.forEach((vuln: Vulnerability, idx: number) => {
      logs.push(`${timestamp()} [${idx + 1}/${parsedData.vulnerabilities.length}] ${vuln.title}`);
      logs.push(`${timestamp()}     Scanner: ${vuln.scanner_name}`);
      logs.push(`${timestamp()}     Severity: ${String(vuln.severity || 'Informational')}`);
      logs.push(`${timestamp()}     Target: ${vuln.target_host}:${vuln.target_port}`);
      
      if (vuln.validation_runs && vuln.validation_runs.length > 0) {
        const validationStatus = vuln.validation_runs[0].decision;
        logs.push(`${timestamp()}     Validation: ${String(validationStatus || '').toUpperCase()}`);
      }
    });
    
    logs.push('');
    logs.push(`${timestamp()} Vulnerability assessment completed`);
  } else {
    logs.push(`${timestamp()} No vulnerabilities found`);
  }
  
  logs.push('');
  logs.push(`${timestamp()} Scan completed successfully`);
  logs.push(`${timestamp()} Generating report...`);
  
  return logs;
}

/**
 * Get Tailwind CSS classes for severity levels
 */
export function getSeverityColor(severity: string): string {
  const severityUpper = severity.toUpperCase();
  switch (severityUpper) {
    case "CRITICAL":
      return "bg-red-100 text-red-700 border-red-300";
    case "HIGH":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "LOW":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "INFORMATIONAL":
      return "bg-gray-100 text-gray-700 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

/**
 * Generate and download PDF report of vulnerabilities
 */
export function downloadPDF(
  appName: string,
  scanUrl: string | null,
  vulnerabilities: Vulnerability[]
): void {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Security Scan Report - ${appName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #4F46E5; margin-bottom: 10px; }
          .meta { color: #6B7280; font-size: 14px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
          th { background-color: #4F46E5; color: white; font-weight: 600; }
          tr:nth-child(even) { background-color: #F9FAFB; }
          .critical { background-color: #FEE2E2; color: #991B1B; font-weight: bold; }
          .high { background-color: #FED7AA; color: #9A3412; font-weight: bold; }
          .medium { background-color: #FEF3C7; color: #92400E; font-weight: bold; }
          .low { background-color: #DBEAFE; color: #1E40AF; font-weight: bold; }
          .informational { background-color: #F3F4F6; color: #374151; font-weight: bold; }
          .summary { margin-top: 20px; display: flex; gap: 20px; }
          .stat { padding: 10px; border-radius: 8px; text-align: center; min-width: 100px; }
        </style>
      </head>
      <body>
        <h1>Security Scan Report</h1>
        <div class="meta">
          <strong>Application:</strong> ${appName}<br>
          ${scanUrl ? `<strong>URL:</strong> ${scanUrl}<br>` : ''}
          <strong>Scan Date:</strong> ${new Date().toLocaleString()}<br>
          <strong>Total Vulnerabilities:</strong> ${vulnerabilities.length}
        </div>
        
        <div class="summary">
          <div class="stat critical">
            <div style="font-size: 24px; font-weight: bold;">${vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'CRITICAL').length}</div>
            <div>Critical</div>
          </div>
          <div class="stat high">
            <div style="font-size: 24px; font-weight: bold;">${vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'HIGH').length}</div>
            <div>High</div>
          </div>
          <div class="stat medium">
            <div style="font-size: 24px; font-weight: bold;">${vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'MEDIUM').length}</div>
            <div>Medium</div>
          </div>
          <div class="stat low">
            <div style="font-size: 24px; font-weight: bold;">${vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'LOW').length}</div>
            <div>Low</div>
          </div>
          <div class="stat informational">
            <div style="font-size: 24px; font-weight: bold;">${vulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === 'INFORMATIONAL').length}</div>
            <div>Informational</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Severity</th>
              <th>Scanner</th>
              <th>Vulnerability</th>
              <th>Target</th>
              <th>Port</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${vulnerabilities.map((v, idx) => {
              const validationStatus = v.validation_runs && v.validation_runs.length > 0 
                ? v.validation_runs[0].decision 
                : 'pending';
              const severityClass = String(v.severity || 'Informational').toLowerCase();
              
              return `
                <tr>
                  <td>${idx + 1}</td>
                  <td class="${severityClass}">${String(v.severity || 'Informational').toUpperCase()}</td>
                  <td>${v.scanner_name || 'N/A'}</td>
                  <td>${v.title}</td>
                  <td>${v.target_host}</td>
                  <td>${v.target_port}</td>
                  <td>${validationStatus === 'exploitable' ? 'Vulnerable' : 
                       validationStatus === 'not_exploitable' ? 'Not Vulnerable' : 'Pending'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
