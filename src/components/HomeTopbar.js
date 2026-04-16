import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function HomeTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  // Lấy thông tin user từ localStorage khi component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Toggle hiển thị nút logout
  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLogout) {
        setShowLogout(false);
      }
    };

    if (showLogout) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showLogout]);

  // Hàm đăng xuất
  const handleLogout = () => {
    // Xoá thông tin user và tokens nhưng giữ lại các data khác
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/danh-sach-quan-ao');
  };

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
              onMouseOut={(e) => { if (!isActive) e.target.style.color = '#a1a1a6' }}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* 3. GIỎ HÀNG & USER / LOGIN */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Giỏ hàng */}
        <div style={{ cursor: 'pointer', fontSize: '18px' }} >🛒</div>

        {/* Hiển thị User hoặc Login Button */}
        {user ? (
          <div
            style={{
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleLogout();
            }}
          >
            {/* Avatar/Icon User */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#0066cc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {user.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Tên user */}
            <span style={{ fontSize: '13px', fontWeight: '500' }}>
              {user.firstName || user.email}
            </span>

            {/* Tooltip Logout */}
            {showLogout && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#1d1d1f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '8px',
                  minWidth: '120px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 1001,
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                    setShowLogout(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease',
            }}
            onClick={() => { navigate('/login'); }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </div>
  );
}