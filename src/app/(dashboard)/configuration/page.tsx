"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UnifiedAPIService, ScheduleData } from "@/services/unified-api.service";
import { ZapService } from "@/services/zap.service";
import ConfigureApplicationModal from "@/components/ConfigureApplicationModal";
import ScheduleScanModal from "@/components/ScheduleScanModal";

interface Application {
  id: number;
  name: string;
  configuration: string;
  startDate: string;
  status: "Enabled" | "Disabled";
  scanned?: boolean;
  scanOnDemand?: boolean;
  scanUrl?: string;
  app_uuid?: string;
  // Full configuration fields for editing
  application_name?: string;
  description?: string;
  target_host?: string;
  target_port?: number;
  base_url?: string;
  environment?: string;
  baseline_ttl?: number;
  enable_baseline_scan?: boolean;
  baseline_start_date?: string;
  scan_scope?: string;
  selected_pages_to_scan?: string;
  from_scanner_output?: boolean;
  paths_to_exclude?: string;
  network_cidr?: string;
  allowed_ports?: string;
}

function mapConfigToApplication(config: any): Application {
  const isActive = config.is_active === undefined ? true : Boolean(config.is_active);

  return {
    id: config.id,
    name: config.application_name,
    configuration: config.target_host,
    startDate: config.baseline_start_date
      ? new Date(config.baseline_start_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-",
    status: isActive ? "Enabled" : "Disabled",
    scanned: false,
    scanOnDemand: false,
    scanUrl: config.target_host,
    app_uuid: config.app_uuid,
    application_name: config.application_name,
    description: config.description,
    target_host: config.target_host,
    target_port: config.target_port,
    base_url: config.base_url,
    environment: config.environment,
    baseline_ttl: config.baseline_ttl,
    enable_baseline_scan: config.enable_baseline_scan,
    baseline_start_date: config.baseline_start_date
      ? (() => {
          try {
            const d = new Date(config.baseline_start_date);
            const pad = (n: number) => n.toString().padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          } catch (e) {
            return config.baseline_start_date;
          }
        })()
      : "",
    scan_scope: config.scan_scope,
    selected_pages_to_scan: config.selected_pages_to_scan,
    from_scanner_output: config.from_scanner_output,
    paths_to_exclude: config.paths_to_exclude,
    network_cidr: config.network_cidr,
    allowed_ports: config.allowed_ports,
  };
}

function setScanResultState(payload: unknown, appId?: number) {
  try {
    // Use localStorage per-application only. Do NOT use sessionStorage.
    if (typeof appId !== 'undefined' && appId !== null && globalThis.window?.localStorage) {
      try {
        globalThis.window.localStorage.setItem(`scanResults_${appId}`, JSON.stringify(payload));
      } catch (err) {
        // ignore storage errors
      }
    }
  } catch (err) {
    console.warn('setScanResultState storage failed', err);
  }
}

function storeScanResultInLocal(appId: number, payload: unknown) {
  if (globalThis.window?.localStorage) {
    globalThis.window.localStorage.setItem(`scanResults_${appId}`, JSON.stringify(payload));
  }
}

function createSchedulePayload(scheduleData: any): ScheduleData {
  const { applicationId, scheduleType } = scheduleData;

  if (scheduleType === "once") {
    return {
      schedule_type: "once",
      application_id: applicationId,
      scheduled_date: scheduleData.date,
      scheduled_time: scheduleData.time,
    };
  }

  if (scheduleType === "recurring") {
    return {
      schedule_type: "recurring",
      application_id: applicationId,
      frequency: scheduleData.frequency,
      start_date: scheduleData.startDate,
      scheduled_time: scheduleData.time,
    };
  }

  if (scheduleType === "weekday") {
    return {
      schedule_type: "weekday",
      application_id: applicationId,
      weekday: scheduleData.weekday,
      scheduled_time: scheduleData.time,
    };
  }

  throw new Error("Invalid schedule type");
}

function getScheduleTypeBadgeClass(scheduleType: string): string {
  if (scheduleType === "once") {
    return "bg-blue-100 text-blue-700";
  }
  if (scheduleType === "recurring") {
    return "bg-purple-100 text-purple-700";
  }
  return "bg-indigo-100 text-indigo-700";
}

function getPaginationButtonClass(currentPage: number, page: number): string {
  if (currentPage === page) {
    return "bg-gradient-to-r from-indigo-600 to-purple-600 text-white";
  }
  if (page === -1) {
    return "text-gray-400 cursor-default";
  }
  return "text-gray-600 hover:bg-gray-50";
}

function ConfigurationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<Application | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState<Application | null>(null);
  const [showScheduleDetailsModal, setShowScheduleDetailsModal] = useState(false);
  const [scheduleDetails, setScheduleDetails] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus] = useState<"all" | "Enabled" | "Disabled">("all");
  const [scanningAppId, setScanningAppId] = useState<number | null>(null);
  
  // Schedule notification states
  const [schedulingInProgress, setSchedulingInProgress] = useState(false);
  const [scheduleNotification, setScheduleNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // Function to get CSRF token from cookies
  const getCsrfToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (const cookiePart of cookies) {
        const cookie = cookiePart.trim();
        if (cookie.startsWith(`${name}=`)) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  // Fetch application configurations from backend
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoadingApps(true);
      setFetchError(null);
      
      try {
        const csrfToken = getCsrfToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/application-configs/`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken || "",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Map backend data to frontend Application interface with full config data
          const mappedApps: Application[] = data.configurations.map(mapConfigToApplication);
          
          setApplications(mappedApps);
        } else {
          const error = await response.json().catch(() => ({ error: "Failed to fetch configurations" }));
          setFetchError(error.error || "Failed to load application configurations");
        }
      } catch (err: any) {
        console.error("Error fetching applications:", err);
        setFetchError("Network error. Please check your connection and try again.");
      } finally {
        setIsLoadingApps(false);
      }
    };

    fetchApplications();
  }, []);

  // Check if returning from scan page
  useEffect(() => {
    const scannedAppId = searchParams.get('scanned');
    if (scannedAppId) {
      setApplications(apps => apps.map(app => 
        app.id === Number.parseInt(scannedAppId, 10)
          ? { ...app, scanned: true, scanOnDemand: false } 
          : app
      ));
    }
  }, [searchParams]);

  const handleToggleStatus = async (id: number) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    // Determine new status
    const newIsActive = app.status !== "Enabled";

    try {
      const csrfToken = getCsrfToken();
      
      // Make API call to toggle is_active status
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/application-configs/${id}/toggle-status/`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken || "",
          },
          body: JSON.stringify({
            is_active: newIsActive
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // "Application enabled successfully" or "Application disabled successfully"
        
        // Update local state with the returned is_active value
        const newStatus = data.is_active ? "Enabled" : "Disabled";
        setApplications(applications.map(app =>
          app.id === id ? { ...app, status: newStatus } : app
        ));
      } else {
        const error = await response.json().catch(() => ({ error: "Failed to update status" }));
        console.error("Failed to update status:", error);
        alert(`Failed to update status: ${error.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert("Network error. Failed to update status.");
    }
  };

  const handleStartScan = async (id: number) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    if (!app.app_uuid || app.app_uuid.trim() === '') {
      alert('No app UUID configured for this application');
      return;
    }

    // Set scanning state
    setScanningAppId(id);

    // Start a ZAP job first so the scan page can immediately render live terminal output.
    let zapJobId: string | null = null;
    try {
      const zapTarget =
        app.base_url?.trim() ||
        app.target_host?.trim() ||
        app.scanUrl?.trim() ||
        "";

      if (zapTarget) {
        const zapResp = await ZapService.startScan({
          mode: "standard",
          target: zapTarget,
          target_port: String(app.target_port || 80),
        });

        if (zapResp?.success && zapResp?.job_id) {
          zapJobId = String(zapResp.job_id);
        }
      }
    } catch (zapError) {
      console.warn("Failed to start ZAP live terminal stream", zapError);
    }

    // Initialize scan status in localStorage (per-application) to show "in progress" state
    setScanResultState({
        success: false,
        message: 'Scan in progress...',
        output: `[${new Date().toLocaleTimeString()}] Initiating security scan...\n[${new Date().toLocaleTimeString()}] Connecting to backend...\n[${new Date().toLocaleTimeString()}] Starting vulnerability assessment...`,
        errors: null,
        inProgress: true,
        zap_job_id: zapJobId,
      }, id);

    // Navigate immediately to scan page
    router.push(
      `/scan?appId=${id}&appName=${encodeURIComponent(app.name)}&appUuid=${encodeURIComponent(app.app_uuid.trim())}${
        zapJobId ? `&zapJobId=${encodeURIComponent(zapJobId)}` : ""
      }`
    );

    // Start the scan in the background
    try {
      const csrfToken = getCsrfToken();
      
      // Create abort controller for timeout (5 minutes for scan operations)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
      
      // Make POST request to Python application with the URL in the body
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scan/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify({ app_uuid: app.app_uuid.trim() }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('Scan completed successfully:', result);
        
        // Mark application as scanned
        setApplications(apps => apps.map(app => 
          app.id === id ? { ...app, scanned: true } : app
        ));
        
        setScanResultState(result, id);
        storeScanResultInLocal(id, result);
      } else {
        // Handle non-OK responses
        let errorMessage = 'Unknown error';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || error.detail || JSON.stringify(error);
        } catch {
          // If response is not JSON, try to get text
          try {
            const textError = await response.text();
            errorMessage = textError || `HTTP ${response.status}: ${response.statusText}`;
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        
        console.error('Scan failed:', errorMessage);
        
        // Update localStorage (per-application) with error
        setScanResultState({
            success: false,
            message: `Scan failed: ${errorMessage}`,
            output: '',
            errors: errorMessage,
            inProgress: false
          }, id);
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      
      // Update localStorage (per-application) with error
      let errorMessage = 'Unknown error';
      if (error.name === 'AbortError') {
        errorMessage = 'Scan request timed out. The operation took too long to complete.';
      } else if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to the backend server. Please check if the backend is running.';
      } else if (error.message?.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused: Backend server is not running or not accessible.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Detailed error:', errorMessage);
      
      setScanResultState({
          success: false,
          message: `Scan failed: ${errorMessage}`,
          output: '',
          errors: errorMessage,
          inProgress: false
        }, id);
    } finally {
      setScanningAppId(null);
    }
  };

  const handleScheduleClick = (app: Application) => {
    setSelectedAppForSchedule(app);
    setShowScheduleModal(true);
  };

  const handleViewSchedule = async (app: Application) => {
    try {
      const response = await UnifiedAPIService.schedule.getByApplication(app.id);
      
      if (response.data && response.data.length > 0) {
        const schedule = response.data[0]; // Get the first (and only) schedule
        setScheduleDetails({ ...schedule, applicationName: app.name });
        setShowScheduleDetailsModal(true);
      } else {
        // Show no schedule message in notification style
        setScheduleNotification({
          show: true,
          type: "error",
          message: `No schedule found for ${app.name}. Click the schedule icon to create one.`
        });
        setTimeout(() => {
          setScheduleNotification({ show: false, type: "success", message: "" });
        }, 5000);
      }
    } catch (error: any) {
      console.error("Error fetching schedule:", error);
      setScheduleNotification({
        show: true,
        type: "error",
        message: `Failed to fetch schedule: ${error.response?.data?.message || error.message || "Unknown error"}`
      });
      setTimeout(() => {
        setScheduleNotification({ show: false, type: "success", message: "" });
      }, 7000);
    }
  };

  const handleScheduleScan = async (scheduleData: any) => {
    setSchedulingInProgress(true);
    
    try {
      const apiPayload = createSchedulePayload(scheduleData);

      // Use upsert endpoint - it creates new or updates existing schedule
      const response = await UnifiedAPIService.schedule.create(apiPayload);
      
      // Check if it was created (201) or updated (200)
      const isUpdate = response.status === 200;
      
      setScheduleNotification({
        show: true,
        type: "success",
        message: isUpdate 
          ? `Scan schedule updated successfully for ${scheduleData.applicationName}!`
          : `Scan scheduled successfully for ${scheduleData.applicationName}!`
      });

      console.log("Schedule response:", response.data);

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setScheduleNotification({ show: false, type: "success", message: "" });
      }, 5000);
      
    } catch (error: any) {
      console.error("Error scheduling scan:", error);
      
      // Extract error message from response
      let errorMessage = "Failed to schedule scan";
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          // Handle field-specific errors
          const errors = error.response.data.errors;
          const firstError = Object.values(errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setScheduleNotification({
        show: true,
        type: "error",
        message: errorMessage
      });

      // Auto-hide error notification after 7 seconds
      setTimeout(() => {
        setScheduleNotification({ show: false, type: "success", message: "" });
      }, 7000);
    } finally {
      setSchedulingInProgress(false);
    }
  };

  const filteredByStatus =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredApplications = normalizedSearch
    ? filteredByStatus.filter((app) => {
        const haystack = [app.name, app.configuration, app.startDate, app.status]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedSearch);
      })
    : filteredByStatus;

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  const renderPagination = () => {
    const pages: number[] = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pages.push(i);
    }
    if (totalPages > 5) {
      return [...pages, -1, totalPages];
    }
    return pages;
  };

  return (
    <div className="p-2 md:p-4">
      {/* Scheduling Loading Overlay */}
      {schedulingInProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
            <div className="flex flex-col items-center">
              {/* Animated Loader */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Loading Text */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">Scheduling Scan</h3>
              <p className="text-gray-600 text-center mb-4">
                Creating your scan schedule...
              </p>

              {/* Progress Indicators */}
              <div className="w-full space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Validating schedule configuration...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-200"></div>
                  <span>Saving to database...</span>
                </div>
              </div>

              {/* Loading Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 h-2 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Success/Error Notification */}
      {scheduleNotification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slideInRight">
          <div className={`rounded-xl shadow-2xl p-4 max-w-md border-l-4 ${
            scheduleNotification.type === "success" 
              ? "bg-white border-green-500" 
              : "bg-white border-red-500"
          }`}>
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                scheduleNotification.type === "success"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}>
                {scheduleNotification.type === "success" ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className={`font-semibold text-sm mb-1 ${
                  scheduleNotification.type === "success" ? "text-green-800" : "text-red-800"
                }`}>
                  {scheduleNotification.type === "success" ? "Success!" : "Error"}
                </h4>
                <p className="text-sm text-gray-600">
                  {scheduleNotification.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setScheduleNotification({ show: false, type: "success", message: "" })}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanning Loading Overlay */}
      {scanningAppId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
            <div className="flex flex-col items-center">
              {/* Animated Loader */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-purple-600 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>

              {/* Loading Text */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">Scanning in Progress</h3>
              <p className="text-gray-600 text-center mb-4">
                Analyzing security vulnerabilities for{' '}
                <span className="font-semibold text-indigo-600">
                  {applications.find(app => app.id === scanningAppId)?.name}
                </span>
              </p>

              {/* Progress Indicators */}
              <div className="w-full space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Initiating security scan...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
                  <span>Analyzing vulnerabilities...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-400"></div>
                  <span>Preparing results...</span>
                </div>
              </div>

              {/* Loading Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-2 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1 className="text-page-title">WebApp Scanner - Target Applications</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Configure Application Modal */}
      <ConfigureApplicationModal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedAppForEdit(null);
        }}
        editApplication={selectedAppForEdit}
        onSuccess={() => {
          setSelectedAppForEdit(null);
          // Refresh the applications list after successful configuration
          console.log("Application configured successfully");
          
          // Refetch applications to show the new one
          const fetchApplications = async () => {
            try {
              const csrfToken = getCsrfToken();
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/application-configs/`,
                {
                  method: "GET",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken || "",
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();
                const mappedApps: Application[] = data.configurations.map(mapConfigToApplication);
                setApplications(mappedApps);
              }
            } catch (err) {
              console.error("Error refreshing applications:", err);
            }
          };
          
          fetchApplications();
        }}
      />

      {/* Schedule Scan Modal */}
      {selectedAppForSchedule && (
        <ScheduleScanModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedAppForSchedule(null);
          }}
          applicationName={selectedAppForSchedule.name}
          applicationId={selectedAppForSchedule.id}
          onSchedule={handleScheduleScan}
        />
      )}

      {/* Schedule Details Modal */}
      {showScheduleDetailsModal && scheduleDetails && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Schedule Details</h3>
                    <p className="text-sm text-white text-opacity-90">{scheduleDetails.applicationName}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowScheduleDetailsModal(false);
                    setScheduleDetails(null);
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Schedule Type Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getScheduleTypeBadgeClass(scheduleDetails.schedule_type)}`}>
                    {scheduleDetails.schedule_type === "once" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {scheduleDetails.schedule_type === "recurring" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    {scheduleDetails.schedule_type === "weekday" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {scheduleDetails.schedule_type.charAt(0).toUpperCase() + scheduleDetails.schedule_type.slice(1)} Schedule
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    scheduleDetails.is_active ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}></span>
                  <span className={`text-sm font-medium ${
                    scheduleDetails.is_active ? "text-green-700" : "text-red-700"
                  }`}>
                    {scheduleDetails.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Schedule Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Schedule Type Specific Info */}
                {scheduleDetails.schedule_type === "once" && (
                  <>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-600 uppercase">Scheduled Date</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{new Date(scheduleDetails.scheduled_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-600 uppercase">Scheduled Time</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{scheduleDetails.scheduled_time}</p>
                    </div>
                  </>
                )}

                {scheduleDetails.schedule_type === "recurring" && (
                  <>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-600 uppercase">Frequency</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 capitalize">{scheduleDetails.frequency}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-600 uppercase">Start Date</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{new Date(scheduleDetails.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-600 uppercase">Scheduled Time</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{scheduleDetails.scheduled_time}</p>
                    </div>
                  </>
                )}

                {scheduleDetails.schedule_type === "weekday" && (
                  <>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-600 uppercase">Weekday</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 capitalize">{scheduleDetails.weekday}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-600 uppercase">Scheduled Time</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{scheduleDetails.scheduled_time}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Execution Info */}
              {(scheduleDetails.next_run_at || scheduleDetails.last_run_at) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Execution Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scheduleDetails.next_run_at && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">Next Run</p>
                        <p className="text-sm font-semibold text-gray-800">{new Date(scheduleDetails.next_run_at).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    )}
                    {scheduleDetails.last_run_at && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Last Run</p>
                        <p className="text-sm font-semibold text-gray-800">{new Date(scheduleDetails.last_run_at).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowScheduleDetailsModal(false);
                  setScheduleDetails(null);
                }}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoadingApps && (
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Configurations</h3>
            <p className="text-sm text-gray-600">Please wait while we fetch your application configurations...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoadingApps && fetchError && (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Configurations</h3>
            <p className="text-sm text-gray-600 mb-4">{fetchError}</p>
            <button
              onClick={() => globalThis.window?.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      {!isLoadingApps && !fetchError && (
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        {/* Table Header */}
        <div className="card-padding border-b border-purple-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-card-title mb-1">Configured WebApp Targets</h2>
              <p className="text-tiny">Configure and manage your WebApp scanning targets</p>
            </div>
            <button 
              onClick={() => setShowConfigModal(true)}
              className="btn-secondary bg-green-500 hover:bg-green-600 text-white shadow"
            >
              + Create Target
            </button>
          </div>
        </div>

        {/* No Data State */}
        {applications.length === 0 ? (
          <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No WebApp Targets Configured</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md">
              Get started by configuring your first WebApp target to begin security scanning with ZAP proxy
            </p>
            <button
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Your First Application
            </button>
          </div>
        ) : (
          <>
        {/* Table */}
        <div className="overflow-x-auto -mx-2 md:mx-0">
          <div className="inline-block min-w-full align-middle">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="px-2 md:px-3 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">#</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Application Name</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Configuration</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Start Date</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Status</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-left text-xs md:text-sm font-semibold">Action</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-center text-xs md:text-sm font-semibold">Edit</th>
                <th className="px-2 md:px-3 py-2 md:py-3 text-center text-xs md:text-sm font-semibold">Scan Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.length ? paginatedApplications.map((app, index) => (
                <tr
                  key={app.id}
                  className={`border-b border-purple-50 ${
                    index % 2 === 0 ? "bg-purple-50/30" : "bg-white"
                  } hover:bg-purple-50/50 transition-colors`}
                >
                  <td className="px-2 md:px-3 py-2 md:py-3 text-xs md:text-sm text-gray-700">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-xs md:text-sm text-gray-700">{app.name}</td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-xs md:text-sm">
                    <a
                      href={app.configuration.startsWith('http://') || app.configuration.startsWith('https://') 
                        ? app.configuration 
                        : `http://${app.configuration}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium flex items-center gap-1"
                    >
                      {app.configuration}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </a>
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3 text-xs md:text-sm text-gray-700">{app.startDate}</td>
                  <td className="px-2 md:px-3 py-2 md:py-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === "Enabled"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          app.status === "Enabled" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-2 md:px-3 py-2 md:py-3">
                    <div className="flex items-center gap-1 md:gap-2">
                      {/* Toggle Button */}
                      <button
                        onClick={() => handleToggleStatus(app.id)}
                        className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          app.status === "Enabled"
                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        <span className="text-xs">{app.status === "Enabled" ? "Disable" : "Enable"}</span>
                        <div
                          className={`w-7 h-3.5 rounded-full transition-colors ${
                            app.status === "Enabled" ? "bg-indigo-600" : "bg-red-600"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 bg-white rounded-full transition-transform ${
                              app.status === "Enabled" ? "translate-x-4" : "translate-x-0.5"
                            } mt-0.5`}
                          ></div>
                        </div>
                      </button>
                    </div>
                  </td>

                  {/* Edit Button */}
                  <td className="px-2 md:px-3 py-2 md:py-3">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => {
                          setSelectedAppForEdit(app);
                          setShowConfigModal(true);
                        }}
                        title="Edit Application"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-all shadow-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
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
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>

                  {/* Scan Actions - Combined cell */}
                  <td className="px-2 md:px-3 py-2 md:py-3">
                    <div className="flex items-center justify-center gap-1 md:gap-1.5">
                      {/* Start Scan Button (primary action) */}
                      <button
                        onClick={() => handleStartScan(app.id)}
                        title="Start Scan"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all shadow-sm text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        {scanningAppId === app.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                            <span>Start Scan</span>
                          </>
                        )}
                      </button>

                      {/* Schedule/View actions are intentionally hidden for now — Start Scan is primary */}
                      {/**
                      <button ...>Schedule Scan</button>
                      <button ...>View Schedule</button>
                      */}

                      {/** View Schedule button hidden per user request */}

                      {/* Scan Upload Button */}
                      {/* <button
                        onClick={() => {
                          if (!app.scanned) {
                            triggerFileInput(app.id);
                          }
                        }}
                        title="Upload File"
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all shadow-sm ${
                          app.scanned
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        }`}
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
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </button>
                      <input
                        key={`file-input-${app.id}`}
                        ref={(el) => {
                          fileInputRefs.current[app.id] = el;
                        }}
                        type="file"
                        accept=".log,.json,.txt"
                        onChange={(e) => {
                          console.log('File input onChange triggered', e.target.files);
                          handleFileUpload(app.id, e.target.files?.[0] || null);
                        }}
                        style={{ display: 'none' }}
                      /> */}

                      {/** View Scan Results hidden for now; navigation to scan page is disabled here. */}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                    {normalizedSearch
                      ? "No applications match your search."
                      : "No applications found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="card-padding border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-gray-600">Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="px-2 md:px-3 py-1 border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-xs md:text-sm text-gray-600">Row</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {renderPagination().map((page) => (
              <button
                key={page === -1 ? "ellipsis" : `page-${page}`}
                onClick={() => page !== -1 && setCurrentPage(page)}
                disabled={page === -1}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${getPaginationButtonClass(currentPage, page)}`}
              >
                {page === -1 ? "..." : page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
        </>
        )}
      </div>
      )}
    </div>
  );
}
export default function ConfigurationPage() {
  return (
    <Suspense fallback={
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ConfigurationContent />
    </Suspense>
  );
}