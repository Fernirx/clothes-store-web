import React, { useState } from 'react'; // Thêm useState
import { Link, useLocation } from 'react-router-dom';

export default function HomeTopbar() {
  const location = useLocation();
  const [isHoverCart, setIsHoverCart] = useState(false);
  const cartItems = [
    { id: 1, name: 'Áo thun Polo Blue', price: '250.000đ', quantity: 1, img: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Quần Jean Slimfit', price: '450.000đ', quantity: 1, img: 'https://via.placeholder.com/40' },
  ];
  const totalQuantity = cartItems.length;

  const categories = [
    { name: 'Hàng mới về', path: '/new-arrivals' },
    { name: 'Áo Thun', path: '/ao-thun' },
    { name: 'Quần Jean', path: '/quan-jean' },
    { name: 'Áo Khoác', path: '/ao-khoac' },
    { name: 'Váy & Đầm', path: '/vay-dam' },
  ];

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '0 40px', height: '60px', backgroundColor: 'rgba(17, 17, 17, 0.8)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 1000, color: 'white',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      
     
      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
        <Link to="/danh-sach-quan-ao" style={{ color: 'white', textDecoration: 'none' }}>
          CLOTHING<span style={{ color: '#0066cc' }}>.</span>
        </Link>
      </h2>
      <div style={{ display: 'flex', gap: '32px' }}>
        {categories.map((item, index) => (
          <Link key={index} to={item.path} style={{
            color: location.pathname === item.path ? '#ffffff' : '#a1a1a6',
            textDecoration: 'none', fontSize: '13px', letterSpacing: '0.5px'
          }}>
            {item.name}
          </Link>
        ))}
      </div>


      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <input type="text" placeholder="Tìm kiếm..." style={{
            padding: '6px 16px', borderRadius: '20px', border: 'none',
            backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', width: '150px'
        }} />

        {/* CỤM GIỎ HÀNG VỚI MINI CART */}
        <div 
          style={{ position: 'relative', padding: '10px 0' }}
          onMouseEnter={() => setIsHoverCart(true)}
          onMouseLeave={() => setIsHoverCart(false)}
        >
          {/* Icon Giỏ hàng & Badge số lượng */}
          <div style={{ cursor: 'pointer', fontSize: '20px', position: 'relative' }}>
            🛒
            {totalQuantity > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-10px',
                backgroundColor: '#ff3b30', color: 'white', fontSize: '10px',
                padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold',
                border: '2px solid #111'
              }}>
                {totalQuantity}
              </span>
            )}
          </div>

          {/* MINI CART (Hiện khi hover) */}
          {isHoverCart && (
            <div style={{
              position: 'absolute', top: '45px', right: '0', width: '300px',
              backgroundColor: '#1c1c1e', borderRadius: '12px', padding: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #333',
              zIndex: 1001
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                Giỏ hàng của bạn
              </h4>
              
              {/* Danh sách item trong Mini Cart */}
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <img src={item.img} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                      <div style={{ color: '#a1a1a6' }}>{item.quantity} x {item.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/cart" style={{
                display: 'block', textAlign: 'center', backgroundColor: '#0066cc',
                color: 'white', textDecoration: 'none', padding: '8px',
                borderRadius: '8px', fontSize: '13px', marginTop: '10px'
              }}>
                Xem toàn bộ giỏ hàng
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}