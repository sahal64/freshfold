/**
 * Clean Architecture API Client
 * Separates React components from network fetch logic.
 */

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.API_BASE || '';
const API_BASE = rawApiUrl ? `${rawApiUrl.replace(/\/+$/, '')}/api` : '/api';
const TOKEN_KEY = 'freshfold_admin_token';
const ADMIN_USER_KEY = 'freshfold_admin_user';

/**
 * Helper to handle fetch responses and errors uniformly
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    throw err;
  }

  return data;
}

/**
 * Returns Authorization header with stored JWT token if present
 */
function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/* =========================================================================
   PUBLIC CUSTOMER ENDPOINTS (No authentication required)
   ========================================================================= */

/**
 * Fetch all active laundry services/plans for public display
 * @returns {Promise<Array>}
 */
export async function fetchPublicPlans() {
  const response = await fetch(`${API_BASE}/plans`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  const data = await handleResponse(response);
  return data.plans || [];
}

/**
 * Submit a new laundry pickup order
 * @param {Object} orderData 
 * @returns {Promise<Object>}
 */
export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
}

/**
 * Fetch an existing order by its tracking/order number (e.g. FF-82914)
 * @param {string} trackingId 
 * @returns {Promise<Object>}
 */
export async function getOrderByTrackingId(trackingId) {
  const sanitizedId = encodeURIComponent(trackingId.trim().toUpperCase());
  const response = await fetch(`${API_BASE}/orders/${sanitizedId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

/**
 * Check backend API health
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return await handleResponse(response);
  } catch (error) {
    return { status: 'offline', message: error.message };
  }
}

/* =========================================================================
   ADMIN AUTHENTICATION ENDPOINTS
   ========================================================================= */

/**
 * Authenticate administrator with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} { token, admin }
 */
export async function adminLogin(email, password) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
  }
  return data;
}

/**
 * Remove admin token and sign out
 */
export function adminLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

/**
 * Get cached admin profile from local storage
 */
export function getStoredAdmin() {
  try {
    const userStr = localStorage.getItem(ADMIN_USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !userStr) return null;
    return JSON.parse(userStr);
  } catch (err) {
    return null;
  }
}

/**
 * Verify current admin token with backend
 */
export async function verifyAdminSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE}/admin/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (err) {
    adminLogout();
    return null;
  }
}

/* =========================================================================
   ADMIN PLAN MANAGEMENT ENDPOINTS (Requires Admin Token)
   ========================================================================= */

/**
 * Fetch all plans (active & inactive) for admin management
 * @returns {Promise<Array>}
 */
export async function adminFetchPlans() {
  const response = await fetch(`${API_BASE}/admin/plans`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(response);
  return data.plans || [];
}

/**
 * Create a new laundry plan
 * @param {Object} planData 
 * @returns {Promise<Object>}
 */
export async function adminCreatePlan(planData) {
  const response = await fetch(`${API_BASE}/admin/plans`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(planData),
  });
  return handleResponse(response);
}

/**
 * Update an existing laundry plan
 * @param {string} id 
 * @param {Object} planData 
 * @returns {Promise<Object>}
 */
export async function adminUpdatePlan(id, planData) {
  const response = await fetch(`${API_BASE}/admin/plans/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(planData),
  });
  return handleResponse(response);
}

/**
 * Toggle plan active/inactive status
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export async function adminTogglePlanStatus(id) {
  const response = await fetch(`${API_BASE}/admin/plans/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

/**
 * Delete a laundry plan
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export async function adminDeletePlan(id) {
  const response = await fetch(`${API_BASE}/admin/plans/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

/* =========================================================================
   ADMIN BOOKING & ORDER MANAGEMENT ENDPOINTS (Requires Admin Token)
   ========================================================================= */

/**
 * Fetch all customer bookings with optional search and status filter
 * @param {Object} params { search, status }
 * @returns {Promise<Array>}
 */
export async function adminFetchOrders(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);

  const url = `${API_BASE}/admin/orders${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(response);
  return data.orders || [];
}

/**
 * Update a booking's status
 * @param {string} orderId 
 * @param {string} newStatus 
 * @returns {Promise<Object>}
 */
export async function adminUpdateOrderStatus(orderId, newStatus) {
  const response = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: newStatus }),
  });
  return handleResponse(response);
}
