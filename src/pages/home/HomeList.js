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
    image: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/666473757_2254281871770924_6079236901825892768_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=e06c5d&_nc_ohc=7RGVxIUYPkoQ7kNvwEVkOVL&_nc_oc=Adr7eiwvw8nTGj-OPjRL8RlPJuFsdWufWZWPvtI-5xwCznVDdCDo_4fIJNdYio7sFBZeiRR6utXu2HZaPNDNWdam&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=EAzElgWlUJD177eFTSlGAw&_nc_ss=7a3a8&oh=00_Af3i7jza7ii0s-jSZIv2D2teCYkewx94zxdfoc8fjUZJqA&oe=69DCD37A',
    colors: ['#1d1d1f', '#e3e4e5', '#d4af37'],
    categoryPath: '/ao-thun' // Đã thêm nhãn danh mục
  },
  {
    id: 2,
    name: 'Quần Jean ',
    tagline: 'Mỏng nhẹ nhất từng có.',
    image: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/454638983_3747864042150205_4762410526567005406_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=ukMka2LLSLgQ7kNvwFxUgiO&_nc_oc=Adpj4X2-gm-Z_GaoxiyARWj_dzFGIYgCtsSP9oqdVlqtF-Zag8uOIscZi4yypMtS7k2VmQPw6hrTpdHqsrdAeGwu&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=O1F3VCi-Tth5uYywg3EQTw&_nc_ss=7a3a8&oh=00_Af1-MxdoXT8dsZ6ijj1u4sQ6SokoO95i6K7IE0CgZ_xv8w&oe=69DCE9E2',
    colors: ['#87ceeb', '#000000'],
    categoryPath: '/quan-jean' // Đã thêm nhãn danh mục
  },
  {
    id: 3,
    name: 'Áo Khoác ',
    tagline: 'Thú vị hơn hẳn.',
    image: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/657796140_959412660284659_62029866625303473_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=VI9OlU18M4cQ7kNvwH9MkiJ&_nc_oc=AdqB8v5PIK-6s1pywURMA9a0dXaV2s_F9EpxZrrudfQSI4He8I2bSWuT0akCO9XhrU6KbRRPmoAhwqfk2aSNNVKP&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=Q1sPLP-9WRdZlOmxw83VLQ&_nc_ss=7a3a8&oh=00_Af0XQMxqkuJb91HOHqfVj-cOVOrQb5TNsbzxCerVPtvXsg&oe=69DCD8EF',
    colors: ['#e8b4b8', '#d6b8e8', '#b8cce8', '#1d1d1f'],
    categoryPath: '/ao-khoac' // Đã thêm nhãn danh mục
  },
  {
    id: 4,
    name: 'Polo ',
    tagline: 'Đủ tính năng. Vừa túi tiền.',
    image: 'https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-6/665921338_122176352618764749_1303370013299990697_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=13d280&_nc_ohc=5DhdxbK4DnIQ7kNvwG43EOA&_nc_oc=AdpxrxA67cOewvZt4PC-EovsCNx3UjgMbPxWvzJ7r2kdEpbXtiyvv1SMxDichBgRd_HJpaTpvOfVIxUlrpFyI4Jd&_nc_zt=23&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=RQQ6_B0JqGIsywZjJyKINQ&_nc_ss=7a3a8&oh=00_Af0CaDTdaAVUpBSqUyRfwdsLUtpULRm-0qhukKi5NSWU3w&oe=69DCD188',
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