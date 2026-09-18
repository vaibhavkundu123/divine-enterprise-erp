const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorMsg = Array.isArray(errorJson.detail)
            ? errorJson.detail.map(d => d.msg).join(', ')
            : errorJson.detail;
        }
      } catch (_) {}
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  // Analytics & Copilot
  getKPIs: () => request('/analytics/kpis'),
  getCopilot: () => request('/analytics/copilot'),
  getWaveforms: (horizon = '30D') => request(`/analytics/waveforms?horizon=${horizon}`),
  getDailySales: () => request('/analytics/daily-sales'),
  getDailyAds: () => request('/analytics/daily-ads'),

  // Stock
  getStock: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/stock${query ? `?${query}` : ''}`);
  },
  getStyleCatalog: () => request('/stock/styles'),
  triggerSync: () => request('/stock/sync', { method: 'POST' }),

  // Procurement
  getProcurement: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/procurement${query ? `?${query}` : ''}`);
  },
  getProcurementDaily: () => request('/procurement/daily'),
  createProcurement: (data) => request('/procurement', { method: 'POST', body: JSON.stringify(data) }),
  updateProcurement: (id, data) => request(`/procurement/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProcurement: (id) => request(`/procurement/${id}`, { method: 'DELETE' }),

  // Sales
  getSales: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/sales${query ? `?${query}` : ''}`);
  },
  previewSale: (data) => request('/sales/preview', { method: 'POST', body: JSON.stringify(data) }),
  createSale: (data) => request('/sales', { method: 'POST', body: JSON.stringify(data) }),
  updateSale: (id, data) => request(`/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSale: (id) => request(`/sales/${id}`, { method: 'DELETE' }),

  // RTO Pipeline
  getRTO: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/rto${query ? `?${query}` : ''}`);
  },
  createRTO: (data) => request('/rto', { method: 'POST', body: JSON.stringify(data) }),
  receiveRTO: (id) => request(`/rto/${id}/receive`, { method: 'POST' }),
  restockRTO: (id) => request(`/rto/${id}/restock`, { method: 'POST' }),
  damageRTO: (id) => request(`/rto/${id}/damage`, { method: 'POST' }),
  bulkRestockRTO: () => request('/rto/bulk-restock', { method: 'POST' }),
  updateRTO: (id, data) => request(`/rto/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRTO: (id) => request(`/rto/${id}`, { method: 'DELETE' }),

  // Customer Returns
  getReturns: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/customer-returns${query ? `?${query}` : ''}`);
  },
  createReturn: (data) => request('/customer-returns', { method: 'POST', body: JSON.stringify(data) }),
  receiveReturn: (id) => request(`/customer-returns/${id}/receive`, { method: 'POST' }),
  damageReturn: (id) => request(`/customer-returns/${id}/damage`, { method: 'POST' }),
  qcReturn: (id, grade, notes = '') => request(`/customer-returns/${id}/qc?grade=${encodeURIComponent(grade)}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`, { method: 'POST' }),
  restockReturn: (id) => request(`/customer-returns/${id}/restock`, { method: 'POST' }),
  bulkRestockReturns: () => request('/customer-returns/bulk-restock', { method: 'POST' }),
  updateReturn: (id, data) => request(`/customer-returns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReturn: (id) => request(`/customer-returns/${id}`, { method: 'DELETE' }),

  // Item Exchanges
  getExchanges: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/exchanges${query ? `?${query}` : ''}`);
  },
  createExchange: (data) => request('/exchanges', { method: 'POST', body: JSON.stringify(data) }),
  receiveExchange: (id) => request(`/exchanges/${id}/receive`, { method: 'POST' }),
  restockExchange: (id) => request(`/exchanges/${id}/restock`, { method: 'POST' }),
  damageExchange: (id) => request(`/exchanges/${id}/damage`, { method: 'POST' }),
  bulkRestockExchanges: () => request('/exchanges/bulk-restock', { method: 'POST' }),
  updateExchange: (id, data) => request(`/exchanges/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExchange: (id) => request(`/exchanges/${id}`, { method: 'DELETE' }),

  // Marketing / Ads
  getAds: (params = {}) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== ''));
    const query = new URLSearchParams(clean).toString();
    return request(`/ads${query ? `?${query}` : ''}`);
  },
  getAdSummary: () => request('/ads/summary'),
  createAd: (data) => request('/ads', { method: 'POST', body: JSON.stringify(data) }),
  updateAd: (id, data) => request(`/ads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAd: (id) => request(`/ads/${id}`, { method: 'DELETE' }),

  // Bank Reconciliation
  getBank: (params = {}) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== ''));
    const query = new URLSearchParams(clean).toString();
    return request(`/bank${query ? `?${query}` : ''}`);
  },
  createBank: (data) => request('/bank', { method: 'POST', body: JSON.stringify(data) }),
  updateBank: (id, data) => request(`/bank/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBank: (id) => request(`/bank/${id}`, { method: 'DELETE' }),

  // Regulatory Audit Trail
  getAudit: (params = {}) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== ''));
    const query = new URLSearchParams(clean).toString();
    return request(`/audit${query ? `?${query}` : ''}`);
  },
  clearAudit: () => request('/audit/clear', { method: 'POST' }),
};
