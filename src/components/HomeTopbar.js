import React, { useState } from 'react';

export default function ShopTopbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItems = [
    { id: 1, name: 'Áo thun basic trắng', price: '150.000đ', quantity: 1, img: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Quần jean ống rộng', price: '350.000đ', quantity: 2, img: 'https://via.placeholder.com/40' }
  ];

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '16px 40px', backgroundColor: '#000000', borderBottom: '1px solid #e5e5ea', fontFamily: 'sans-serif'
    }}>
      
      {/* 1. Logo Thương Hiệu */}
      <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px' }}>
        CLOTHING<span style={{ color: '#ff3b30' }}>.</span>
      </div>

      {/* 2. Thanh tìm kiếm */}
      <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm áo thun, quần jean..." 
          style={{ 
            width: '100%', padding: '10px 16px', borderRadius: '20px',
            border: '1px solid #d2d2d7', backgroundColor: '#f5f5f7', outline: 'none', fontSize: '14px'
          }}
        />
      </div>

      {/* 3. Cụm icon bên phải */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* Khu vực Giỏ hàng */}
        <div style={{ position: 'relative', padding: '10px 0' }}>
          
          {/* Icon giỏ hàng - SỬ DỤNG ONCLICK Ở ĐÂY */}
          <div 
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <span style={{ fontSize: '24px' }}>🛒</span>
            <span style={{
              position: 'absolute', top: '-8px', right: '-12px',
              backgroundColor: '#ff3b30', color: 'white', fontSize: '12px',
              fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px'
            }}>
              3
            </span>
          </div>

          {/* Minicart Dropdown */}
          {isCartOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: '-10px', width: '320px',
              backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              borderRadius: '8px', padding: '16px', zIndex: 1000, color: '#000000'
            }}>
              <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #e5e5ea', paddingBottom: '12px' }}>
                Giỏ hàng của bạn
              </h4>
              
              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={item.img} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#666666' }}>Số lượng: {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff3b30' }}>{item.price}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e5ea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px' }}>Tổng: <strong>850.000đ</strong></div>
                <button style={{
                  backgroundColor: '#000000', color: '#ffffff', border: 'none',
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
                }}>
                  Thanh toán
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ảnh đại diện User */}
        <img 
          src="https://via.placeholder.com/40" 
          alt="User Avatar" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}