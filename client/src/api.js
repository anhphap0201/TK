const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Yêu cầu thất bại (${response.status})`);
  }
  return response.json();
}

export const api = {
  // Auth
  login: (code, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ code, password }),
  }),

  // Customer portal data
  getCustomerData: (identifier, phone = null, isAdmin = false) => {
    const params = new URLSearchParams();
    if (phone) params.set('phone', phone);
    if (isAdmin) params.set('admin', 'true');
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/readings/customer/${encodeURIComponent(identifier)}${qs}`);
  },

  // Admin Customers
  getCustomers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/customers${qs ? `?${qs}` : ''}`);
  },
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Readings CRUD (Admin)
  createReading: (data) => request('/readings', { method: 'POST', body: JSON.stringify(data) }),
  updateReading: (id, data) => request(`/readings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReading: (id) => request(`/readings/${id}`, { method: 'DELETE' }),

  // Payments
  createPayosUrl: (readingId, returnUrl, cancelUrl) => request('/payment/create-payos-url', {
    method: 'POST',
    body: JSON.stringify({ reading_id: readingId, return_url: returnUrl, cancel_url: cancelUrl }),
  }),
  verifyPayosPayment: (orderCode, readingId) => request('/payment/verify-payos', {
    method: 'POST',
    body: JSON.stringify({ orderCode, reading_id: readingId }),
  }),
  simulatePayment: (readingId) => request('/payment/simulate', {
    method: 'POST',
    body: JSON.stringify({ reading_id: readingId }),
  }),
  getPayosConfig: () => request('/payment/payos-config'),
  updatePayosConfig: (data) => request('/payment/payos-config', { method: 'PUT', body: JSON.stringify(data) }),
  getPaymentConfig: () => request('/payment/payos-config'),
  updatePaymentConfig: (data) => request('/payment/payos-config', { method: 'PUT', body: JSON.stringify(data) }),

  // Tariffs
  getTariffs: () => request('/tariffs'),
  updateTariffs: (data) => request('/tariffs', { method: 'PUT', body: JSON.stringify(data) }),

  // Calculator preview
  previewCalculation: (data) => request('/readings/calculate-preview', { method: 'POST', body: JSON.stringify(data) }),

  // Stats & Dashboard
  getDashboardStats: (year = null) => {
    const qs = year ? `?year=${encodeURIComponent(year)}` : '';
    return request(`/stats/dashboard${qs}`);
  },
  getPeriodDetail: (period) => request(`/stats/period/${encodeURIComponent(period)}`),

  // Backup
  exportDataUrl: () => `${API_BASE}/backup/export`,
  importData: (data) => request('/backup/import', { method: 'POST', body: JSON.stringify(data) }),
};

export function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

export function formatNumber(num) {
  return new Intl.NumberFormat('vi-VN').format(num || 0);
}
