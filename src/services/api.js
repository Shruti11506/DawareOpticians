/**
 * Centralized API service for DAWARE OPTICIANS
 * Supports both local development (http://127.0.0.1:8000/api) and
 * deployed production backend (https://backend-nine-ivory-90.vercel.app/api).
 */

const getApiBaseUrl = () => {
  // 1. Explicit Vite environment variable override (e.g. from Vercel settings or .env)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  // 2. Browser runtime: detect if running on Vercel or any remote production host
  if (typeof window !== 'undefined' && window.location) {
    const { hostname } = window.location;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '0.0.0.0') {
      return 'https://backend-nine-ivory-90.vercel.app/api';
    }
  }

  // 3. Fallback for local development
  return 'http://127.0.0.1:8000/api';
};

export const API_BASE_URL = getApiBaseUrl();

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errMsg = `Request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errMsg = errorData.detail || errMsg;
      } catch (e) {
        // ignore
      }
      throw new Error(errMsg);
    }
    return await response.json();
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  login: (username, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),

  // Health & Metrics
  checkHealth: () => request('/health'),
  getDashboardMetrics: () => request('/dashboard/metrics'),

  // Customers
  getCustomers: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/customers${query}`);
  },
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (data) => request('/customers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCustomer: (id, data) => request(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  patchCustomer: (id, data) => request(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteCustomer: (id) => request(`/customers/${id}`, {
    method: 'DELETE'
  }),

  // Categories
  getCategories: () => request('/categories'),

  // Products & Inventory
  getProducts: (params = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.append('search', params.search);
    if (params.category_id) q.append('category_id', params.category_id);
    if (params.low_stock) q.append('low_stock', 'true');
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request(`/products${qs}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateProduct: (id, data) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteProduct: (id) => request(`/products/${id}`, {
    method: 'DELETE'
  }),

  // Prescriptions
  getPrescriptions: (customerId = null) => {
    const query = customerId ? `?customer_id=${customerId}` : '';
    return request(`/prescriptions${query}`);
  },
  getPrescription: (id) => request(`/prescriptions/${id}`),
  createPrescription: (data) => request('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updatePrescription: (id, data) => request(`/prescriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deletePrescription: (id) => request(`/prescriptions/${id}`, {
    method: 'DELETE'
  }),

  // Sales & Billing
  getSales: (params = {}) => {
    const q = new URLSearchParams();
    if (params.customer_id) q.append('customer_id', params.customer_id);
    if (params.payment_status) q.append('payment_status', params.payment_status);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request(`/sales${qs}`);
  },
  getSale: (id) => request(`/sales/${id}`),
  createSale: (data) => request('/sales', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Payments
  getPayments: (saleId = null) => {
    const query = saleId ? `?sale_id=${saleId}` : '';
    return request(`/payments${query}`);
  },
  recordPayment: (data) => request('/payments', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Suppliers
  getSuppliers: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/suppliers${query}`);
  },
  createSupplier: (data) => request('/suppliers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateSupplier: (id, data) => request(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteSupplier: (id) => request(`/suppliers/${id}`, {
    method: 'DELETE'
  }),

  // Repairs
  getRepairs: (params = {}) => {
    const q = new URLSearchParams();
    if (params.repair_status) q.append('repair_status', params.repair_status);
    if (params.customer_id) q.append('customer_id', params.customer_id);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request(`/repairs${qs}`);
  },
  createRepair: (data) => request('/repairs', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateRepair: (id, data) => request(`/repairs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteRepair: (id) => request(`/repairs/${id}`, {
    method: 'DELETE'
  }),

  // Purchase Orders
  getPurchaseOrders: () => request('/purchase-orders'),
  createPurchaseOrder: (data) => request('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

