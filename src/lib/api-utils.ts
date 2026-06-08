/**
 * API utility functions for safe network calls
 */

/**
 * Validates that the API base URL is configured
 */
export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!baseUrl) {
    throw new Error('API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.');
  }
  
  return baseUrl;
}

/**
 * Makes a safe fetch call with error handling
 */
export async function safeFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to ${baseUrl}. Please ensure the backend server is running.`);
    }
    throw error;
  }
}

/**
 * Gets CSRF token from cookies
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}

/**
 * Creates headers with CSRF token
 */
export function getApiHeaders(additionalHeaders?: HeadersInit): HeadersInit {
  const csrfToken = getCsrfToken();
  
  return {
    'Content-Type': 'application/json',
    ...(csrfToken && { 'X-CSRFToken': csrfToken }),
    ...additionalHeaders,
  };
}
