const API_BASE_URL = process.env.REACT_APP_ROOT_API || 'https://clothes-api.fernirx.io.vn/api/clothes';

// 1. SỬA HÀM NÀY: Dùng UUID chuẩn thay vì 'guest_'
function getOrCreateGuestToken() {
  let token = localStorage.getItem('guestToken');
  if (!token) {
    token = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
  const res = await fetch(`${API_BASE_URL}/carts/items`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-GUEST-TOKEN': guestToken 
    },
    body,
  });
  if (!res.ok) throw new Error('Thêm vào giỏ hàng thất bại');
  const data = await res.json();
  if (data?.data?.guestToken) {
    localStorage.setItem('guestToken', data.data.guestToken);
  }
  return data;
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

  const res = await fetch(`${API_BASE_URL}/carts`, {
    headers: {
      'X-GUEST-TOKEN': guestToken
    }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data?.data?.guestToken) {
    localStorage.setItem('guestToken', data.data.guestToken);
  }
  return data;
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
      'X-GUEST-TOKEN': guestToken, 
    },
  });

  if (res.ok) {
    localStorage.removeItem('guestToken');
  }
  return res.ok ? res.json() : null;
}

export async function updateCartItem(itemId, quantity) {
  const guestToken = localStorage.getItem('guestToken');
  const accessToken = localStorage.getItem('accessToken');
  const headers = { 'Content-Type': 'application/json' };
  
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  else headers['X-GUEST-TOKEN'] = guestToken;

  const res = await fetch(`${API_BASE_URL}/carts/items/${itemId}?quantity=${quantity}`, {
    method: 'PATCH',
    headers
  });
  if (!res.ok) throw new Error('Cập nhật số lượng thất bại');
  return res.json();
}

export async function removeCartItem(itemId) {
  const guestToken = localStorage.getItem('guestToken');
  const accessToken = localStorage.getItem('accessToken');
  const headers = { 'Content-Type': 'application/json' };
  
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  else headers['X-GUEST-TOKEN'] = guestToken;

  const res = await fetch(`${API_BASE_URL}/carts/items/${itemId}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) throw new Error('Xóa sản phẩm thất bại');
  return res.json();
}