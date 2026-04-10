import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function HomeTopbar() {
  const location = useLocation();

  // Đưa các danh mục từ Sidebar cũ lên đây
  const categories = [
    { name: 'Hàng mới về', path: '/new-arrivals' },
    { name: 'Áo Thun', path: '/ao-thun' },
    { name: 'Quần Jean', path: '/quan-jean' },
    { name: 'Áo Khoác', path: '/ao-khoac' },
    { name: 'Váy & Đầm', path: '/vay-dam' },
  ];

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0 40px',
      height: '60px',
      backgroundColor: 'rgba(17, 17, 17, 0.8)', // Nền đen trong suốt
      backdropFilter: 'blur(12px)', // Hiệu ứng mờ nền chuẩn Apple
      WebkitBackdropFilter: 'blur(12px)', // Dành cho Safari
      position: 'sticky', // Ghim chặt lên trên cùng
      top: 0,
      zIndex: 1000,
      color: 'white',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      
      {/* 1. LOGO TÊN SHOP */}
      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
        <Link to="/danh-sach-quan-ao" style={{ color: 'white', textDecoration: 'none' }}>
          CLOTHING<span style={{ color: '#0066cc' }}>.</span>
        </Link>
      </h2>

      {/* 2. MENU DANH MỤC Ở GIỮA */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {categories.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index}
              to={item.path} 
              style={{
                color: isActive ? '#ffffff' : '#a1a1a6',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '400',
                transition: 'color 0.2s ease',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => e.target.style.color = '#ffffff'}
              onMouseOut={(e) => { if(!isActive) e.target.style.color = '#a1a1a6' }}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* 3. TÌM KIẾM & GIỎ HÀNG */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm..." 
          style={{
            padding: '6px 16px', borderRadius: '20px', border: 'none',
            backgroundColor: 'rgba(255,255,255,0.1)', color: 'white',
            outline: 'none', fontSize: '13px', width: '180px'
          }}
        />
        <div style={{ cursor: 'pointer', fontSize: '18px' }} >🛒</div>
      </div>
    </div>
  );
}