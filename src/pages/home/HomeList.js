import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import HomeTopbar from '../../components/HomeTopbar';
import AdsBanner from '../../components/AdsBanner';
import './HomeList.css';

import AOS from 'aos';
import 'aos/dist/aos.css';

const bannerImages = [
  'https://cdn.hstatic.net/1000281824/file/img_7821_3cbddeadfa224d8488587aae7c638bad.jpg',
  'https://cdn.hstatic.net/1000281824/file/degreyy1667_e220f839a785404893a5d66475d1c682.jpg',
  'https://cdn.hstatic.net/1000281824/file/img_7818_da83504672314801a306fa8c6938d786.jpg' 
];

const API_BASE_URL = 'https://clothes-api.fernirx.io.vn/api/clothes';

export default function HomeList() {
  const location = useLocation();
  const currentPath = location.pathname;

  // 1. STATE QUẢN LÝ DỮ LIỆU
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý cuộn ngang
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 2. GỌI API KHI TRANG VỪA LOAD
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 });

    const fetchProductsAndImages = async () => {
      try {
        setIsLoading(true);

        // BƯỚC 1: Lấy danh sách sản phẩm (chỉ lấy loại active)
        const productsResponse = await fetch(`${API_BASE_URL}/api/v1/products/active`);
        const productsResult = await productsResponse.json();
        
        let rawProducts = [];
        
        if (Array.isArray(productsResult.data)) {
          rawProducts = productsResult.data;
        } else if (productsResult.data && Array.isArray(productsResult.data.content)) {
          rawProducts = productsResult.data.content;
        } else if (Array.isArray(productsResult)) {
          rawProducts = productsResult;
        } else if (productsResult.data && Array.isArray(productsResult.data.items)) {
          rawProducts = productsResult.data.items;
        } else {
          console.error("Không tìm thấy mảng sản phẩm trong API response:", productsResult);
        }

        // BƯỚC 2: Gọi API lấy ảnh cho từng sản phẩm song song để tăng tốc độ
        const formattedProducts = await Promise.all(
          rawProducts.map(async (product) => {
            let coverImage = 'https://placehold.co/380x440/e2e8f0/64748b?text=Chua+Co+Anh';

            try {
              const imageResponse = await fetch(`${API_BASE_URL}/api/v1/images/by-product/${product.id}`);
              const imageResult = await imageResponse.json();
              
              if (imageResult.data && imageResult.data.length > 0) {
                const primaryImage = imageResult.data.find(img => img.isPrimary === true);
                coverImage = primaryImage ? primaryImage.imageUrl : imageResult.data[0].imageUrl;
              }
            } catch (err) {
              console.error(`Không lấy được ảnh cho sản phẩm ID: ${product.id}`, err);
            }

            // BƯỚC 3: Map dữ liệu cho khớp với thẻ sản phẩm trên giao diện
            return {
              id: product.id,
              name: product.name,
              tagline: product.description || 'Sản phẩm nổi bật.',
              price: product.basePrice ? `Từ ${product.basePrice.toLocaleString('vi-VN')}đ` : 'Liên hệ',
              isNew: product.isNew || false,
              image: coverImage,
              categoryPath: null 
            };
          })
        );

        setProducts(formattedProducts);
        
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsAndImages();
  }, []);

  // Cập nhật trạng thái hiển thị của nút qua lại khi dữ liệu đã load xong
  useEffect(() => {
    if (!isLoading) {
      checkScrollability();
      
      // SỬA LỖI TÀNG HÌNH: Làm mới AOS sau khi API trả về để nó tính toán lại chiều cao và hiện thẻ lên
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [products, isLoading]);

  // LỌC SẢN PHẨM: Sửa lại logic để không bị lỗi "Chưa có sản phẩm nào"
  const filteredProducts = products.filter(product => {
    if (currentPath === '/' || currentPath === '/danh-sach-quan-ao' || currentPath === '/new-arrivals') {
      return true; 
    }
    if (product.categoryPath) {
       return product.categoryPath === currentPath;
    }
    return false;
  });

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400; 
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  return (
    <div style={{ backgroundColor: '#fbfbfd', minHeight: '100vh', paddingBottom: '60px' }}> 
      
      <HomeTopbar />

      <div className="clothing-showcase-container">
        {(currentPath === '/' || currentPath === '/danh-sach-quan-ao' || currentPath === '/new-arrivals') && (
            <AdsBanner images={bannerImages} />
        )}

        <div className="clothing-header" data-aos="fade-up">
          <h2 className="clothing-main-title">
            Các sản phẩm mới. <span className="clothing-sub-title">Xem ngay có gì mới.</span>
          </h2>
        </div>

        {/* XỬ LÝ GIAO DIỆN KHI ĐANG TẢI (LOADING) */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '18px', color: '#86868b' }}>
            Đang tải dữ liệu sản phẩm...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="clothing-carousel-wrapper">
            
            {canScrollLeft && (
              <button className="clothing-nav-btn left" onClick={() => scroll('left')}>
                ❮
              </button>
            )}

            <div className="clothing-track" ref={carouselRef} onScroll={checkScrollability}>
              {filteredProducts.map((product) => (
                <Link to={`/san-pham/${product.id}`} key={product.id} className="clothing-card">
                  
                  {/* 1. ẢNH TRÊN CÙNG */}
                  <div className="clothing-image-box">
                    <img src={product.image} alt={product.name} /> 
                  </div>
                  
                  {/* 2. THÔNG TIN SẢN PHẨM Ở DƯỚI */}
                  <div className="clothing-info">
                    {/* Hiện chữ MỚI màu cam nếu isNew = true */}
                    {product.isNew && <span className="clothing-badge">MỚI</span>}
                    <h3 className="clothing-name">{product.name}</h3>
                    <p className="clothing-tagline">{product.tagline}</p>
                    <p className="clothing-price">{product.price}</p>
                  </div>

                </Link>
              ))}
            </div>

            {canScrollRight && (
              <button className="clothing-nav-btn right" onClick={() => scroll('right')}>
                ❯
              </button>
            )}

          </div>
        ) : (
          <div data-aos="fade-up" style={{ textAlign: 'center', padding: '100px 0', color: '#86868b' }}>
            <h2>Chưa có sản phẩm nào trong danh mục này.</h2>
          </div>
        )}

      </div>
    </div>
  );
}