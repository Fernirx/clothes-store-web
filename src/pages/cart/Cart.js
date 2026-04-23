import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, isLoading, error, updateQuantity, removeFromCart } = useCart();

  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]); // Lưu danh sách các item được tick

  // Hàm xử lý khi tick/bỏ tick checkbox
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId) // Bỏ tick
        : [...prev, itemId]                // Tick thêm
    );
  };

  // Tính toán tổng tiền CHỈ cho những sản phẩm được tick
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
      const total = selectedCartItems.reduce((sum, item) => sum + (item.subtotal || item.price * item.quantity), 0);
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [cartItems, selectedItems]);

  const items = cartItems || [];
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (isLoading) {
    return (
      <div className="clothing-cart-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clothing-cart-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'red' }}>Lỗi: {error}</p>
        </div>
      </div>
    );
  }

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

  const deliveryFee = totalAmount > 0 ? 50000 : 0; // Chỉ tính ship khi có chọn hàng

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }

    // Chuẩn bị dữ liệu để gửi đến checkout
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

    // Chuyển sang trang Checkout với thông tin các item được chọn
    navigate('/payment/checkout', {
      state: {
        cartItems: selectedCartItems,
        selectedItemIds: selectedItems,
        totalAmount: totalAmount,
      },
    });
  };

  return (
    <div className="clothing-cart-container">
      <div className="cart-content">
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="cart-items-section">
          <h2 className="cart-heading">Giỏ hàng</h2>

          <div className="cart-item-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

                {/* CHECKBOX CHỌN SẢN PHẨM */}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />

                <img
                  src={item.imageUrl || 'https://placehold.co/200x200/e2e8f0/64748b?text=No+Image'}
                  alt={item.productName || 'Sản phẩm'}
                  className="cart-item-image"
                />

                <div className="cart-item-details" style={{ flex: 1 }}>
                  <div className="item-header">
                    <h3 className="item-name">{item.productName || 'Đang tải tên...'}</h3>
                    <span className="item-price">{formatPrice(item.price)}</span>
                  </div>

                  {item.color && <p className="item-attribute">Màu sắc: {item.color}</p>}
                  {item.size && <p className="item-attribute">Kích cỡ: {item.size}</p>}

                  <div className="item-actions">
                    <div className="quantity-control">
                      {/* NÚT GIẢM */}
                      <button
                        className="qty-btn"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>

                      <span className="qty-number">{item.quantity}</span>

                      {/* NÚT TĂNG */}
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="action-icons">
                      {/* NÚT XÓA */}
                      <button
                        className="icon-btn"
                        title="Xóa"
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                            removeFromCart(item.id);
                            // Nếu xóa thì bỏ luôn tick
                            setSelectedItems(prev => prev.filter(id => id !== item.id));
                          }
                        }}
                      >
                        🗑️
                      </button>
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
            <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
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
            <button
              className="btn-checkout btn-guest"
              disabled={selectedItems.length === 0}
              onClick={handleCheckout}
              style={{ opacity: selectedItems.length === 0 ? 0.5 : 1 }}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;