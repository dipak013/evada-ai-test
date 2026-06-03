"use client";
import { useState, useEffect, Suspense, useRef, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api-utils";
import { NetworkScanService } from "@/services/network-scan.service";

// Placeholder for optional tab that's currently disabled in JSX
const NetworkScanTab: any = () => null;

// Import tab components
import { OverviewTab } from "./OverviewTab";
import { VulnerabilitiesTab } from "./VulnerabilitiesTab";
// Network scan tab temporarily commented out per request
// import { NetworkScanTab } from "./NetworkScanTab";
import { ReportsTab } from "./ReportsTab";

// Import types and utilities
import type {
  Vulnerability,
  NetworkNode,
  NetworkEdge,
  NetworkScan,
  ParsedNetworkData,
  ScanData
} from "./types";
import { generateDetailedLogs, getSeverityColor, downloadPDF } from "./utils";

// Add traversal animation styles
const traversalStyles = `
  @keyframes traverseDown {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  .traverse-dot {
    animation: traverseDown 2s ease-in-out infinite;
  }
  .traverse-dot:nth-child(2) { animation-delay: 0.4s; }
  .traverse-dot:nth-child(3) { animation-delay: 0.8s; }
  .traverse-dot:nth-child(4) { animation-delay: 1.2s; }
  .traverse-dot:nth-child(5) { animation-delay: 1.6s; }
`;

function ScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");
  const appUuid = searchParams.get("appUuid");
  const appName = searchParams.get("appName");
  const fileName = searchParams.get("fileName");
  const scanUrl = searchParams.get("scanUrl");
  const requestedZapJobId = (searchParams.get("zapJobId") || "").trim();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(true);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [networkScan, setNetworkScan] = useState<NetworkScan | null>(null);
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "vulnerabilities" | "network" | "reports">("overview");
  const [selectedSeverity, setSelectedSeverity] = useState<"ALL" | "Critical" | "High" | "Medium" | "Low" | "Informational">("ALL");
  const terminalRef = useRef<HTMLDivElement>(null);
  const [parsedNetworkData, setParsedNetworkData] = useState<ParsedNetworkData | null>(null);
  const hasParsedNodes = (parsedNetworkData?.nodes?.length ?? 0) > 0;
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [isNetworkScanning, setIsNetworkScanning] = useState(false);
  const [networkScanError, setNetworkScanError] = useState<string | null>(null);
  const [zapJobId, setZapJobId] = useState<string | null>(requestedZapJobId || null);
  const [isZapTerminalActive, setIsZapTerminalActive] = useState(false);
  const [zapReportAvailable, setZapReportAvailable] = useState(false);
  const apiBase = useMemo(() => getApiBaseUrl(), []);
  const scanSourceText = useMemo(() => {
    if (fileName) {
      return `File: ${fileName}`;
    }
    if (scanUrl) {
      return `URL: ${scanUrl}`;
    }
    return "";
  }, [fileName, scanUrl]);

  const appendLogChunk = (chunk: string) => {
    if (!chunk) return;
    const lines = chunk
      .split(/\r?\n/)
      .map((line) => line.replace(/\r$/, ""));

    if (!lines.length) {
      return;
    }

    setLogLines((prev) => [...prev, ...lines]);
  };

  const handleDownloadTerminalLog = useCallback(() => {
    const text = logLines.join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeAppName = (appName || "scan")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "scan";

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeAppName}-terminal-log-${timestamp}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [appName, logLines]);

  const mapZapRiskToSeverity = useCallback(
    (risk: unknown): Vulnerability["severity"] => {
      const normalized = String(risk || "").trim().toLowerCase();
      if (!normalized) return "Informational";
      if (normalized.includes("critical")) return "Critical";
      if (normalized.includes("high")) return "High";
      if (normalized.includes("medium")) return "Medium";
      // Treat explicit informational/info as its own category
      if (normalized.includes("inform") || normalized === "info") return "Informational";
      // Map anything else that looks like a low-risk descriptor to Low
      if (normalized.includes("low") || normalized.includes("minor") || normalized.includes("note")) return "Low";
      // Default to Informational to avoid incorrectly folding into Low
      return "Informational";
    },
    []
  );

  const tryLoadZapReport = useCallback(async () => {
    if (!zapJobId) {
      return false;
    }

    try {
      const response = await fetch(
        `${apiBase}/api/zap/jobs/${encodeURIComponent(zapJobId)}/report/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        return false;
      }

      const report = await response.json();
      const findings = Array.isArray(report?.findings) ? report.findings : [];

      const mappedVulnerabilities: Vulnerability[] = findings.map((finding: any, index: number) => {
        let targetHost = "unknown";
        let targetPort = 80;

        try {
          const parsedUrl = new URL(String(finding?.url || ""));
          targetHost = parsedUrl.hostname || targetHost;
          if (parsedUrl.port) {
            const parsedPort = Number.parseInt(parsedUrl.port, 10);
            if (Number.isFinite(parsedPort)) {
              targetPort = parsedPort;
            }
          } else if (parsedUrl.protocol === "https:") {
            targetPort = 443;
          }
        } catch {
          // Keep fallback host/port when finding URL is missing or malformed.
        }

        return {
          id: `zap-${zapJobId}-${index}`,
          application_id: appUuid || appId || "",
          job_id: zapJobId,
          scanner_name: "OWASP ZAP",
          title: String(finding?.title || "Untitled finding"),
          description: String(finding?.description || ""),
          remediation: String(finding?.solution || ""),
          severity: mapZapRiskToSeverity(finding?.risk),
          target_host: targetHost,
          target_port: targetPort,
          raw_scanner_data: {
            host: targetHost,
            port: targetPort,
            title: String(finding?.title || "Untitled finding"),
            details: String(finding?.description || ""),
            severity: String(finding?.risk || ""),
          },
          validation_runs: [],
        };
      });

      setVulnerabilities((prev) => {
        if (mappedVulnerabilities.length > 0) {
          return mappedVulnerabilities;
        }
        return prev;
      });

      setScanComplete(true);
      setZapReportAvailable(true);
      return true;
    } catch (error_) {
      console.warn("Failed to load ZAP report", error_);
      return false;
    }
  }, [apiBase, appId, appUuid, mapZapRiskToSeverity, zapJobId]);

  const handleNodeKeyDown = (event: React.KeyboardEvent, node: any) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNodeClick(node);
    }
  };

  const getServiceProductName = (serviceName?: string, product?: string) => {
    if (product) {
      return product;
    }
    if (serviceName === "http") {
      return "mini_httpd x.x";
    }
    if (serviceName === "domain") {
      return "dnsmasq";
    }
    return "Unknown";
  };

  const getVulnCount = (service: any, isVulnerable: boolean) => {
    if (service.findings?.length) {
      return service.findings.length;
    }
    if (!isVulnerable) {
      return 0;
    }
    return service.id.includes("443") ? 4 : 3;
  };

  // Handle node click with smooth scroll
  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setTimeout(() => {
      detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle network scan trigger
  const handleNetworkScan = async () => {
    try {
      setIsNetworkScanning(true);
      setNetworkScanError(null);
      
      // Get application details from scanData or construct from available data
      const applicationDetails = scanData?.application_configuration || {
        application_id: appId,
        application_uuid: appUuid,
        application_name: appName,
        // Add any other necessary application configuration
      };

      console.log('🔍 Triggering network scan with application details:', applicationDetails);
      
      const response = await NetworkScanService.scanNetwork({
        application_details: applicationDetails
      });

      console.log('✅ Network scan completed:', response);

      // Show loader for 2 minutes before displaying results
      await new Promise(resolve => setTimeout(resolve, 120000)); // 2 minutes = 120000ms

      // Parse the graph_json string
      const graphData = NetworkScanService.parseGraphJson(response.network_scan.graph_json);
      
      // Update network scan data
      const newNetworkScan: NetworkScan = {
        id: response.network_scan.id,
        application_id: appId || appUuid || '',
        job_id: scanData?.job?.job_id || '',
        graph_json: graphData,
        executed_at: response.network_scan.executed_at
      };
      
      setNetworkScan(newNetworkScan);
      
      // Update scanData if it exists
      if (scanData) {
        setScanData({
          ...scanData,
          network_scan: newNetworkScan
        });
      }
      
    } catch (error: any) {
      console.error('❌ Error triggering network scan:', error);
      setNetworkScanError(error?.response?.data?.message || error?.message || 'Failed to trigger network scan');
    } finally {
      setIsNetworkScanning(false);
    }
  };

  // Function to fetch fresh scan results from API
  const fetchScanResults = async (appUuid: string) => {
    try {
      console.log('🔄 Fetching fresh scan results from API for app UUID:', appUuid);
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/applications/${appUuid}/reports/latest/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        console.warn(`⚠️ API endpoint returned ${response.status} - this is expected if the endpoint doesn't exist yet`);
        return null;
      }

      const data = await response.json();
      console.log('✅ Received fresh scan data:', data);
      return data;
    } catch (error) {
      console.warn('⚠️ Error fetching scan results (this is normal if API endpoint is not implemented):', error);
      return null;
    }
  };

  // Ensure component is mounted before starting animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Resolve zap job id from query or session storage so live terminal can attach after navigation.
  useEffect(() => {
    if (requestedZapJobId) {
      setZapJobId(requestedZapJobId);
      return;
    }
    try {
      if (globalThis.window) {
        // Prefer a per-application localStorage entry only (do NOT use sessionStorage)
        const perAppKey = appId ? `scanResults_${appId}` : null;
        let raw = null;

        if (perAppKey && globalThis.window.localStorage) {
          raw = globalThis.window.localStorage.getItem(perAppKey);
        }

        if (!raw) return;
        const parsed = JSON.parse(raw);
        const fromStorage =
          (parsed?.zap_job_id ? String(parsed.zap_job_id).trim() : "") ||
          (parsed?.job_id ? String(parsed.job_id).trim() : "");

        if (fromStorage) {
          setZapJobId(fromStorage);
        }
      }
    } catch (error_) {
      console.warn("Failed to read zap job id from storage", error_);
    }
  }, [requestedZapJobId]);

  // Reuse the same SSE-based terminal stream behavior as the webapp scanner page.
  useEffect(() => {
    let es: EventSource | null = null;

    if (!mounted || !zapJobId) {
      return;
    }

    const url = `${apiBase}/api/zap/jobs/${encodeURIComponent(zapJobId)}/stream/`;
    const EventSourceCtor: any = (globalThis as any).EventSource;

    if (!EventSourceCtor) {
      return;
    }

    setIsZapTerminalActive(true);
    setZapReportAvailable(false);
    setLogLines((prev) =>
      prev.length > 0
        ? prev
        : [
            `[${new Date().toLocaleTimeString()}] Connecting to live ZAP terminal...`,
          ]
    );

    const stream: EventSource = new EventSourceCtor(url, { withCredentials: true });
    es = stream;
    stream.onmessage = (e: MessageEvent) => {
      appendLogChunk(String(e.data || ""));
    };
    stream.addEventListener("report", () => {
      setIsZapTerminalActive(false);
      void tryLoadZapReport();
    });
    stream.onerror = () => {
      // Browser handles retries for SSE; keep page usable while backend reconnects.
    };

    // If the report already exists (e.g., reconnect after completion), load it once.
    void tryLoadZapReport();

    return () => {
      if (es) {
        try {
          es.close();
        } catch {
          // no-op
        }
      }
      setIsZapTerminalActive(false);
    };
  }, [apiBase, mounted, tryLoadZapReport, zapJobId]);

  // Simulate file upload
  useEffect(() => {
    if (!mounted) return;

    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(uploadInterval);
        setTimeout(() => {
          setIsUploading(false);
        }, 500);
      }
    }, 150);

    return () => clearInterval(uploadInterval);
  }, [mounted]);

  // Auto-scroll terminal to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logLines]);

  // Load scan results from API or per-application localStorage
  useEffect(() => {
    if (!mounted || isUploading) return;

    const loadScanData = async () => {
      try {
        let parsedScanData: ScanData | null = null;
        let hasInProgressState = false;
        
        // First, try to fetch fresh data from API if we have an appUuid
        if (appUuid) {
          try {
            console.log('🔍 Attempting to fetch fresh scan results from API...');
            const freshData = await fetchScanResults(appUuid);
            if (freshData) {
              parsedScanData = freshData as ScanData;
              console.log('✅ Using fresh API data');

              // If API returned explicit vulnerabilities, prefer those immediately
              try {
                if (Array.isArray((freshData as any).vulnerabilities) && (freshData as any).vulnerabilities.length > 0) {
                  setVulnerabilities((freshData as any).vulnerabilities);
                  setScanComplete(true);
                } else if (Array.isArray((freshData as any).findings) && (freshData as any).findings.length > 0) {
                  // Map ZAP findings shape to our Vulnerability type (reuse mapping logic)
                  const findings = (freshData as any).findings as any[];
                  const mappedVulnerabilities = findings.map((finding: any, index: number) => {
                    let targetHost = "unknown";
                    let targetPort = 80;

                    try {
                      const parsedUrl = new URL(String(finding?.url || ""));
                      targetHost = parsedUrl.hostname || targetHost;
                      if (parsedUrl.port) {
                        const parsedPort = Number.parseInt(parsedUrl.port, 10);
                        if (Number.isFinite(parsedPort)) {
                          targetPort = parsedPort;
                        }
                      } else if (parsedUrl.protocol === "https:") {
                        targetPort = 443;
                      }
                    } catch {
                      // keep defaults
                    }

                    return {
                      id: `zap-${Date.now()}-${index}`,
                      application_id: appUuid || appId || "",
                      job_id: zapJobId || "",
                      scanner_name: "OWASP ZAP",
                      title: String(finding?.title || "Untitled finding"),
                      description: String(finding?.description || ""),
                      remediation: String(finding?.solution || ""),
                      severity: mapZapRiskToSeverity(finding?.risk),
                      target_host: targetHost,
                      target_port: targetPort,
                      raw_scanner_data: {
                        host: targetHost,
                        port: targetPort,
                        title: String(finding?.title || "Untitled finding"),
                        details: String(finding?.description || ""),
                        severity: String(finding?.risk || ""),
                      },
                      validation_runs: [],
                    } as Vulnerability;
                  });

                  if (mappedVulnerabilities.length > 0) {
                    setVulnerabilities(mappedVulnerabilities);
                    setScanComplete(true);
                    setZapReportAvailable(true);
                  }
                }
              } catch (mapErr) {
                console.warn('Failed to map API vulnerabilities:', mapErr);
              }
            }
          } catch (apiError) {
            console.warn('⚠️ API fetch failed, falling back to localStorage:', apiError);
          }
        }

        // If API fetch failed or no appId, fall back to per-application localStorage
        if (!parsedScanData) {
          try {
            if (!appId || !globalThis.window?.localStorage) {
              // nothing to fall back to
            } else {
              const scanResultsStr = globalThis.window.localStorage.getItem(`scanResults_${appId}`);
              if (scanResultsStr) {
                let scanResults;
                try {
                  scanResults = JSON.parse(scanResultsStr);
                  console.log('📦 Using localStorage per-app data');
                  if (!zapJobId) {
                    const sessionZapJobId =
                      (scanResults?.zap_job_id ? String(scanResults.zap_job_id).trim() : "") ||
                      (scanResults?.job_id ? String(scanResults.job_id).trim() : "");

                    if (sessionZapJobId) {
                      setZapJobId(sessionZapJobId);
                    }
                  }
                } catch (parseErr) {
                  console.error('Failed to parse scan results from localStorage:', parseErr);
                  throw new Error('Invalid scan results format');
                }

                if (scanResults?.inProgress && typeof scanResults?.output === "string" && scanResults.output.trim()) {
                  hasInProgressState = true;
                  appendLogChunk(scanResults.output);
                }

                // First, check if scanResults itself is the data (from new immediate navigation)
                if (scanResults.job || scanResults.vulnerabilities || scanResults.network_scan) {
                  parsedScanData = scanResults as ScanData;
                } else if (scanResults.output) {
                  try {
                    // Try to parse output as JSON directly
                    parsedScanData = JSON.parse(scanResults.output);
                  } catch (error_) {
                    console.warn('Failed to parse scan output as JSON directly:', error_);
                    // Extract JSON from output - look for "Complete Scan Data:"
                    try {
                      const outputText = scanResults.output;
                      const jsonStart = outputText.indexOf('Complete Scan Data:');
                      if (jsonStart !== -1) {
                        const jsonText = outputText.substring(jsonStart + 'Complete Scan Data:'.length).trim();
                        parsedScanData = JSON.parse(jsonText);
                      }
                    } catch (error_) {
                      console.warn('Could not parse scan data from output marker:', error_);
                    }
                  }
                }
              }
            }
          } catch (err) {
            console.warn('Error reading fallback localStorage scan results', err);
          }
        }
        
        if (parsedScanData) {
          if (!(isZapTerminalActive || zapJobId)) {
            // Display generated logs with animation when no live terminal stream is available.
            const logs = generateDetailedLogs(parsedScanData);
            let currentIndex = 0;
            const displayInterval = setInterval(() => {
              if (currentIndex < logs.length) {
                setLogLines(logs.slice(0, currentIndex + 1));
                currentIndex++;
              } else {
                clearInterval(displayInterval);
              }
            }, 30); // 30ms per line for smooth animation
          }
          
          setScanComplete(true);
          // Set vulnerabilities and network scan from parsed data
          setScanData(parsedScanData);
          
          if (parsedScanData.vulnerabilities && Array.isArray(parsedScanData.vulnerabilities)) {
            setVulnerabilities(parsedScanData.vulnerabilities);
          }
          
          if (parsedScanData.network_scan) {
            setNetworkScan(parsedScanData.network_scan);
          }
          
          // Clear per-application localStorage after successful load
          try {
            if (appId && globalThis.window?.localStorage) {
              globalThis.window.localStorage.removeItem(`scanResults_${appId}`);
            }
          } catch (error_) {
            console.warn('Failed to clear scanResults from localStorage:', error_);
          }
        } else {
          if (hasInProgressState || zapJobId) {
            setScanComplete(false);
            if (logLines.length === 0) {
              setLogLines([`[${new Date().toLocaleTimeString()}] Waiting for live scan output...`]);
            }
          } else {
            // No scan results available
            setLogLines([`[${new Date().toLocaleTimeString()}] No scan results available`]);
            setScanComplete(true);
          }
        }
      } catch (err) {
        console.error('Error loading scan results:', err);
        setError(err instanceof Error ? err.message : 'Failed to load scan results');
        setLogLines([`[${new Date().toLocaleTimeString()}] Error: Failed to load scan results`]);
        setScanComplete(true);
      }
    };

    loadScanData();
  }, [mounted, isUploading, appUuid, isZapTerminalActive, zapJobId]);

  // Poll for updated scan results while scan is in progress
  useEffect(() => {
      if (!scanComplete && mounted) {
      console.log('\u23f3 Starting polling for scan updates...');
      const pollInterval = setInterval(() => {
        try {
          if (appId && globalThis.window?.localStorage) {
            const scanResultsStr = globalThis.window.localStorage.getItem(`scanResults_${appId}`);
            if (scanResultsStr) {
              const scanResults = JSON.parse(scanResultsStr);
              
              // Check if scan completed in background - either success:true OR not inProgress with actual data
              const isComplete = scanResults.inProgress === false || scanResults.message?.includes('completed successfully');
              
              if (isComplete) {
                console.log('\u2713 Scan completed, processing results...');
                // Parse the updated results
                let parsedScanData: ScanData | null = null;
                
                // Try to extract scan data from various response formats
                if (scanResults.job || scanResults.vulnerabilities || scanResults.network_scan) {
                  parsedScanData = scanResults as ScanData;
                  console.log('\u2713 Found scan data in response');
                } else if (scanResults.output) {
                  try {
                    // Try parsing output as JSON directly
                    parsedScanData = JSON.parse(scanResults.output);
                    console.log('\u2713 Parsed scan data from output');
                    } catch {
                    // Try to extract JSON from output text
                    try {
                      const outputText = scanResults.output;
                      const jsonStart = outputText.indexOf('Complete Scan Data:');
                      if (jsonStart !== -1) {
                        const jsonText = outputText.substring(jsonStart + 'Complete Scan Data:'.length).trim();
                        parsedScanData = JSON.parse(jsonText);
                        console.log('\u2713 Extracted scan data from output marker');
                      }
                    } catch (error_) {
                      console.warn('Could not parse updated scan results:', error_);
                    }
                  }
                }
                
                if (parsedScanData) {
                  console.log('\u2713 Updating UI with scan data');
                  setScanData(parsedScanData);
                  
                  if (parsedScanData.vulnerabilities && Array.isArray(parsedScanData.vulnerabilities)) {
                    console.log('\u2713 Updating vulnerabilities:', parsedScanData.vulnerabilities.length);
                    setVulnerabilities(parsedScanData.vulnerabilities);
                  }
                  
                  if (parsedScanData.network_scan) {
                    console.log('\u2713 Updating network scan');
                    setNetworkScan(parsedScanData.network_scan);
                  }
                  
                  if (!(isZapTerminalActive || zapJobId)) {
                    // Generate and display detailed logs with animation only for non-live mode.
                    const detailedLogs = generateDetailedLogs(parsedScanData);
                    let currentIndex = 0;
                    const displayInterval = setInterval(() => {
                      if (currentIndex < detailedLogs.length) {
                        setLogLines(detailedLogs.slice(0, currentIndex + 1));
                        currentIndex++;
                      } else {
                        clearInterval(displayInterval);
                      }
                    }, 30); // 30ms per line for smooth animation
                  }
                  
                  setScanComplete(true);
                  
                  // Clear per-application localStorage after successful processing
                  try {
                    if (appId && globalThis.window?.localStorage) {
                      globalThis.window.localStorage.removeItem(`scanResults_${appId}`);
                      console.log('\u2713 Cleared per-app localStorage');
                    }
                  } catch (cleanupErr) {
                    console.error('Failed to clear localStorage:', cleanupErr);
                  }
                } else {
                  console.warn('\u26a0 No parsable scan data found in completed response');
                }
              }
            }
          }
        } catch (err) {
          console.error('Error polling for scan updates:', err);
        }
      }, 2000); // Poll every 2 seconds

      return () => {
        console.log('\u23f9 Stopping poll interval');
        clearInterval(pollInterval);
      };
    }
  }, [scanComplete, mounted, isZapTerminalActive, zapJobId]);


  // Parse different JSON formats for network diagram
  const parseNetworkData = (data: any): ParsedNetworkData => {
    const nodes: NetworkNode[] = [];
    const edges: NetworkEdge[] = [];
    const meta: any = {};

    // New backend format: IP addresses as keys with services array
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      console.log('Parsing backend network scan format (IP-based)');
      
      // Extract network CIDR from IP addresses
      const ips = Object.keys(data);
      if (ips.length > 0) {
        const firstIp = ips[0];
        const ipParts = firstIp.split('.');
        if (ipParts.length === 4) {
          meta.cidr = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0/24`;
        }
      }
      meta.scan_time = new Date().toISOString();
      
      // Create network node
      if (meta.cidr) {
        nodes.push({
          id: meta.cidr,
          type: 'network',
          label: meta.cidr,
        });
      }
      
      // Parse each IP and its services
      Object.keys(data).forEach((ip: string) => {
        const hostData = data[ip];
        
        // Create host node
        const hostId = ip;
        nodes.push({
          id: hostId,
          type: 'host',
          label: ip,
          ip: ip,
          status: hostData.status,
        });
        
        // Connect network to host
        if (meta.cidr) {
          edges.push({
            source: meta.cidr,
            target: hostId,
          });
        }
        
        // Parse services
        if (hostData.services && Array.isArray(hostData.services)) {
          hostData.services.forEach((service: any, idx: number) => {
            const portId = `${hostId}:${service.port}`;
            
            // Check if service has vulnerabilities
            let hasVulns = false;
            let vulnFindings: any[] = [];
            
            if (service.vulns) {
              if (typeof service.vulns === 'object' && service.vulns !== null) {
                // Parse vulnerability object
                Object.keys(service.vulns).forEach(vulnName => {
                  const vulnDetails = service.vulns[vulnName];
                  if (vulnDetails && !vulnDetails.includes('None found') && 
                      !vulnDetails.includes("Couldn't find") &&
                      vulnDetails.includes('VULNERABLE')) {
                    hasVulns = true;
                    vulnFindings.push({
                      name: vulnName,
                      description: vulnDetails
                    });
                  }
                });
              }
            }
            
            nodes.push({
              id: portId,
              type: 'service',
              label: `${service.name} (${service.port})`,
              ip: hostId,
              ports: [service.port],
              service: service.name,
              product: service.product,
              status: 'open',
              exploitable: hasVulns,
              riskScore: hasVulns ? 'high' : 'low',
              findings: vulnFindings.length > 0 ? vulnFindings : undefined,
            });
            
            // Connect host to service
            edges.push({
              source: hostId,
              target: portId,
              label: service.name,
            });
          });
        }
      });
    }
    // Legacy format with nodes and edges arrays
    else if (data?.nodes && data?.edges) {
      console.log('Parsing legacy network data format');
      if (data.meta) Object.assign(meta, data.meta);
      
      // Parse nodes directly
      data.nodes.forEach((node: any) => {
        nodes.push({
          id: node.id,
          type: node.kind || node.type || 'host',
          label: node.label || node.id,
          ip: node.id.includes(':') ? node.id.split(':')[0] : (node.ip || node.id),
          ports: node.id.includes(':') ? [Number.parseInt(node.id.split(':')[1], 10)] : (node.ports || []),
          service: node.service,
          product: node.product,
          hostname: node.hostname,
          status: node.status,
          exploitable: node.exploitable,
          riskScore: node.riskScore,
          findings: node.findings,
        });
      });
      
      // Parse edges directly
      data.edges.forEach((edge: any) => {
        edges.push({
          source: edge.from || edge.source,
          target: edge.to || edge.target,
          label: edge.label,
        });
      });
    }
    else {
      console.warn('Unknown network data format:', data);
    }

    return { meta, nodes, edges };
  };

  // Parse network data when networkScan changes
  useEffect(() => {
    if (networkScan?.graph_json) {
      try {
        // Parse graph_json if it's a string
        let graphData = networkScan.graph_json;
        if (typeof graphData === 'string') {
          console.log('Parsing graph_json string...');
          graphData = JSON.parse(graphData);
        }
        
        const parsed = parseNetworkData(graphData);
        setParsedNetworkData(parsed);
        console.log('Parsed network data:', parsed);
      } catch (error) {
        console.error('Error parsing network data:', error);
      }
    }
  }, [networkScan]);

  const handleBack = () => {
    // Pass the scanned app ID back to configuration page
    router.push(`/configuration?scanned=${appId}`);
  };

  // Sort vulnerabilities by severity priority: Critical, High, Medium, Low, Informational
  const severityOrder: Record<string, number> = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
    INFORMATIONAL: 4,
  };

  const sortedVulnerabilities = useMemo(() => {
    return [...(vulnerabilities || [])].sort((a, b) => {
      const sa = (String(a?.severity || 'Informational')).toUpperCase();
      const sb = (String(b?.severity || 'Informational')).toUpperCase();
      const pa = severityOrder[sa] ?? 99;
      const pb = severityOrder[sb] ?? 99;
      if (pa !== pb) return pa - pb;
      // fallback: stable sort by title
      return String(a?.title || a?.name || '').localeCompare(String(b?.title || b?.name || ''));
    });
  }, [vulnerabilities]);

  // Filter vulnerabilities based on selected severity (apply after sorting)
  const filteredVulnerabilities = selectedSeverity === "ALL"
    ? sortedVulnerabilities
    : sortedVulnerabilities.filter(v => (String(v.severity || 'Informational')).toUpperCase() === selectedSeverity.toUpperCase());

  // Wrapper for downloadPDF utility function
  const handleDownloadPDF = () => {
    downloadPDF(appName || "Application", scanUrl, vulnerabilities);
  };

  return (
    <div className="page-padding">
      <style dangerouslySetInnerHTML={{ __html: traversalStyles }} />
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-page-title">Security Scan - {appName}</h1>
          <p className="text-tiny">{scanSourceText}</p>
        </div>
        <button
          onClick={handleBack}
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white shadow w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Configuration
        </button>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <h2 className="text-lg font-semibold text-gray-900">Starting scan...</h2>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{uploadProgress}% uploaded</p>
        </div>
      )}

      {/* Tab Navigation */}
      {!isUploading && (
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden mt-4 md:mt-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-all ${
                activeTab === "overview"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("vulnerabilities")}
              className={`px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-all ${
                activeTab === "vulnerabilities"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Vulnerabilities
            </button>
            {/* Network Scan tab temporarily hidden
            <button
              onClick={() => setActiveTab("network")}
              className={`px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-all ${
                activeTab === "network"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Network Scan
            </button>
            */}
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-all ${
                activeTab === "reports"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Reports
            </button>
          </div>
        </div>
      )}

      {/* Overview Tab - Vulnerability Chart & Terminal */}
      {activeTab === "overview" && (
        <OverviewTab 
          isUploading={isUploading}
          vulnerabilities={sortedVulnerabilities}
          scanComplete={scanComplete || zapReportAvailable}
          logLines={logLines}
          terminalRef={terminalRef}
          onDownloadTerminalLog={handleDownloadTerminalLog}
        />
      )}

      {/* Vulnerabilities Tab - Vulnerability Summary */}
      {activeTab === "vulnerabilities" && (
        <VulnerabilitiesTab
          isUploading={isUploading}
          scanComplete={scanComplete}
          vulnerabilities={sortedVulnerabilities}
          selectedSeverity={selectedSeverity}
          setSelectedSeverity={setSelectedSeverity}
          filteredVulnerabilities={filteredVulnerabilities}
          getSeverityColor={getSeverityColor}
          downloadPDF={handleDownloadPDF}
        />
      )}

      {/* Network Scan Tab */}
      {/* Network Scan Tab temporarily hidden */}
      {false && (
        <NetworkScanTab
          isUploading={isUploading}
          networkScan={networkScan}
          parsedNetworkData={parsedNetworkData}
          isNetworkScanning={isNetworkScanning}
          networkScanError={networkScanError}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          handleNetworkScan={handleNetworkScan}
          handleNodeClick={handleNodeClick}
          detailPanelRef={detailPanelRef}
          networkVisualization={
            networkScan && hasParsedNodes && !isNetworkScanning && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Interactive Network Topology</h2>
                <p className="text-sm text-gray-600">Click on nodes to view detailed information</p>
              </div>
              
              {isNetworkScanning ? (
                // Show loader during network scan
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl p-16 border border-gray-200 shadow-sm relative">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Scanning Network Topology</h3>
                      <p className="text-sm text-gray-600 mb-4">Analyzing network structure and discovering devices...</p>
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                  <span className="text-xs text-gray-700 font-medium">Idle Hosts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                  <span className="text-xs text-gray-700 font-medium">Active Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
                  <span className="text-xs text-gray-700 font-medium">Multiple Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                  <span className="text-xs text-gray-700 font-medium">Vulnerabilities</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl p-8 border border-gray-200 shadow-sm relative">
                {/* Network Node */}
                {parsedNetworkData?.nodes?.filter(n => n.type === 'network').map((node, idx) => (
                  <div key={node.id || idx} className="flex flex-col items-center mb-8">
                    <div 
                      onClick={() => handleNodeClick(node)}
                      onKeyDown={(event) => handleNodeKeyDown(event, node)}
                      role="button"
                      tabIndex={0}
                      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className={`relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-lg px-6 py-3 shadow-md border-2 border-indigo-400/50 ${
                        selectedNode?.id === node.id ? 'ring-4 ring-purple-400 ring-offset-2' : ''
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
                        <div className="relative text-center">
                          <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider mb-1">Network Segment</div>
                          <div className="text-lg font-bold text-white">{node.label}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connection Line to hosts */}
                    <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-gray-400 relative shadow-sm">
                      {/* Animated traversal dots */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg traverse-dot"></div>
                      <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg traverse-dot"></div>
                      <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg traverse-dot"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-indigo-500 rounded-full shadow"></div>
                    </div>
                    
                    {/* Horizontal distribution line */}
                    <div className="relative w-full h-1">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[90%] h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent shadow-sm"></div>
                    </div>
                  </div>
                ))}

                {/* Host Nodes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 mb-8 relative">
                  {parsedNetworkData?.nodes?.filter(n => n.type === 'host').map((node, idx) => {
                    const serviceNodes = (parsedNetworkData?.nodes || []).filter((n: any) => 
                      (n.type === 'service' || n.type === 'port') && 
                      (n.ip === node.ip || n.label?.includes(node.label) || n.id?.startsWith(node.id))
                    );
                    const hasVulnerableService = serviceNodes.some((s: any) => s.exploitable || s.riskScore === 'high');
                    const serviceCount = serviceNodes.length;
                    
                    let colorClass, borderClass, iconBg;
                    if (hasVulnerableService) {
                      colorClass = 'from-red-500 to-red-600';
                      borderClass = 'border-red-400/60';
                      iconBg = 'bg-red-500';
                    } else if (serviceCount >= 3) {
                      colorClass = 'from-amber-500 to-amber-600';
                      borderClass = 'border-amber-400/60';
                      iconBg = 'bg-amber-500';
                    } else if (serviceCount > 0) {
                      colorClass = 'from-blue-500 to-blue-600';
                      borderClass = 'border-blue-400/60';
                      iconBg = 'bg-blue-500';
                    } else {
                      colorClass = 'from-emerald-500 to-emerald-600';
                      borderClass = 'border-emerald-400/60';
                      iconBg = 'bg-emerald-500';
                    }

                    return (
                      <div key={node.id || idx} className="flex flex-col items-center">
                        {/* Connection line from network to host */}
                        <div className="w-1 h-6 bg-gradient-to-b from-gray-500 to-gray-400 mb-1 shadow-sm relative">
                          {/* Animated dot - red if vulnerable, green if safe */}
                          <div className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-lg traverse-dot ${
                            hasVulnerableService ? 'bg-red-500' : 'bg-emerald-500'
                          }`}></div>
                        </div>
                        <div 
                          onClick={() => handleNodeClick(node)}
                          onKeyDown={(event) => handleNodeKeyDown(event, node)}
                          role="button"
                          tabIndex={0}
                          className="group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl w-full"
                        >
                          <div className={`relative bg-gradient-to-br ${colorClass} rounded px-2 py-1.5 shadow-md border-2 ${borderClass} ${
                            selectedNode?.id === node.id ? 'ring-4 ring-indigo-400 ring-offset-2' : ''
                          }`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded"></div>
                            {hasVulnerableService && (
                              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white text-[8px] font-bold">!</span>
                              </div>
                            )}
                            <div className="relative text-center">
                              <div className="text-[8px] font-semibold text-white/90 uppercase tracking-wide mb-0.5">Host</div>
                              <div className="text-[11px] font-bold text-white leading-tight">{node.label}</div>
                              <div className="mt-0.5 flex items-center justify-center gap-0.5">
                                <div className={`w-1 h-1 rounded-full ${iconBg} shadow-sm`}></div>
                                <span className="text-[8px] text-white/90 font-medium">
                                  {serviceCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Services under host */}
                        {serviceCount > 0 && (
                          <div className="mt-1 space-y-0.5 w-full">
                            {/* Connection line to services */}
                            <div className="flex justify-center mb-1">
                              <div className="w-1 h-4 bg-gradient-to-b from-gray-500 to-gray-400 shadow-sm relative">
                                {/* Animated dot - red if any service vulnerable, green otherwise */}
                                <div className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-lg traverse-dot ${
                                  hasVulnerableService ? 'bg-red-500' : 'bg-emerald-500'
                                }`}></div>
                              </div>
                            </div>
                            {serviceNodes.map((service: any, sIdx: number) => (
                              <div 
                                key={service.id || sIdx}
                                onClick={() => handleNodeClick(service)}
                                onKeyDown={(event) => handleNodeKeyDown(event, service)}
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer transition-all duration-200 hover:scale-105"
                              >
                                <div className={`bg-white rounded px-1 py-0.5 border-2 ${
                                  selectedNode?.id === service.id ? 'ring-2 ring-indigo-400 ring-offset-1' : ''
                                } ${
                                  service.exploitable || service.riskScore === 'high' 
                                    ? 'border-red-400 bg-red-50' 
                                    : 'border-emerald-200 bg-emerald-50'
                                } shadow-sm`}>
                                  <div className="flex items-center justify-between gap-0.5">
                                    <div className="flex items-center gap-0.5 min-w-0">
                                      {(service.exploitable || service.riskScore === 'high') && (
                                        <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></span>
                                      )}
                                      <span className="text-[8px] font-semibold text-gray-700 truncate">
                                        {service.service || service.label || 'Unknown'}
                                      </span>
                                    </div>
                                    <span className={`text-[8px] font-mono px-1 py-0.5 rounded flex-shrink-0 ${
                                      service.exploitable || service.riskScore === 'high'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-emerald-500 text-white'
                                    }`}>
                                      {service.ports?.[0] || service.label?.match(/\\d+/)?.[0] || '?'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Selected Node Details Panel */}
                {selectedNode && (
                  <div ref={detailPanelRef} className="mt-8 scroll-mt-4">
                    {/* Network Overview */}
                    {selectedNode.type === 'network' && (
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">Network Overview</h3>
                            <button 
                              onClick={() => setSelectedNode(null)}
                              className="text-sm text-gray-500 hover:text-gray-700 transition-colors mt-1"
                            >
                              Close
                            </button>
                          </div>
                        </div>

                        <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold mb-6">
                          {selectedNode.label}
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Network Statistics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Total Hosts</p>
                              <p className="text-3xl font-bold text-gray-800">
                                {parsedNetworkData?.nodes.filter(n => n.type === 'host').length || 0}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Active Hosts</p>
                              <p className="text-3xl font-bold text-blue-600">
                                {parsedNetworkData?.nodes.filter(n => n.type === 'host' && (parsedNetworkData?.nodes || []).some(s => (s.type === 'service' || s.type === 'port') && (s.ip === n.ip || s.id?.startsWith(n.id)))).length || 0}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Vulnerable</p>
                              <p className="text-3xl font-bold text-red-600">
                                {parsedNetworkData?.nodes.filter(n => n.type === 'host' && (parsedNetworkData?.nodes || []).some(s => (s.type === 'service' || s.type === 'port') && (s.ip === n.ip || s.id?.startsWith(n.id)) && (s.exploitable || s.riskScore === 'high'))).length || 0}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Services</p>
                              <p className="text-3xl font-bold text-amber-600">
                                {parsedNetworkData?.nodes.filter(n => n.type === 'service' || n.type === 'port').length || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">⚠</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-red-700 mb-1">Security Summary</p>
                              <p className="text-sm text-red-600">
                                <span className="font-bold">Risk Level: High</span>
                              </p>
                              <p className="text-sm text-red-600 mt-1">
                                {parsedNetworkData?.nodes.filter(n => n.type === 'host' && (parsedNetworkData?.nodes || []).some(s => (s.type === 'service' || s.type === 'port') && (s.ip === n.ip || s.id?.startsWith(n.id)) && (s.exploitable || s.riskScore === 'high'))).length || 0} hosts with identified vulnerabilities
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Host/IP Details */}
                    {selectedNode.type === 'host' && (() => {
                      const hostServices = parsedNetworkData?.nodes.filter((n: any) => 
                        (n.type === 'service' || n.type === 'port') && 
                        (n.ip === selectedNode.ip || n.label?.includes(selectedNode.label) || n.id?.startsWith(selectedNode.id))
                      ) || [];
                      const vulnerableServices = hostServices.filter((s: any) => s.exploitable || s.riskScore === 'high');
                      
                      return (
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{selectedNode.ip || selectedNode.label}</h3>
                                {vulnerableServices.length > 0 && (
                                  <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded mt-1">
                                    UP ⚠
                                  </span>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedNode(null)}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          <h4 className="text-sm font-semibold text-gray-700 mb-4">Detected Services ({hostServices.length})</h4>
                          
                          <div className="space-y-3">
                            {hostServices.map((service: any, idx: number) => {
                              const isVulnerable = service.exploitable || service.riskScore === 'high';
                              const vulnCount = getVulnCount(service, isVulnerable);
                              
                              return (
                                <div 
                                  key={service.id || `${selectedNode.id}-${service.ports?.[0] || idx}`}
                                  onClick={() => handleNodeClick(service)}
                                  onKeyDown={(event) => handleNodeKeyDown(event, service)}
                                  role="button"
                                  tabIndex={0}
                                  className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] rounded-lg p-4 border-2 ${
                                    selectedNode?.id === service.id ? 'ring-2 ring-indigo-400 ring-offset-2' : ''
                                  } ${
                                    isVulnerable ? 'bg-red-50 border-red-400' : 'bg-emerald-50 border-emerald-200'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isVulnerable ? 'bg-red-500' : 'bg-emerald-500'
                                      }`}>
                                        <span className="text-white text-xs font-bold">•</span>
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-gray-800">{service.service || service.label || 'Unknown'}</p>
                                        <p className="text-xs text-gray-600 mt-1">
                                          {getServiceProductName(service.service, service.product)}
                                        </p>
                                        {isVulnerable && (
                                          <div className="mt-2 flex items-center gap-2">
                                            <span className="text-xs font-bold text-red-700">⚠ {vulnCount} Vulnerabilities Detected</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                                      isVulnerable ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                                    }`}>
                                      {service.ports?.[0] || service.label?.match(/\d+/)?.[0] || '?'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Service/Port Details */}
                    {(selectedNode.type === 'service' || selectedNode.type === 'port') && (() => {
                      const isVulnerable = selectedNode.exploitable || selectedNode.riskScore === 'high';
                      const portNumber = selectedNode.ports?.[0] || selectedNode.label?.match(/\d+/)?.[0] || '?';
                      
                      return (
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Service Details</h3>
                            <button 
                              onClick={() => {
                                // Go back to host view
                                const hostNode = parsedNetworkData?.nodes.find(n => 
                                  n.type === 'host' && (n.ip === selectedNode.ip || selectedNode.id?.startsWith(n.id))
                                );
                                if (hostNode) setSelectedNode(hostNode);
                                else setSelectedNode(null);
                              }}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          <div className="mb-6">
                            <span className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${
                              isVulnerable ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                            }`}>
                              Port {portNumber}
                            </span>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
                            <div>
                              <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Host IP:</span>
                              <p className="text-sm font-mono text-gray-800 mt-1">{selectedNode.ip}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Service:</span>
                              <p className="text-sm text-gray-800 mt-1">{selectedNode.service || selectedNode.label || 'Unknown'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Product:</span>
                              <p className="text-sm text-gray-800 mt-1">
                                {getServiceProductName(selectedNode.service, selectedNode.product)}
                              </p>
                            </div>
                          </div>

                          {isVulnerable ? (
                            <div className="bg-red-50 border border-red-400 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-red-700 font-bold text-sm">⚠ Vulnerable</span>
                              </div>

                              <div className="mt-4">
                                <h4 className="text-sm font-bold text-gray-800 mb-3">Vulnerability Details</h4>
                                
                                <div className="bg-red-900/10 border border-red-300 rounded-lg p-4">
                                  <h5 className="text-sm font-bold text-red-800 mb-2">HTTP SLOWLORIS CHECK</h5>
                                  
                                  <div className="space-y-2 text-sm text-gray-700">
                                    <div>
                                      <span className="font-semibold">VULNERABLE:</span>
                                      <p className="mt-1">Slowloris DOS attack</p>
                                    </div>
                                    <div>
                                      <span className="font-semibold">State:</span> LIKELY VULNERABLE
                                    </div>
                                    <div>
                                      <span className="font-semibold">IDs:</span> CVE:CVE-2007-6750
                                    </div>
                                    <div className="pt-2">
                                      <p className="text-xs leading-relaxed">
                                        Slowloris tries to keep many connections to the target web server open and hold them open as long as possible. It accomplishes this by opening connections to the target web server and sending a partial request. By doing so, it starves the http server's resources causing Denial Of Service.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-emerald-50 border border-emerald-400 rounded-lg p-4">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-emerald-700 font-bold text-sm">✓ Secure</span>
                              </div>
                              <p className="text-sm text-emerald-700 mt-2">No vulnerabilities detected for this service</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
              </>
              )}
            </div>
            )
          }
        />
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <ReportsTab
          isUploading={isUploading}
          vulnerabilities={sortedVulnerabilities}
          downloadPDF={handleDownloadPDF}
        />
      )}
    </div>
  );
}
export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading scan page...</p>
          </div>
        </div>
      </div>
    }>
      <ScanContent />
    </Suspense>
  );
}