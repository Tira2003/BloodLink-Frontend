import { apiFetch } from './api';

export const donationService = {
  // Donations
  async createDonation(donorId, hospitalId, bloodType, quantityMl, donationDate, notes, collectionCenter) {
    return apiFetch('/api/donations', {
      method: 'POST',
      body: JSON.stringify({
        donorId,
        hospitalId,
        bloodType,
        quantityMl,
        donationDate,
        notes,
        collectionCenter,
      }),
    });
  },

  async getDonation(id) {
    return apiFetch(`/api/donations/${id}`);
  },

  async getDonationsByDonor(donorId) {
    return apiFetch(`/api/donations/donor/${donorId}`);
  },

  async getDonationsByHospital(hospitalId) {
    return apiFetch(`/api/donations/hospital/${hospitalId}`);
  },

  async getDonationsByStatus(status) {
    return apiFetch(`/api/donations/status/${status}`);
  },

  async updateDonationStatus(id, status) {
    return apiFetch(`/api/donations/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  async getDonationHistory(donorId, startDate, endDate) {
    let url = `/api/donations/history/${donorId}`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    return apiFetch(url);
  },

  async getDonationCount(donorId) {
    return apiFetch(`/api/donations/stats/donor/${donorId}`);
  },

  // Appointments
  async bookAppointment(donorId, hospitalId, appointmentDate, notes, collectionCenter) {
    return apiFetch('/api/donations/appointments', {
      method: 'POST',
      body: JSON.stringify({
        donorId,
        hospitalId,
        appointmentDate,
        notes,
        collectionCenter,
      }),
    });
  },

  async getAppointment(id) {
    return apiFetch(`/api/donations/appointments/${id}`);
  },

  async getAppointmentsByDonor(donorId) {
    return apiFetch(`/api/donations/appointments/donor/${donorId}`);
  },

  async getAppointmentsByHospital(hospitalId) {
    return apiFetch(`/api/donations/appointments/hospital/${hospitalId}`);
  },

  async getUpcomingAppointments(hospitalId) {
    return apiFetch(`/api/donations/appointments/hospital/${hospitalId}/upcoming`);
  },

  async confirmAppointment(id) {
    return apiFetch(`/api/donations/appointments/${id}/confirm`, {
      method: 'PUT',
    });
  },

  async cancelAppointment(id) {
    return apiFetch(`/api/donations/appointments/${id}/cancel`, {
      method: 'PUT',
    });
  },
};
