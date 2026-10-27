// API Helper untuk frontend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function untuk menangani fetch dan response dengan aman
async function handleFetch(url, options = {}) {
  const res = await fetch(url, options);

  // Jika response tidak OK, baca dulu sebagai text agar tidak crash di res.json()
  if (!res.ok) {
    let errorMessage = `HTTP Error ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Jika bukan format JSON (HTML error page), ambil text biasa
      const text = await res.text();
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return await res.json();
}

export async function loginUser(credentials) {
  return await handleFetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

export async function getProducts() {
  return await handleFetch(`${API_BASE}/api/product`);
}

export async function addProduct(productData) {
  return await handleFetch(`${API_BASE}/api/product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id, productData) {
  return await handleFetch(`${API_BASE}/api/product/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(id) {
  return await handleFetch(`${API_BASE}/api/product/${id}`, {
    method: 'DELETE',
  });
}