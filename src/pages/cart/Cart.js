import React, { useState } from 'react';
import './Cart.css';

const Cart = () => {
  // Dữ liệu cứng mô phỏng theo cấu trúc API của bạn
  // Đã thêm một số trường phụ (imageUrl, color, size) để render giao diện giống Nike
  const [cartData, setCartData] = useState({
    message: "Lấy giỏ hàng thành công",
    data: {
      cartId: 101,
      guestToken: "guest_abc123xyz",
      items: [
        {
          id: 1,
          variantId: 1001,
          productName: "Áo Thun Thể Thao D-Crey",
          quantity: 1,
          price: 450000,
          subtotal: 450000,
          // Extra UI data
          imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          color: "Trắng/Đen",
          size: "L"
        },
        {
          id: 2,
          variantId: 1005,
          productName: "Quần Baggy D-Crey Nữ",
          quantity: 2,
          price: 550000,
          subtotal: 1100000,
          // Extra UI data
          imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          color: "Trắng kem",
          size: "M"
        }
      ],
      totalAmount: 1550000,
      totalItems: 3
    },
    timestamp: "2026-04-21T14:46:03.477Z"
  });

  const { items, totalAmount } = cartData.data;
  const deliveryFee = 50000; // Phí ship giả định

  // Hàm format tiền tệ VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="clothing-cart-container">
      <div className="cart-content">
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="cart-items-section">
          <h2 className="cart-heading">Giỏ hàng</h2>
          
          <div className="cart-item-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.productName} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <div className="item-header">
                    <h3 className="item-name">{item.productName}</h3>
                    <span className="item-price">{formatPrice(item.price)}</span>
                  </div>
                  
                  <p className="item-attribute">Màu sắc: {item.color}</p>
                  <p className="item-attribute">Kích cỡ: {item.size}</p>
                  
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
            <p>📦 Đổi trả miễn phí cho thành viên cửa hàng. <u>Tìm hiểu thêm</u></p>
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