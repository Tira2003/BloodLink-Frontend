import { apiFetch } from './api';

export const requestService = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.bloodType) query.set('bloodType', params.bloodType);
    if (params.urgency)   query.set('urgency', params.urgency);
    if (params.district)  query.set('district', params.district);
    if (params.status)    query.set('status', params.status);
    const qs = query.toString();
    return apiFetch(`/api/requests${qs ? `?${qs}` : ''}`);
  },

  async getById(id) {
    return apiFetch(`/api/requests/${id}`);
  },

  async create(data) {
    return apiFetch('/api/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
