"use client";
import { useState, useEffect } from "react";

interface Application {
  id: number;
  name: string;
  configuration: string;
  startDate: string;
  status: "Enabled" | "Disabled";
  scanned?: boolean;
  scanOnDemand?: boolean;
  scanUrl?: string;
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

interface ConfigureApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editApplication?: Application | null;
}

interface FormData {
  applicationName: string;
  description: string;
  targetHost: string;
  targetPort: string;
  baseUrl: string;
  environment: string;
  baselineTtl: string;
  enableBaselineScan: boolean;
  baselineStartDate: string;
  scanScope: "all_pages" | "selected_pages";
  selectedPagesToScan: string[];
  fromScannerOutput: boolean;
  pathsToExclude: string[];
  networkCidr: string;
  allowedPorts: string;
}

// Helper function to get CSRF token from cookies
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export default function ConfigureApplicationModal({
  isOpen,
  onClose,
  onSuccess,
  editApplication = null,
}: ConfigureApplicationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    applicationName: "",
    description: "",
    targetHost: "",
    targetPort: "",
    baseUrl: "",
    environment: "",
    baselineTtl: "",
    enableBaselineScan: true,
    baselineStartDate: "",
    scanScope: "all_pages",
    selectedPagesToScan: [""],
    fromScannerOutput: false,
    pathsToExclude: [""],
    networkCidr: "",
    allowedPorts: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Pre-fill form when editing (using data already available from parent)
  useEffect(() => {
    if (editApplication && isOpen) {
      // Pre-filling form with application data
      
      // Parse values into arrays (handle both string and array types)
      let selectedPages: string[] = [''];
      if (editApplication.selected_pages_to_scan) {
        if (Array.isArray(editApplication.selected_pages_to_scan)) {
          // It's already an array, flatten any semicolon-separated values
          selectedPages = editApplication.selected_pages_to_scan
            .flatMap((p: string) => p.split(';'))
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 0);
          if (selectedPages.length === 0) selectedPages = [''];
        } else if (typeof editApplication.selected_pages_to_scan === 'string' && editApplication.selected_pages_to_scan.trim()) {
          selectedPages = editApplication.selected_pages_to_scan.split(';').map(p => p.trim()).filter(p => p.length > 0);
          if (selectedPages.length === 0) selectedPages = [''];
        }
      }
      
      let pathsExclude: string[] = [''];
      if (editApplication.paths_to_exclude) {
        if (Array.isArray(editApplication.paths_to_exclude)) {
          // It's already an array, flatten any semicolon-separated values
          pathsExclude = editApplication.paths_to_exclude
            .flatMap((p: string) => p.split(';'))
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 0);
          if (pathsExclude.length === 0) pathsExclude = [''];
        } else if (typeof editApplication.paths_to_exclude === 'string' && editApplication.paths_to_exclude.trim()) {
          pathsExclude = editApplication.paths_to_exclude.split(';').map(p => p.trim()).filter(p => p.length > 0);
          if (pathsExclude.length === 0) pathsExclude = [''];
        }
      }

      // Parsed pages and paths to exclude

      // Pre-fill form with application data
      setFormData({
        applicationName: editApplication.application_name || "",
        description: editApplication.description || "",
        targetHost: editApplication.target_host || "",
        targetPort: editApplication.target_port?.toString() || "",
        baseUrl: editApplication.base_url || "",
        environment: editApplication.environment || "",
        baselineTtl: editApplication.baseline_ttl?.toString() || "",
        enableBaselineScan: editApplication.enable_baseline_scan !== undefined ? editApplication.enable_baseline_scan : true,
        baselineStartDate: editApplication.baseline_start_date || "",
        scanScope: (editApplication.scan_scope as "all_pages" | "selected_pages") || "all_pages",
        selectedPagesToScan: selectedPages,
        fromScannerOutput: editApplication.from_scanner_output || false,
        pathsToExclude: pathsExclude,
        networkCidr: editApplication.network_cidr || "",
        allowedPorts: editApplication.allowed_ports || "",
      });
    }
  }, [editApplication, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        applicationName: "",
        description: "",
        targetHost: "",
        targetPort: "",
        baseUrl: "",
        environment: "",
        baselineTtl: "",
        enableBaselineScan: true,
        baselineStartDate: "",
        scanScope: "all_pages",
        selectedPagesToScan: [""],
        fromScannerOutput: false,
        pathsToExclude: [""],
        networkCidr: "",
        allowedPorts: "",
      });
      setError("");
      setSuccess("");
      setValidationErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayFieldChange = (field: "selectedPagesToScan" | "pathsToExclude", index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field: "selectedPagesToScan" | "pathsToExclude") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field: "selectedPagesToScan" | "pathsToExclude", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    // Application Name
    if (!formData.applicationName.trim()) {
      errors.applicationName = "Application name is required";
    } else if (formData.applicationName.length > 255) {
      errors.applicationName = "Application name must be less than 255 characters";
    }

    // Target Host
    if (!formData.targetHost.trim()) {
      errors.targetHost = "Target host is required";
    }

    // Target Port (optional, but if provided should be valid)
    if (formData.targetPort.trim()) {
      const port = parseInt(formData.targetPort);
      if (isNaN(port) || port < 1 || port > 65535) {
        errors.targetPort = "Port must be between 1 and 65535";
      }
    }

    // Environment and Baseline TTL validation removed (not required)

    // Selected Pages (only if scan scope is selected_pages)
    if (formData.scanScope === "selected_pages") {
      const filledPages = formData.selectedPagesToScan.filter(p => p.trim());
      if (filledPages.length === 0) {
        errors.selectedPagesToScan = "At least one page path is required when scanning selected pages";
      }
    }

    // Network CIDR validation (optional, but if provided should be valid)
    if (formData.networkCidr.trim()) {
      const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
      if (!cidrRegex.test(formData.networkCidr.trim())) {
        errors.networkCidr = "Invalid CIDR notation (e.g., 10.0.0.0/24)";
      }
    }

    setValidationErrors(errors);
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    setError("");
    setSuccess("");

    // Validate form (returns errors map)
    const validationErrs = validateForm();
    if (Object.keys(validationErrs).length > 0) {
      // Build a clearer inline message listing missing/invalid fields
      const parts: string[] = [];
      for (const key of Object.keys(validationErrs)) {
        const label = {
          applicationName: 'Application name',
          targetHost: 'Target host',
          targetPort: 'Port',
          environment: 'Environment',
          baselineTtl: 'Baseline TTL',
          selectedPagesToScan: 'Selected pages',
          networkCidr: 'Network CIDR',
        }[key] || key;

        const hiddenNote = (editApplication && (key === 'environment' || key === 'baselineTtl')) ? ' (hidden in edit mode)' : '';
        parts.push(`${label}${hiddenNote}: ${validationErrs[key]}`);
      }

      setError(`Please fix the validation errors before submitting: ${parts.join('; ')}`);
      return;
    }

    setLoading(true);

    try {
      // Clean data and join with semicolons for API
      const cleanedSelectedPages = formData.selectedPagesToScan
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .join(';');
      
      const cleanedPathsToExclude = formData.pathsToExclude
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .join(';');

      // Prepare payload with snake_case keys
      const payload: any = {
        application_name: formData.applicationName.trim(),
        target_host: formData.targetHost.trim(),
        enable_baseline_scan: formData.enableBaselineScan,
        scan_scope: formData.scanScope,
        from_scanner_output: formData.fromScannerOutput,
        paths_to_exclude: cleanedPathsToExclude,
      };

      // Only include optional fields if provided (for edit mode we avoid sending empty required fields)
      if (formData.environment) {
        payload.environment = formData.environment;
      }
      if (formData.baselineTtl && formData.baselineTtl.trim()) {
        payload.baseline_ttl = parseInt(formData.baselineTtl);
      }

      // Add optional description
      if (formData.description.trim()) {
        payload.description = formData.description.trim();
      }

      // Add optional target_port
      if (formData.targetPort.trim()) {
        payload.target_port = parseInt(formData.targetPort);
      }

      // Add optional base_url
      if (formData.baseUrl.trim()) {
        payload.base_url = formData.baseUrl.trim();
      }

      // Include baseline start date if provided
      if (formData.baselineStartDate) {
        payload.baseline_start_date = formData.baselineStartDate;
      }

      // Only include selected_pages_to_scan if scan scope is selected_pages
      if (formData.scanScope === "selected_pages") {
        payload.selected_pages_to_scan = cleanedSelectedPages;
      }

      // Include optional network fields only if they have values
      if (formData.networkCidr.trim()) {
        payload.network_cidr = formData.networkCidr.trim();
      }

      if (formData.allowedPorts.trim()) {
        payload.allowed_ports = formData.allowedPorts.trim();
      }

      // Get CSRF token
      const csrfToken = getCookie('csrftoken');

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Determine API endpoint and method based on edit mode
      const isEditMode = editApplication !== null;
      const apiUrl = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/application-configs/${editApplication.id}/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/configure-new-app/`;
      const method = isEditMode ? "PUT" : "POST";

      // Make API request
      const response = await fetch(
        apiUrl,
        {
          method: method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken || "",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        const successMsg = editApplication ? "Application updated successfully!" : "Configuration saved successfully!";
        setSuccess(successMsg);
        setLoading(false);
        
        // Show success message for 2 seconds before smooth redirect
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }));
        setError(`Saving was not successful. ${errorData.error || errorData.message || "Failed to configure application"}`);
      }
    } catch (err: any) {
      console.error("Configuration error:", err);
      
      // Provide specific error messages
      if (err.name === 'AbortError') {
        setError("Request timed out. The server took too long to respond. Please try again.");
      } else if (err.message?.includes('fetch') || err.message?.includes('NetworkError')) {
        setError("Network error. Unable to connect to the server. Please check your connection and try again.");
      } else if (err.message) {
        setError(`Saving was not successful. ${err.message}`);
      } else {
        setError("Saving was not successful. An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
      {/* Professional Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
            <div className="flex flex-col items-center">
              {/* Animated Loader */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-purple-600 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Loading Text */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{editApplication ? "Updating Configuration" : "Saving Configuration"}</h3>
              <p className="text-gray-600 text-center mb-4">
                Please wait while we {editApplication ? "update" : "save"} your application configuration...
              </p>

              {/* Progress Indicators */}
              <div className="w-full space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Validating configuration...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
                  <span>Sending data to server...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-400"></div>
                  <span>Processing request...</span>
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

      {/* Success Overlay */}
      {success && !loading && (
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[60] flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scaleIn">
            <div className="flex flex-col items-center">
              {/* Success Icon */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Success Text */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Success!</h3>
              <p className="text-gray-600 text-center mb-6 text-lg">
                {success}
              </p>

              {/* Progress Indicator */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Configuration saved successfully</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-indigo-600 animate-pulse">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-medium">Redirecting to configuration page...</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-4">
                <div className="bg-gradient-to-r from-green-500 to-indigo-600 h-2 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Centered Modal Container (shorter, normal popup) */}
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl animate-fadeIn overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-lg">
          <div>
            <h2 className="text-xl font-bold">{editApplication ? "Edit WebApp Target" : "Configure WebApp Target"}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-5 py-3">
          {/* Error Message - Only show inline for errors */}
          {error && !loading && (
            <div className="mb-2 bg-red-50 border border-red-500 text-red-700 px-3 py-1.5 rounded text-sm flex items-center gap-2 animate-fadeIn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Section 1: Application Configuration */}
          <div className="bg-white rounded-lg p-3 mb-2 border border-indigo-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-100">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-800">WebApp Target Configuration</h3>
            </div>
            
              <div className="space-y-1.5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {/* Application Name - full width */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    App Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={formData.applicationName}
                    onChange={(e) => handleInputChange("applicationName", e.target.value)}
                    className={`w-full border ${validationErrors.applicationName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {validationErrors.applicationName && (
                    <p className="text-red-600 text-xs mt-0.5">{validationErrors.applicationName}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[96px] resize-y"
                    rows={4}
                  />
                </div>

                {/* Target Host */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Target Host <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="10.0.0.10"
                    value={formData.targetHost}
                    onChange={(e) => handleInputChange("targetHost", e.target.value)}
                    className={`w-full border ${validationErrors.targetHost ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {validationErrors.targetHost && (
                    <p className="text-red-600 text-xs mt-0.5">{validationErrors.targetHost}</p>
                  )}
                </div>

                {/* Target Port */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    placeholder="80"
                    min="1"
                    max="65535"
                    value={formData.targetPort}
                    onChange={(e) => handleInputChange("targetPort", e.target.value)}
                    className={`w-full border ${validationErrors.targetPort ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {validationErrors.targetPort && (
                    <p className="text-red-600 text-xs mt-0.5">{validationErrors.targetPort}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {/* Base URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Base URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={formData.baseUrl}
                    onChange={(e) => handleInputChange("baseUrl", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>


                {/* Environment (commented out) */}
                {/*
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Environment <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.environment}
                    onChange={(e) => handleInputChange("environment", e.target.value)}
                    className={`w-full border ${validationErrors.environment ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
                  >
                    <option value="">Select</option>
                    <option value="dev">Dev</option>
                    <option value="qa">QA</option>
                    <option value="staging">Staging</option>
                    <option value="prod">Prod</option>
                  </select>
                  {validationErrors.environment && (
                    <p className="text-red-600 text-xs mt-0.5">{validationErrors.environment}</p>
                  )}
                </div>
                */}

                {/* Baseline TTL (commented out) */}
                {/*
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    TTL (hrs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="1-8760"
                    min="1"
                    max="8760"
                    value={formData.baselineTtl}
                    onChange={(e) => handleInputChange("baselineTtl", e.target.value)}
                    className={`w-full border ${validationErrors.baselineTtl ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {validationErrors.baselineTtl && (
                    <p className="text-red-600 text-xs mt-0.5">{validationErrors.baselineTtl}</p>
                  )}
                </div>
                */}

                {/* Baseline Start Date as datetime-local */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.baselineStartDate}
                    onChange={(e) => handleInputChange("baselineStartDate", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Enable Baseline Scan */}
              <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.enableBaselineScan}
                      onChange={(e) => handleInputChange("enableBaselineScan", e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${formData.enableBaselineScan ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${formData.enableBaselineScan ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5 shadow`}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Passive Baseline Scans</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Scan Scope Configuration (commented out) */}
          {/**
          <div className="bg-white rounded-lg p-3 mb-2 border border-indigo-200 shadow-sm">
            ...
          </div>
          */}

          {/* Section 3: Network Scan Settings (commented out) */}
          {/**
          <div className="bg-white rounded-lg p-3 mb-2 border border-indigo-200 shadow-sm">
            ...
          </div>
          */}
          </div>

          {/* Action Buttons - Fixed Footer */}
          <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-5 py-2.5 flex justify-end gap-3 shadow-lg">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all disabled:opacity-50 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editApplication ? "Updating..." : "Saving..."}
                </>
              ) : (
                editApplication ? "Update" : "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
