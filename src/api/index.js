import api from './client'

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password })),
  me: () => api.get('/auth/me'),
  register: (data) => api.post('/auth/register', data),
}

// ── Packages ──────────────────────────────────────────
export const packagesAPI = {
  list: (params) => api.get('/packages', { params }),
  get: (id) => api.get(`/packages/${id}`),
  create: (data) => api.post('/packages', data),
  writeContent: (id, body) => api.put(`/packages/${id}/content`, { body }),
  addSEO: (id, data) => api.put(`/packages/${id}/seo`, data),
  review: (id, note) => api.patch(`/packages/${id}/review`, null, { params: { note } }),
  approve: (id, note) => api.patch(`/packages/${id}/approve`, null, { params: { note } }),
  requestRevision: (id, note) => api.patch(`/packages/${id}/request-revision`, null, { params: { note } }),
  getActivity: (id) => api.get(`/packages/${id}/activity`),
  stats: () => api.get('/packages/stats'),
  delete: (id) => api.delete(`/packages/${id}`),
}

// ── Categories ────────────────────────────────────────
export const categoriesAPI = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
}
