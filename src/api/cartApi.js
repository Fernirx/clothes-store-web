const API_BASE_URL = process.env.REACT_APP_ROOT_API || 'https://clothes-api.fernirx.io.vn/api/clothes';

function getOrCreateGuestToken() {
  let token = localStorage.getItem('guestToken');
  if (!token) {
    token = 'guest_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    localStorage.setItem('guestToken', token);
  }
  return token;
}

export async function addCartItem(variantId, quantity = 1) {
  const accessToken = localStorage.getItem('accessToken');
  const body = JSON.stringify({ variantId, quantity });

  if (accessToken) {
    const res = await fetch(`${API_BASE_URL}/carts/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });
    if (!res.ok) throw new Error('Thêm vào giỏ hàng thất bại');
    return res.json();
  }

  const guestToken = getOrCreateGuestToken();
  const res = await fetch(`${API_BASE_URL}/carts/items?guestToken=${encodeURIComponent(guestToken)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error('Thêm vào giỏ hàng thất bại');
  return res.json();
}

export async function fetchCart() {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    const res = await fetch(`${API_BASE_URL}/carts`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    return res.json();
  }

  const guestToken = localStorage.getItem('guestToken');
  if (!guestToken) return null;

  const res = await fetch(`${API_BASE_URL}/carts?guestToken=${encodeURIComponent(guestToken)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function mergeCart() {
  const guestToken = localStorage.getItem('guestToken');
  const accessToken = localStorage.getItem('accessToken');
  if (!guestToken || !accessToken) return null;

  const res = await fetch(`${API_BASE_URL}/carts/merge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      guestToken,
    },
  });

  if (res.ok) {
    localStorage.removeItem('guestToken');
  }
  return res.ok ? res.json() : null;
}