import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title = "Dashboard", buttonText = "+ Thêm mới", onButtonClick }) {
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
    navigate('/');
  };

  return (
    <div className="topbar">
      <span className="tb-title">{title}</span>
      <div className="tb-search">
        <svg className="tb-si" width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input type="text" placeholder="Tìm kiếm..." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn" onClick={onButtonClick}>
          {buttonText}
        </button>

        {/* Hiển thị User Info hoặc Login Button */}
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
                width: '32px',
                height: '32px',
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
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>
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
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e7',
                  borderRadius: '8px',
                  padding: '8px',
                  minWidth: '120px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
                    color: '#ff3b30',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,59,48,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}