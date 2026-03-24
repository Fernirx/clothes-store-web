import React from 'react';

export default function ProductList() {
  const productsData = [
    { 
      id: "SP001", name: "Áo thun basic nam", sub: "Cotton 100% · Nam · 5 màu", icon: "👕",
      brand: "Uniqlo", price: "199.000đ", stock: 2, sold: 247, 
      badges: ["SALE"], status: "Hiển thị",
      stockClass: "stock-crit", statusClass: "b-active"
    },
    { 
      id: "SP002", name: "Quần jean slim fit", sub: "Denim · Nam · 3 màu", icon: "👖",
      brand: "Zara", price: "450.000đ", stock: 8, sold: 198, 
      badges: ["NEW"], status: "Hiển thị",
      stockClass: "stock-warn", statusClass: "b-active"
    },
    { 
      id: "SP003", name: "Váy hoa midi nữ", sub: "Voan · Nữ · 4 màu", icon: "👗",
      brand: "H&M", price: "380.000đ", stock: 45, sold: 154, 
      badges: ["NEW", "SALE"], status: "Hiển thị",
      stockClass: "stock-good", statusClass: "b-active"
    },
    { 
      id: "SP004", name: "Áo khoác bomber", sub: "Polyester · Unisex · 2 màu", icon: "🧥",
      brand: "Zara", price: "650.000đ", stock: 6, sold: 119, 
      badges: [], status: "Hiển thị",
      stockClass: "stock-warn", statusClass: "b-active"
    },
    { 
      id: "SP005", name: "Áo polo nữ", sub: "Cotton · Nữ · 6 màu", icon: "🩱",
      brand: "Uniqlo", price: "280.000đ", stock: 32, sold: 84, 
      badges: [], status: "Ẩn",
      stockClass: "stock-good", statusClass: "b-inactive"
    }
  ];

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
                <th>Tồn kho</th>
                <th>Đã bán</th>
                <th>Badges</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((p, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div className="pthumb">{p.icon}</div>
                      <div>
                        <div className="td-b">{p.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{p.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-mono">{p.id}</td>
                  <td style={{ fontSize: '12px' }}>{p.brand}</td>
                  <td className="td-b">{p.price}</td>
                  <td><span className={p.stockClass}>{p.stock}</span></td>
                  <td>{p.sold}</td>
                  <td>
                    {p.badges.length > 0 ? p.badges.map((b, i) => (
                      <span key={i} className={`badge ${b === 'SALE' ? 'b-sale' : 'b-new'}`} style={{ marginRight: '4px' }}>
                        {b}
                      </span>
                    )) : '—'}
                  </td>
                  <td><span className={`badge ${p.statusClass}`}>{p.status}</span></td>
                  <td><button className="btn btn-sm">Sửa</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}