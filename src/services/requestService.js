import { apiFetch } from './api';

// ---------------------------------------------------------------------------
// Field-name adapters
// ---------------------------------------------------------------------------

/**
 * Urgency value translation tables.
 *
 * Backend stores:  CRITICAL | URGENT  | NORMAL
 * Frontend uses:   CRITICAL | MEDIUM  | LOW
 *
 * (Frontend URGENCY_CONFIG only has CRITICAL, MEDIUM, LOW keys.)
 */
const BACKEND_TO_FRONTEND_URGENCY = {
  CRITICAL: 'CRITICAL',
  URGENT:   'MEDIUM',
  NORMAL:   'LOW',
};

const FRONTEND_TO_BACKEND_URGENCY = {
  CRITICAL: 'CRITICAL',
  MEDIUM:   'URGENT',
  LOW:      'NORMAL',
};

const FRONTEND_TO_BACKEND_BLOOD_TYPE = {
  'A+': 'A_POS',
  'A-': 'A_NEG',
  'B+': 'B_POS',
  'B-': 'B_NEG',
  'AB+': 'AB_POS',
  'AB-': 'AB_NEG',
  'O+': 'O_POS',
  'O-': 'O_NEG',
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

/**
 * Maps the backend BloodRequestResponse field names to the shorter names the
 * frontend components already rely on (request.bloodType, .units, .urgency,
 * .hospital, .patientName).
 *
 * The backend returns:  bloodTypeNeeded, unitsNeeded, urgencyLevel, hospitalName
 * The frontend expects: bloodType,       units,        urgency,      hospital
 */
function normalizeRequest(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const rawBloodType = raw.bloodType ?? raw.bloodTypeNeeded ?? '';
  return {
    ...raw,
    // Short aliases — keep original keys too so nothing breaks
    bloodType:   BACKEND_TO_FRONTEND_BLOOD_TYPE[rawBloodType] ?? rawBloodType,
    units:       raw.units       ?? raw.unitsNeeded     ?? 0,
    // Translate backend urgency value (URGENT/NORMAL) → frontend key (MEDIUM/LOW)
    urgency:     BACKEND_TO_FRONTEND_URGENCY[raw.urgencyLevel] ?? raw.urgency ?? raw.urgencyLevel ?? '',
    hospital:    raw.hospital    ?? raw.hospitalName    ?? '',
    // patientName is not in the backend response; use notes as fallback
    patientName: raw.patientName ?? '',
  };
}

// The backend has been updated to accept the frontend fields natively
function toBackendPayload(form) {
  // Ensure we send numbers where expected
  return {
    ...form,
    units: typeof form.units === 'number' ? form.units : parseInt(form.units, 10)
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const requestService = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.bloodType) query.set('bloodType', params.bloodType);
    // Translate frontend urgency filter value → backend value before sending
    if (params.urgency)   query.set('urgency', FRONTEND_TO_BACKEND_URGENCY[params.urgency] ?? params.urgency);
    if (params.district)  query.set('district', params.district);
    if (params.status)    query.set('status', params.status);
    const qs = query.toString();

    const data = await apiFetch(`/api/requests${qs ? `?${qs}` : ''}`);

    // Handle both array and paginated { content: [] } responses
    const list = Array.isArray(data) ? data : (data?.content ?? []);
    return list.map(normalizeRequest);
  },

  async getById(id) {
    const data = await apiFetch(`/api/requests/${id}`);
    return normalizeRequest(data);
  },

  async create(form) {
    return apiFetch('/api/requests', {
      method: 'POST',
      body: JSON.stringify(toBackendPayload(form)),
    });
  },
};

