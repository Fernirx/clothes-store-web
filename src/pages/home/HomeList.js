import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import HomeTopbar from '../../components/HomeTopbar';
import AdsBanner from '../../components/AdsBanner';
import './HomeList.css';

// Kích hoạt thư viện tạo hiệu ứng AOS
import AOS from 'aos';
import 'aos/dist/aos.css';


const bannerImages = [
  'https://cdn.hstatic.net/1000281824/file/img_7821_3cbddeadfa224d8488587aae7c638bad.jpg',
  'https://cdn.hstatic.net/1000281824/file/degreyy1667_e220f839a785404893a5d66475d1c682.jpg',
  'https://cdn.hstatic.net/1000281824/file/img_7818_da83504672314801a306fa8c6938d786.jpg' 
];

// DỮ LIỆU SẢN PHẨM
const StyleProducts = [
  { 
    id: 1, name: 'Áo', tagline: 'Thiết kế sáng tạo cho hiệu năng.',  
    image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/a71c7394-e164-47f5-888d-3499847ea58f/M+NSW+SS+MAX+90+TEE+FR+SU26.png', 
    colors: ['#1d1d1f', '#e3e4e5', '#d4af37'], categoryPath: '/ao-thun'
  },
  { 
    id: 2, name: 'Quần ', tagline: 'Mỏng nhẹ nhất từng có.', 
    image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/644ffad2-ba92-4c4c-8264-9e75ccf68937/AS+LJ+M+NK+PANT+FK.png', 
    colors: ['#87ceeb', '#000000'], categoryPath: '/quan-jean'
  },
  { 
    id: 3, name: 'Áo Khoác', tagline: 'Thú vị hơn hẳn.', 
    image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/b9092de0-17db-419d-82d2-7121393bed5b/AS+KB+M+NK+JKT+ASW.png', 
    colors: ['#e8b4b8', '#d6b8e8', '#b8cce8', '#1d1d1f'], categoryPath: '/ao-khoac'
  },
  { 
    id: 4, name: 'Polo', tagline: 'Đủ tính năng. Vừa túi tiền.', 
    image: 'https://www.rlmedia.io/is/image/PoloGSI/s7-1412366_alternate10?$rl_pdp_mob_zoom$', 
    colors: ['#ffb6c1', '#ffffff', '#1d1d1f'], categoryPath: '/ao-thun'
  },
];

export default function HomeList() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Chạy hiệu ứng khi trang web vừa load lên
  useEffect(() => {
    AOS.init({
      duration: 800, 
      easing: 'ease-out-cubic', 
      once: true, 
      offset: 50, 
    });
  }, []);

  const filteredProducts = StyleProducts.filter(product => {
    if (currentPath === '/danh-sach-quan-ao' || currentPath === '/new-arrivals') {
      return true; 
    }
    return product.categoryPath === currentPath;
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}> 
      
      <HomeTopbar />

      <div className="apple-style-container">
        {(currentPath === '/' || currentPath === '/danh-sach-quan-ao' || currentPath === '/new-arrivals') && (
            <AdsBanner images={bannerImages} />
        )}

        <div className="apple-header" data-aos="fade-up">
          <h1 style={{ fontSize: '48px', fontWeight: '600', letterSpacing: '-1px' }}>
            Khám phá dòng sản phẩm.
          </h1>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-carousel">
            
            {filteredProducts.map((product, index) => (
              
              <Link 
                to={`/san-pham/${product.id}`} 
                key={product.id} 
                className="product-card" 
                style={{ textDecoration: 'none', color: 'inherit' }}
                data-aos="fade-up" 
                data-aos-delay={index * 100} 
              >
                <div className="image-box">
                  <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '20px' }} />
                </div>
                <div className="color-variants">
                  {product.colors.map((color, idx) => (
                    <div key={idx} className="dot" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-tagline">{product.tagline}</p>
                </div>
              </Link>

            ))}
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