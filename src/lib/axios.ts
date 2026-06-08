import axios from "axios";

// Validate API base URL
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL && globalThis.window) {
  console.error('NEXT_PUBLIC_API_BASE_URL is not configured');
}

export const api = axios.create({
  baseURL: baseURL ? `${baseURL}/api` : 'http://localhost:8000/api',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  timeout: 30000, // 30 second timeout
  validateStatus: function (status) {
    // Accept all status codes to handle them in the response
    return status >= 200 && status < 600;
  },
});

api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const cookiePattern = /(?:^|; )csrftoken=([^;]+)/;
    const match = cookiePattern.exec(document.cookie);
    const csrfToken = match ? decodeURIComponent(match[1]) : null;

    if (csrfToken) {
      config.headers = config.headers ?? {};
      if (!("X-CSRFToken" in config.headers)) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    }
  }

  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Check if status is actually an error
    if (response.status >= 400) {
      const error: any = new Error(response.statusText || 'Request failed');
      error.response = response;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    // Only handle actual network errors here
    if (!error.response && error.code) {
      // For run-scan endpoint, ECONNABORTED is expected for long-running async scans
      // Only create a network error message if it's NOT an ECONNABORTED on run-scan
      const isRunScanEndpoint = error.config?.url?.includes('/run-scan/');
      const isEconnaborted = error.code === 'ECONNABORTED';
      
      if (!isEconnaborted || !isRunScanEndpoint) {
        error.message = 'Network error: Unable to connect to the server. Please check your connection.';
      } else {
        // For async run-scan, treat timeout/abort as expected - submission may have succeeded
        error.isExpectedAsyncTimeout = true;
        error.message = 'Scan submission in progress (async)';
      }
    }
    return Promise.reject(error);
  }
);