import React, { useState } from 'react';
import './ProductDetail.css';
import Sidebar from '../../components/HomeSidebar'; // Trỏ đúng đường dẫn file của bạn
import Topbar from '../../components/HomeTopbar';   // Nơi chứa giỏ hàng

export default function ProductDetail() {
  // State để lưu kích thước người dùng đang chọn
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImgIndex, setMainImgIndex] = useState(0);

  // Dữ liệu giả lập cho Quần Áo (Thay thế Nike)
  const product = {
    name: 'Áo Thun Nam Premium',
    category: "Men's Clothing",
    price: '350.000 ₫',
    originalPrice: '500.000 ₫',
    discount: '30% off',
    sustainability: 'Chất liệu tái chế',
    description: 'Chiếc áo thun cơ bản nhưng không hề đơn điệu. Được làm từ chất liệu cotton cao cấp pha sợi tổng hợp thân thiện với môi trường, mang lại cảm giác thoáng mát và form dáng đứng hoàn hảo cho mọi hoạt động thường ngày.',
    details: [
      'Màu sắc: Trắng/Đen',
      'Mã sản phẩm: TS-8146-104',
      'Sản xuất tại: Việt Nam'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    images: [
      'https://via.placeholder.com/600x800/f5f5f7/111111?text=Ao+Thun+Mat+Truoc',
      'https://via.placeholder.com/600x800/f5f5f7/111111?text=Ao+Thun+Mat+Sau',
      'https://via.placeholder.com/600x800/f5f5f7/111111?text=Ao+Thun+Goc+Nghieng',
      'https://via.placeholder.com/600x800/f5f5f7/111111?text=Chi+Tiet+Vai'
    ]
  };

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Topbar /> {/* Giỏ hàng nằm ở góc phải của Topbar này */}

        <div className="product-detail-container">
          
          {/* CỘT BÊN TRÁI: KHU VỰC HÌNH ẢNH */}
          <div className="product-gallery">
            {/* Cột ảnh thu nhỏ */}
            <div className="thumbnail-list">
              {product.images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`Thumbnail ${index}`} 
                  className={`thumbnail-item ${mainImgIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => setMainImgIndex(index)} // Di chuột vào là đổi ảnh chính
                />
              ))}
            </div>
            
            {/* Ảnh lớn */}
            <div className="main-image">
              <img src={product.images[mainImgIndex]} alt={product.name} />
            </div>
          </div>

          {/* CỘT BÊN PHẢI: THÔNG TIN VÀ NÚT MUA */}
          <div className="product-info-panel">
            <div className="sustainability-tag">{product.sustainability}</div>
            <h1 className="product-title">{product.name}</h1>
            <h2 className="product-category">{product.category}</h2>
            
            <div className="product-price">
              {product.price}
              <span className="original-price" style={{marginLeft: '8px'}}>{product.originalPrice}</span>
              <span className="discount-tag">{product.discount}</span>
            </div>

            {/* Chọn Size */}
            <div className="size-selector">
              <div className="size-header">
                <span>Chọn Kích Thước</span>
                <a href="#guide" style={{color: '#707072', textDecoration: 'none'}}>Bảng quy đổi kích cỡ</a>
              </div>
              <div className="size-grid">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="action-buttons">
              <button 
                className="btn-add-cart"
                onClick={() => {
                  if(!selectedSize) alert('Vui lòng chọn kích thước trước khi thêm vào giỏ!');
                  else alert(`Đã thêm ${product.name} (Size: ${selectedSize}) vào giỏ hàng!`);
                }}
              >
                Thêm vào giỏ hàng
              </button>
              <button className="btn-buy-now">
                Mua ngay
              </button>
            </div>

            {/* Mô tả chi tiết */}
            <div className="product-description">
              <p>{product.description}</p>
              <ul>
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}