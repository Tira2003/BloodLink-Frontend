import { apiFetch } from './api';
import { tryDemoLogin } from '../data/demoUsers';

export function persistSession(data) {
  // Handle JWT response format from backend
  if (data.accessToken) {
    localStorage.setItem('bl_token', data.accessToken);
    localStorage.setItem('bl_refresh_token', data.refreshToken || '');
    localStorage.setItem('bl_token_type', data.tokenType || 'Bearer');
    localStorage.setItem('bl_token_expires', new Date().getTime() + (data.expiresIn * 1000) || '');
  } else if (data.token) {
    // Fallback for legacy token format
    localStorage.setItem('bl_token', data.token);
  }

  if (data.user) {
    localStorage.setItem('bl_user', JSON.stringify(data.user));
  }

  return data;
}

export const authService = {
  async login(email, password) {
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return persistSession(data);
    } catch (error) {
      try {
        // Fallback to demo login
        const demo = tryDemoLogin(email, password);
        if (demo) return persistSession(demo);
      } catch {
        // Demo login also failed, throw original error
      }
      throw new Error(error.message || 'Invalid email or password. Please try again.');
    }
  },

  async register(payload) {
    // payload: { firstName, lastName, email, password, role, ...other fields }
    const data = await apiFetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return persistSession(data);
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('bl_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const data = await apiFetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    return persistSession(data);
  },

  async logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
    
    localStorage.removeItem('bl_token');
    localStorage.removeItem('bl_refresh_token');
    localStorage.removeItem('bl_user');
    localStorage.removeItem('bl_token_type');
    localStorage.removeItem('bl_token_expires');
  },

  getStoredUser() {
    try {
      const raw = localStorage.getItem('bl_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getStoredToken() {
    return localStorage.getItem('bl_token');
  },

  isTokenExpired() {
    const expiresAt = localStorage.getItem('bl_token_expires');
    if (!expiresAt) return false;
    return new Date().getTime() > parseInt(expiresAt);
  },

  async getMe() {
    return apiFetch('/api/auth/me', { method: 'GET' });
  },
};
