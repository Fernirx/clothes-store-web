import React from 'react';
import './HomeList.css';
import Sidebar from '../../components/HomeSidebar';
import Topbar from '../../components/HomeTopbar';

import { useLocation, Link } from 'react-router-dom';

const StyleProducts = [
  { 
    id: 1, 
    name: 'Áo Thun ', 
    tagline: 'Thiết kế sáng tạo cho hiệu năng.',  
    image: 'https://via.placeholder.com/300x400/1d1d1f/ffffff?text=Ao+Thun+Pro', 
    colors: ['#1d1d1f', '#e3e4e5', '#d4af37'],
    categoryPath: '/ao-thun' // Đã thêm nhãn danh mục
  },
  { 
    id: 2, 
    name: 'Quần Jean ', 
    tagline: 'Mỏng nhẹ nhất từng có.', 
    image: 'https://via.placeholder.com/300x400/e0f4ff/1d1d1f?text=Jean+Air', 
    colors: ['#87ceeb', '#000000'],
    categoryPath: '/quan-jean' // Đã thêm nhãn danh mục
  },
  { 
    id: 3, 
    name: 'Áo Khoác ', 
    tagline: 'Thú vị hơn hẳn.', 
    image: 'https://via.placeholder.com/300x400/f5d0fe/1d1d1f?text=Ao+Khoac', 
    colors: ['#e8b4b8', '#d6b8e8', '#b8cce8', '#1d1d1f'],
    categoryPath: '/ao-khoac' // Đã thêm nhãn danh mục
  },
  { 
    id: 4, 
    name: 'Polo ', 
    tagline: 'Đủ tính năng. Vừa túi tiền.', 
    image: 'https://via.placeholder.com/300x400/ffe4e1/1d1d1f?text=Polo+SE', 
    colors: ['#ffb6c1', '#ffffff', '#1d1d1f'],
    categoryPath: '/ao-thun' // Đã thêm nhãn danh mục
  },
];

export default function HomeList() {
  const location = useLocation();
  const currentPath = location.pathname;

  const filteredProducts = StyleProducts.filter(product => {
    if (currentPath === '/danh-sach-quan-ao' || currentPath === '/new-arrivals') {
      return true; 
    }
    return product.categoryPath === currentPath;
  });

  return (
    <div className="layout-wrapper">
      {/* Cột Menu bên trái */}
      <Sidebar />

      <div className="main-content">
        {/* Thanh điều hướng phía trên */}
        <Topbar />

        {/* Khu vực hiển thị sản phẩm chính */}
        <div className="apple-style-container">
          
          <div className="apple-header">
            <h1>Khám phá dòng sản phẩm.</h1>
            {/* <a href="#compare">So sánh tất cả các phiên bản &gt;</a> */}
          </div>

          {/* Kiểm tra xem danh mục có sản phẩm nào không */}
          {filteredProducts.length > 0 ? (
            <div className="product-carousel">
              {/* Đã sửa thành filteredProducts.map để hiển thị đúng sản phẩm đã lọc */}
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/san-pham/${product.id}`} key={product.id} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {/* Khung hình ảnh bo góc lớn */}
                  <div className="image-box">
                    <img src={product.image} alt={product.name} />
                  </div>
                  </Link>
                  {/* Các chấm màu (Color variants) */}
                  <div className="color-variants">
                    {product.colors.map((color, index) => (
                      <div 
                        key={index} 
                        className="dot" 
                        style={{ backgroundColor: color }} 
                      />
                    ))}
                  </div>

                
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-tagline">{product.tagline}</p>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            // Thông báo hiển thị khi bấm vào danh mục chưa có sản phẩm (ví dụ: Váy & đầm)
            <div style={{ textAlign: 'center', padding: '50px', color: '#86868b' }}>
              <h2>Chưa có sản phẩm nào trong danh mục này.</h2>
              <p>Vui lòng quay lại sau nhé!</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}