import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Import các icon siêu đẹp từ thư viện
import { FiStar, FiShoppingBag, FiTag } from 'react-icons/fi';
import { FaTshirt } from 'react-icons/fa';
import { GiTrousers, GiSleevelessJacket, GiSkirt } from 'react-icons/gi';

export default function ShopSidebar() {
  // Dùng useLocation để biết người dùng đang ở trang nào, từ đó bôi sáng menu đó lên
  const location = useLocation(); 

  const categories = [
    { name: 'Hàng mới về', path: '/new-arrivals', icon: <FiStar size={20} color="#ffd700" /> },
    { name: 'Áo Thun', path: '/ao-thun', icon: <FaTshirt size={20} /> },
    { name: 'Quần Jean', path: '/quan-jean', icon: <GiTrousers size={20} /> },
    { name: 'Áo Khoác', path: '/ao-khoac', icon: <GiSleevelessJacket size={20} /> },
    { name: 'Váy & Đầm', path: '/vay-dam', icon: <GiSkirt size={20} /> },
    { name: 'Phụ Kiện', path: '/phu-kien', icon: <FiShoppingBag size={20} /> },
    { name: 'Đang Giảm Giá', path: '/sale', icon: <FiTag size={20} color="#ff3b30" /> },
  ];

  return (
    <div style={{
      width: '260px', 
      backgroundColor: '#111111', // Màu nền tối tiệp với Admin
      borderRight: '1px solid #2a2a2a',
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh', // Kéo dài full màn hình
      color: '#ffffff'
    }}>
      
      {/* KHU VỰC LOGO TRÊN CÙNG */}
      <div style={{ padding: '0 24px', marginBottom: '40px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px' }}>
          Clothes<span style={{ color: '#ffffff' }}>Store</span>
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Cửa hàng trực tuyến
        </p>
      </div>

      {/* TIÊU ĐỀ DANH MỤC */}
      <h3 style={{ padding: '0 24px', fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
        Danh mục sản phẩm
      </h3>
      
      {/* DANH SÁCH MENU */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {categories.map((item, index) => {
          // Kiểm tra xem đường dẫn hiện tại có khớp với menu này không
          const isActive = location.pathname === item.path;
          
          return (
            <li key={index}>
              <Link 
                to={item.path} 
                style={{
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '16px', // Khoảng cách giữa icon và chữ
                  padding: '14px 24px', 
                  color: isActive ? '#ffffff' : '#a3a3a3', // Đang chọn thì màu trắng, bình thường màu xám
                  textDecoration: 'none', 
                  fontSize: '15px', 
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s',
                  backgroundColor: isActive ? '#ffffff15' : 'transparent',
                  borderLeft: isActive ? '4px solid #0066cc' : '4px solid transparent'
                }}
                onMouseOver={(e) => {
                  if(!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.backgroundColor = '#ffffff0a';
                  }
                }}
                onMouseOut={(e) => {
                  if(!isActive) {
                    e.currentTarget.style.color = '#a3a3a3';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {/* Khu vực hiển thị Icon */}
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </span>
                
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
      
    </div>
  );
}