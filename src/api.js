import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

const api = axios.create({ baseURL: BASE_URL });

// ── Attach JWT token to every request automatically ───────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── If token expires/invalid, redirect to login ───────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/api/auth/login', { email, password }).then(r => r.data);

// ── Convert range string (24h, 1w, 1q, 1y) to hours number ───────────────────
function rangeToHours(range) {
  const map = { '24h': 24, '1w': 168, '1q': 2160, '1y': 8760 };
  return map[range] ?? 24;
}

// ── Live data ─────────────────────────────────────────────────────────────────
export const getAllLive = () =>
  api.get('/api/mongodb/live').then(r => r.data);

export const getTruckLive = (truckId) =>
  api.get(`/api/mongodb/live/${truckId}`).then(r => r.data);

// ── Truck list — derived from live status (no separate trucks endpoint) ────────
export const getTrucks = async () => {
  const liveData = await getAllLive();
  // Build truck list from live_status collection
  return liveData.map(l => ({
    id:           l.truck_id,
    vehicle_type: l.vehicle_type,
    name:         null,
    created_at:   l.ts,
  }));
};

// ── Historical telemetry ──────────────────────────────────────────────────────
export const getTelemetry = (truckId, { range } = {}) =>
  api.get(`/api/mongodb/history/${truckId}`, {
    params: { hours: rangeToHours(range) },
  }).then(r => r.data.data); // backend wraps in { truck_id, hours, total, data }

// ── GPS / location history ────────────────────────────────────────────────────
export const getLocation = (truckId, { range } = {}) =>
  api.get(`/api/mongodb/gps/${truckId}`, {
    params: { hours: rangeToHours(range) },
  }).then(r => r.data.data);

// ── Stats summary ─────────────────────────────────────────────────────────────
export const getStats = (truckId, range) =>
  api.get(`/api/mongodb/stats/${truckId}`, {
    params: { hours: rangeToHours(range) },
  }).then(r => r.data);
// ── User management (Admin only) ──────────────────────────────────────────────
export const getAllUsers = () =>
  api.get('/api/auth/users').then(r => r.data);

export const createUser = (userData) =>
  api.post('/api/auth/users', userData).then(r => r.data);

export const updateUser = (id, userData) =>
  api.put(`/api/auth/users/${id}`, userData).then(r => r.data);
// Add this to api.js
export const getVehicleColumns = (vehicleType) =>
  api.get(`/api/mongodb/columns/${vehicleType}`).then(r => r.data);
export const deleteUser = (id) =>
  api.delete(`/api/auth/users/${id}`).then(r => r.data);
// ── Excel download — triggers browser download ────────────────────────────────
export const downloadExcel = async (truckId, range) => {
  const response = await api.get('/api/mongodb/download', {
    params:       { truckId, hours: rangeToHours(range) },
    responseType: 'blob',
  });
  const url      = window.URL.createObjectURL(new Blob([response.data]));
  const link     = document.createElement('a');
  link.href      = url;
  link.setAttribute('download', `Telemetry_${truckId}_${range}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};