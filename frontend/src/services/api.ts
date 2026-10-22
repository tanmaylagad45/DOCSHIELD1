/**
 * Centralized API client for communicating with the DocShield backend.
 * Configured with HTTP-only credentials and automatic CSRF token injection.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Extracts a cookie value by name from document.cookie.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Retrieves the CSRF token from the docshield_csrf cookie.
 */
export function getCsrfToken(): string | null {
  return getCookie('docshield_csrf');
}

/**
 * Core HTTP fetch wrapper with credential and CSRF management.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});

  // Default content type to JSON when sending body and not multipart
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject CSRF token for state-changing HTTP requests
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken && !headers.has('X-CSRF-Token')) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensures HTTP-only session cookies are sent
  });

  // Handle empty 204 response
  if (response.status === 204) {
    return {} as T;
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let message = 'An unexpected server error occurred.';
    if (data && typeof data === 'object') {
      if (data.error && data.error.message) {
        message = data.error.message;
      } else if (data.detail) {
        message = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      }
    } else if (typeof data === 'string' && data.length > 0) {
      message = data;
    }
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
