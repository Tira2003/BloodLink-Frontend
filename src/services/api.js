const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('bl_token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('bl_token');
    localStorage.removeItem('bl_user');
    window.location.href = '/login';
    return;
  }

  let data;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message = (data && data.message) || data || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
