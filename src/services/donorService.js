import { apiFetch } from './api';

export const donorService = {
  async getProfile() {
    return apiFetch('/api/donors/me');
  },

  async updateProfile(data) {
    return apiFetch('/api/donors/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getDonationHistory() {
    return apiFetch('/api/donors/me/donations');
  },

  async respondToRequest(requestId, action) {
    // action: 'ACCEPT' | 'REJECT'
    return apiFetch(`/api/requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },
};
