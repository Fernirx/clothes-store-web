import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function HomeTopbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // State cho User Auth (Code hiện tại của bạn)
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  // State cho Mini Cart (Code tải từ mạng về)
  const [isHoverCart, setIsHoverCart] = useState(false);
  const cartItems = [
    { id: 1, name: 'Áo thun Polo Blue', price: '250.000đ', quantity: 1, img: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Quần Jean Slimfit', price: '450.000đ', quantity: 1, img: 'https://via.placeholder.com/40' },
  ];
  const totalQuantity = cartItems.length;

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

  const categories = [
    { name: 'Áo Nam', path: '/ao-thun' },
    { name: 'Áo Nữ', path: '/quan-jean' },
    { name: 'Áo trẻ em', path: '/ao-khoac' },
    { name: 'Áo Unisex', path: '/vay-dam' },
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

      {/* 2. MENU CÁC DANH MỤC */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {categories.map((item, index) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');
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
        <div
          style={{ cursor: 'pointer', fontSize: '18px', position: 'relative' }}
          onMouseEnter={() => setIsHoverCart(true)}
          onMouseLeave={() => setIsHoverCart(false)}
          onClick={() => navigate('/cart')} // <--- ĐÃ THÊM DÒNG NÀY ĐỂ CHUYỂN TRANG
        >
          🛒
          {totalQuantity > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-8px',
              backgroundColor: '#ff3b30',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '50%',
              padding: '2px 6px'
            }}>
              {totalQuantity}
            </span>
          )}
        </div>

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
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setShowLogout(false); 
                    navigate('/dashboard'); 
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
                  Admin
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