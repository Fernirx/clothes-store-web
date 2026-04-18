import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();


  <button
    className="btn-add-new"
    onClick={() => navigate('/products/form')}
  >
    + Thêm mới
  </button>
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://clothes-api.fernirx.io.vn/api/clothes/admin/products");
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

  // --- HÀM XỬ LÝ XÓA SẢN PHẨM ---
  const handleDelete = async (id, name) => {
    // 1. Hỏi xác nhận trước khi xóa
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`);
    if (!isConfirm) return;

    try {
      // 2. Gọi API xóa (Thêm id vào cuối link)
      const response = await fetch(`https://clothes-api.fernirx.io.vn/api/clothes/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Xóa thất bại, mã lỗi: " + response.status);
      }

      // 3. Cập nhật lại giao diện (Lọc bỏ sản phẩm vừa xóa khỏi state)
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);

      alert(`Đã xóa thành công sản phẩm: ${name}`);

    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Đã xảy ra lỗi khi xóa. Vui lòng thử lại!");
    }
  };

  console.log(products);

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
                <th>id</th>
                <th>Sản phẩm</th>
                <th>Mã</th>
                <th>Giá bán</th>
                <th>Giá gốc</th>
                <th>Giá vốn</th>
                <th>Đã bán</th>
                <th>Lượt xem</th>
                <th>Badges</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const badges = [];
                if (p.isNew) badges.push('NEW');
                if (p.isOnSale) badges.push('SALE');
                const genderText = p.gender === "MALE" ? "Nam" : p.gender === "FEMALE" ? "Nữ" : "Unisex";
                // Format giá tiền Việt Nam
                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.basePrice);

                return (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div>
                          <div className="td-b">{p.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="td-mono">{p.code}</td>
                    <td className="td-b">{formattedPrice}</td>
                    <td className="td-b">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.originalPrice || 0)}</td>
                    <td className="td-b">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.costPrice || 0)}</td>
                    <td>{p.soldCount}</td>
                    <td>{p.viewCount}</td>
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
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {/* ĐÃ SỬA: Thay item thành p ở dòng dưới đây */}
<<<<<<< HEAD
                        <button className="btn btn-sm" onClick={() => navigate(`/products/form/${p.id}`, { state: { productData: p } })} >Sửa</button>
=======
                        <button className="btn btn-sm" onClick={() => navigate(`/products/form/edit/${p.id}`, { state: { productData: p } })} >Sửa</button>
>>>>>>> main

                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}