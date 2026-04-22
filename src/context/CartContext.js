import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { addCartItem, fetchCart, mergeCart } from '../api/cartApi';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCart();

      // Nếu fetchCart trả về null (lỗi 401 hoặc không có token), dùng giỏ hàng trống
      if (!data) {
        setCartItems([]);
        setCartCount(0);
        return;
      }

      const items = data?.data?.items || [];
      setCartItems(items);
      const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch (err) {
      console.error('Lỗi tải giỏ hàng:', err);
      setError(err.message || 'Không thể tải giỏ hàng');
      setCartCount(0);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (variantId, quantity = 1) => {
    try {
      setError(null);
      await addCartItem(variantId, quantity);
      await refreshCart();
    } catch (err) {
      const errorMsg = err.message || 'Thêm vào giỏ hàng thất bại';
      setError(errorMsg);
      console.error('Lỗi thêm vào giỏ hàng:', err);
      throw err;
    }
  }, [refreshCart]);

  const loginMerge = useCallback(async () => {
    try {
      setError(null);
      await mergeCart();
      await refreshCart();
    } catch (err) {
      console.error('Lỗi gộp giỏ hàng:', err);
      setError(err.message || 'Gộp giỏ hàng thất bại');
      throw err;
    }
  }, [refreshCart]);

  const resetCart = useCallback(() => {
    setCartCount(0);
    setCartItems([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    cartCount,
    cartItems,
    isLoading,
    error,
    addToCart,
    refreshCart,
    loginMerge,
    resetCart,
    clearError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart phải dùng trong CartProvider');
  return ctx;
}