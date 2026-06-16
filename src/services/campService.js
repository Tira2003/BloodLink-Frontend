import { apiFetch } from './api';

export const campService = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.district)  query.set('district', params.district);
    if (params.upcoming)  query.set('upcoming', 'true');
    const qs = query.toString();
    return apiFetch(`/api/camps${qs ? `?${qs}` : ''}`);
  },

  async create(data) {
    return apiFetch('/api/camps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
