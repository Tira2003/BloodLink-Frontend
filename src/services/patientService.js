import { apiFetch } from './api';

/**
 * Service for patient/hospital blood-request API calls.
 *
 * Endpoints (all require JWT Bearer token):
 *   GET  /api/requests/active   — PENDING + MATCHED requests for the logged-in user
 *   GET  /api/requests/history  — Paginated full history
 *   PUT  /api/requests/:id/cancel — Cancel a PENDING request
 */

function normalizeRequest(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const BACKEND_TO_FRONTEND_URGENCY = {
    CRITICAL: 'CRITICAL',
    URGENT: 'MEDIUM',
    NORMAL: 'LOW',
  };
  const BACKEND_TO_FRONTEND_BLOOD_TYPE = {
    'A_POS': 'A+',
    'A_NEG': 'A-',
    'B_POS': 'B+',
    'B_NEG': 'B-',
    'AB_POS': 'AB+',
    'AB_NEG': 'AB-',
    'O_POS': 'O+',
    'O_NEG': 'O-',
  };
  const rawBloodType = raw.bloodType ?? raw.bloodTypeNeeded ?? '';
  return {
    ...raw,
    bloodType: BACKEND_TO_FRONTEND_BLOOD_TYPE[rawBloodType] ?? rawBloodType,
    units: raw.units ?? raw.unitsNeeded ?? 0,
    urgency:
      BACKEND_TO_FRONTEND_URGENCY[raw.urgencyLevel] ??
      raw.urgency ??
      raw.urgencyLevel ??
      '',
    hospital: raw.hospital ?? raw.hospitalName ?? '',
    patientName: raw.patientName ?? '',
  };
}

export const patientService = {
  /** All PENDING + MATCHED requests for the logged-in patient/hospital. */
  async getActiveRequests() {
    const data = await apiFetch('/api/requests/active');
    return (Array.isArray(data) ? data : []).map(normalizeRequest);
  },

  /** Paginated full request history for the logged-in patient/hospital. */
  async getRequestHistory(page = 0, size = 20) {
    const data = await apiFetch(
      `/api/requests/history?page=${page}&size=${size}`
    );
    // Handle both array and paginated { content: [] } responses
    const list = Array.isArray(data) ? data : data?.content ?? [];
    return list.map(normalizeRequest);
  },

  /** Cancel a PENDING blood request. */
  async cancelRequest(requestId) {
    return apiFetch(`/api/requests/${requestId}/cancel`, { method: 'PUT' });
  },

  /** Create Patient/Hospital Profile */
  async createProfile(data) {
    return apiFetch('/patient/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
