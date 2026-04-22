import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
// NHỚ ĐƯA 2 HÀM MỚI VÀO IMPORT:
import { addCartItem, fetchCart, mergeCart, updateCartItem, removeCartItem } from '../api/cartApi';

const CartContext = createContext(null);
const API_BASE_URL = 'https://clothes-api.fernirx.io.vn/api/clothes';

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

      if (!data) {
        setCartItems([]);
        setCartCount(0);
        return;
      }

      const items = data?.data?.items || [];

      // ✨ FRONTEND TỰ ĐI TÌM ẢNH, TÊN, MÀU, SIZE
      const enrichedItems = await Promise.all(items.map(async (item) => {
        try {
          const detailRes = await fetch(`${API_BASE_URL}/products/${item.productSlug}`);
          if (!detailRes.ok) return item; 
          
          const detailJson = await detailRes.json();
          const productInfo = detailJson.data;

          if (productInfo) {
            const matchedVariant = productInfo.variants?.find(v => v.id === item.variantId);
            const colorObj = productInfo.imagesByColor?.find(c => c.color === matchedVariant?.color);
            
            // 🌟 ĐÃ TÍCH HỢP FIX LỖI NHẢY ẢNH: Ưu tiên ảnh isPrimary
            let imgUrl = '';
            if (colorObj && colorObj.images && colorObj.images.length > 0) {
              const primaryImage = colorObj.images.find(img => img.isPrimary === true);
              imgUrl = primaryImage ? primaryImage.imageUrl : colorObj.images[0].imageUrl;
            }

            return {
              ...item,
              productName: productInfo.name,          
              imageUrl: imgUrl,                       
              color: matchedVariant?.color || '',     
              size: matchedVariant?.size || ''        
            };
          }
          return item;
        } catch (e) {
          return item;
        }
      }));
      enrichedItems.sort((a, b) => a.id - b.id);
      setCartItems(enrichedItems);
      const total = enrichedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch (err) {
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
      setError(err.message || 'Thêm vào giỏ hàng thất bại');
      throw err;
    }
  }, [refreshCart]);

  // ✨ HÀM CẬP NHẬT SỐ LƯỢNG
  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Không cho giảm xuống dưới 1
    try {
      setIsLoading(true);
      await updateCartItem(itemId, newQuantity);
      await refreshCart();
    } catch (err) {
      setError(err.message || 'Lỗi cập nhật số lượng');
    } finally {
      setIsLoading(false);
    }
  }, [refreshCart]);

  // ✨ HÀM XÓA SẢN PHẨM
  const removeFromCart = useCallback(async (itemId) => {
    try {
      setIsLoading(true);
      await removeCartItem(itemId);
      await refreshCart();
    } catch (err) {
      setError(err.message || 'Lỗi xóa sản phẩm');
    } finally {
      setIsLoading(false);
    }
  }, [refreshCart]);

  const loginMerge = useCallback(async () => {
    try {
      await mergeCart();
      await refreshCart();
    } catch (err) {
      throw err;
    }
  }, [refreshCart]);

  // 👉 ĐÃ SỬA: Đưa hàm resetCart lên trên biến value
  const resetCart = useCallback(() => {
    setCartCount(0);
    setCartItems([]);
    setError(null);
  }, []);

  const value = {
    cartCount, cartItems, isLoading, error, 
    addToCart, refreshCart, loginMerge, 
    updateQuantity, removeFromCart,
    resetCart
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