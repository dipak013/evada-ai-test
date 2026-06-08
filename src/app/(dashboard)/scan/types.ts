// Type definitions for scan page components

export interface ValidationEvidence {
  id: string;
  validation_run_id: string;
  execution_log: string;
}

export interface ValidationRun {
  id: string;
  vulnerability_id: string;
  method: string;
  decision: string;
  reason: string;
  executed_at: string;
  evidence: ValidationEvidence[];
}

export interface RawScannerData {
  host: string;
  port: number;
  title: string;
  details: string;
  severity: string;
}

export interface Vulnerability {
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

export interface NetworkNode {
  id: string;
  type: string;
  label: string;
  ip?: string;
  ports?: number[];
  service?: string;
  product?: string;
  status?: string;
  riskScore?: string;
  hostname?: string;
  exploitable?: boolean;
  findings?: any[];
}

export interface NetworkEdge {
  source: string;
  target: string;
  label?: string;
}

export interface NetworkScan {
  id: string;
  application_id: string;
  job_id: string;
  graph_json: any;
  executed_at: string;
}

export interface ParsedNetworkData {
  meta: {
    cidr?: string;
    scan_time?: string;
    scan_id?: string;
    risk_level?: string;
    [key: string]: any;
  };
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface BaselineScan {
  id: string;
  application_id: string;
  job_id: string;
  result: {
    host: string;
    open_ports: number[];
    executed_at: string;
    http_checks: any;
  };
  executed_at: string;
}

export interface ScanData {
  job: {
    job_id: string;
    application_id: string;
    status: string;
    started_at: string;
    completed_at: string;
    error_message: string | null;
  };
  application_configuration: any;
  baseline_scan: BaselineScan;
  network_scan: NetworkScan;
  vulnerabilities: Vulnerability[];
}

export interface PortInfo {
  port: number;
  status: string;
  risk?: string;
}

export interface HostInfo {
  id: number;
  ipAddress: string;
  openPorts: PortInfo[];
  risk: string;
}
