/**
 * Authentication service functions interfacing with backend /api/v1/auth.
 */

import { apiFetch } from './api';
import type { UserProfile } from '../types';

export interface RegisterPayload {
  email: string;
  password: string;
  fullName?: string;
  agreeTerms?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponseData {
  user: UserProfile;
  message: string;
  csrf_token?: string;
}

export const authApi = {
  /**
   * Registers a new account with the backend.
   */
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    return apiFetch<AuthResponseData>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        full_name: payload.fullName || null,
        agree_terms: payload.agreeTerms ?? true,
      }),
    });
  },

  /**
   * Signs in an existing account and sets HTTP-only session cookies.
   */
  async login(payload: LoginPayload): Promise<AuthResponseData> {
    return apiFetch<AuthResponseData>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        remember_me: payload.rememberMe ?? false,
      }),
    });
  },

  /**
   * Terminates the current server session and clears authentication cookies.
   */
  async logout(): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/api/v1/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Validates the active session and retrieves current user profile metadata.
   */
  async getCurrentUser(): Promise<UserProfile> {
    return apiFetch<UserProfile>('/api/v1/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Obtains a CSRF token for state-changing operations.
   */
  async getCsrfToken(): Promise<{ csrf_token: string }> {
    return apiFetch<{ csrf_token: string }>('/api/v1/auth/csrf', {
      method: 'GET',
    });
  },
};
