import React, { useState, useEffect } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clothes/api/v1/products");
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        
        const result = await response.json();
        if (result.data && result.data.content) {
          setProducts(result.data.content);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchProducts();
  }, []);
 console.log (products) ;
  return (
    <div className="page-content">
      <div className="filters">
        <select className="f-select"><option>Tất cả thương hiệu</option><option>Zara</option><option>H&M</option><option>Uniqlo</option></select>
        <select className="f-select"><option>Danh mục</option><option>Áo</option><option>Quần</option><option>Váy</option></select>
        <select className="f-select"><option>Giới tính</option><option>Nam</option><option>Nữ</option></select>
        <select className="f-select"><option>Trạng thái</option><option>Đang bán</option><option>Ẩn</option></select>
        <input className="f-input" placeholder="Tìm tên, mã sản phẩm..." />
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Mã</th>
                <th>Thương hiệu</th>
                <th>Giá</th>
                <th>Đã bán</th>
                <th>Badges</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>            
              {products.map((p, index) => {               
                const badges = [];
                if (p.isNew) badges.push('NEW');
                if (p.isOnSale) badges.push('SALE');              
                const genderText = p.gender === "MALE" ? "Nam" : p.gender === "FEMALE" ? "Nữ" : "Unisex";               
                // Format giá tiền Việt Nam
                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.basePrice);

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div className="pthumb">🛍️</div>
                        <div>
                          <div className="td-b">{p.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
                            {p.material || 'Chưa cập nhật'} · {genderText}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="td-mono">{p.code}</td>
                    <td style={{ fontSize: '12px' }}>{p.brandName}</td>
                    <td className="td-b">{formattedPrice}</td>
                    <td>{p.soldCount}</td>
                    <td>
                      {badges.length > 0 ? badges.map((b, i) => (
                        <span key={i} className={`badge ${b === 'SALE' ? 'b-sale' : 'b-new'}`} style={{ marginRight: '4px' }}>
                          {b}
                        </span>
                      )) : '—'}
                    </td>
                    <td>
                      <span className={`badge ${p.isActive ? "b-active" : "b-inactive"}`}>
                        {p.isActive ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td><button className="btn btn-sm">Sửa</button></td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}