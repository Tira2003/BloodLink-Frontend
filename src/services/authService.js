import { apiFetch } from './api';
import { tryDemoLogin } from '../data/demoUsers';

function persistSession(data) {
  if (data.token) {
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
    } catch {
      const demo = tryDemoLogin(email, password);
      if (demo) return persistSession(demo);
      throw new Error('Invalid email or password. Please try again.');
    }
  },

  async register(payload) {
    // payload: { fullName, email, phone, age, district, nearestHospital, bloodType, password, role }
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout() {
    localStorage.removeItem('bl_token');
    localStorage.removeItem('bl_user');
  },

  getStoredUser() {
    try {
      const raw = localStorage.getItem('bl_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
