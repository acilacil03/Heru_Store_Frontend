export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Helper to fetch with error handling and fallback
 */
async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || data?.error || `Request gagal dengan status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, err.message);
    throw err;
  }
}

/**
 * Products API calls
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'Semua') query.append('category', params.category);

  const qs = query.toString();
  const endpoint = `/api/product${qs ? `?${qs}` : ''}`;
  return fetchJson(endpoint, { method: 'GET' });
}

export async function getProductById(id) {
  return fetchJson(`/api/product/${id}`, { method: 'GET' });
}

export async function createProduct(payload) {
  return fetchJson('/api/product', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(payload) {
  return fetchJson('/api/product', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id) {
  return fetchJson(`/api/product?id=${id}`, {
    method: 'DELETE',
  });
}

/**
 * Auth API calls
 */
export async function loginUser(credentials) {
  return fetchJson('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(userData) {
  return fetchJson('/api/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Health check to verify backend connection
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
