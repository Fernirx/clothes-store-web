import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, isLoading, error, refreshCart } = useCart();
  const [totalAmount, setTotalAmount] = useState(0);

  // Tải lại giỏ hàng khi component mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Tính toán tổng tiền
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + (item.subtotal || item.price * item.quantity), 0);
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [cartItems]);

  const items = cartItems || [];
  // Hàm format tiền tệ VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className="clothing-cart-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="clothing-cart-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'red' }}>Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  // Giỏ hàng trống
  if (!items || items.length === 0) {
    return (
      <div className="clothing-cart-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy thêm sản phẩm vào giỏ hàng</p>
        </div>
      </div>
    );
  }

  const deliveryFee = 50000; // Phí ship giả định

  return (
    <div className="clothing-cart-container">
      <div className="cart-content">
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="cart-items-section">
          <h2 className="cart-heading">Giỏ hàng</h2>
          
          <div className="cart-item-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imageUrl || 'https://placehold.co/200x200/e2e8f0/64748b?text=No+Image'}
                  alt={item.productName}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <div className="item-header">
                    <h3 className="item-name">{item.productName}</h3>
                    <span className="item-price">{formatPrice(item.price)}</span>
                  </div>
                  
                  {item.color && <p className="item-attribute">Màu sắc: {item.color}</p>}
                  {item.size && <p className="item-attribute">Kích cỡ: {item.size}</p>}

                  <div className="item-actions">
                    <div className="quantity-control">
                      <button className="qty-btn">-</button>
                      <span className="qty-number">{item.quantity}</span>
                      <button className="qty-btn">+</button>
                    </div>
                    
                    <div className="action-icons">
                      <button className="icon-btn" title="Xóa">🗑️</button>
                      <button className="icon-btn" title="Yêu thích">♡</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-policy">
            <p>Đổi trả miễn phí cho thành viên cửa hàng. <u>Tìm hiểu thêm</u></p>
          </div>
        </div>

        {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
        <div className="cart-summary-section">
          <h2 className="summary-heading">Tổng quan đơn hàng</h2>
          
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="summary-row">
            <span>Phí giao hàng dự kiến</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          
          <div className="summary-total">
            <span>Tổng cộng</span>
            <span>{formatPrice(totalAmount + deliveryFee)}</span>
          </div>
          
          <div className="checkout-actions">
            <button className="btn-checkout btn-guest">Thanh toán Khách</button>
            <button className="btn-checkout btn-member">Thanh toán Thành viên</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;