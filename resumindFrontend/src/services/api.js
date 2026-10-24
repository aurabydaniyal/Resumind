function normalizeBaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return 'http://localhost:5000/api/v1';
  }
  let clean = rawUrl.trim().replace(/\/+$/, '');
  // Auto-strip /health or /api/v1/health if accidentally pasted
  clean = clean.replace(/\/health$/, '');
  // Ensure the route prefix /api/v1 is present
  if (!clean.endsWith('/api/v1')) {
    clean = `${clean}/api/v1`;
  }
  return clean;
}

function resolveBaseUrl() {
  // 1. Injected at Vite build time via vite.config.js define
  if (typeof __APP_API_URL__ !== 'undefined' && __APP_API_URL__) {
    return normalizeBaseUrl(__APP_API_URL__);
  }
  // 2. Standard Vite runtime import.meta.env
  const metaEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
  const candidate =
    metaEnv.VITE_API_BASE_URL ||
    metaEnv.API_BASE_URL ||
    metaEnv.VITE_BACKEND_URL ||
    metaEnv.BACKEND_URL ||
    '';

  return normalizeBaseUrl(candidate);
}

const BASE_URL = resolveBaseUrl();

function getToken() {
  return localStorage.getItem('resumind_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('resumind_token', token);
  } else {
    localStorage.removeItem('resumind_token');
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data?.details;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      const connectionError = new Error('Cannot connect to Resumind backend API. Is the server running?');
      connectionError.status = 503;
      throw connectionError;
    }
    throw err;
  }
}

export const api = {
  // System Health
  getHealth: () => request('/health'),

  // Authentication
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () => request('/auth/me'),

  // Resumes
  listResumes: () => request('/resumes'),
  getResume: (id) => request(`/resumes/${id}`),
  createResume: (payload) =>
    request('/resumes', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateResume: (id, payload) =>
    request(`/resumes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  deleteResume: (id) =>
    request(`/resumes/${id}`, {
      method: 'DELETE'
    }),

  // AI Operations
  analyzeResume: (payload) =>
    request('/ai/analyze-resume', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  improveResume: (payload) =>
    request('/ai/improve-resume', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Analysis History
  listAnalyses: () => request('/analyses'),
  getAnalysis: (id) => request(`/analyses/${id}`),
  deleteAnalysis: (id) =>
    request(`/analyses/${id}`, {
      method: 'DELETE'
    })
};
