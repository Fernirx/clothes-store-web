import React from 'react';

export default function Coupons() {

  const couponData = [
    { 
      code: "SUMMER2026", type: "Giảm %", value: "15%", 
      condition: "Đơn ≥ 300k · max 100k", usage: "42 / 100", 
      percent: 42, expiry: "01/06 – 30/06/2026", status: "Hoạt động",
      typeClass: "b-percentage", statusClass: "b-active" 
    },
    { 
      code: "FREESHIP", type: "Tiền cố định", value: "30.000đ", 
      condition: "Đơn ≥ 500k", usage: "88 / 200", 
      percent: 44, expiry: "01/03 – 31/03/2026", status: "Hoạt động",
      typeClass: "b-fixed", statusClass: "b-active" 
    },
    { 
      code: "TET2026", type: "Giảm %", value: "20%", 
      condition: "Đơn ≥ 500k · max 200k", usage: "150 / 150", 
      percent: 100, expiry: "25/01 – 05/02/2026", status: "Hết hạn",
      typeClass: "b-percentage", statusClass: "b-inactive" 
    }
  ];

  return (
    <div className="page-content">
      <div className="filters">
        <select className="f-select"><option>Tất cả loại</option><option>Giảm %</option><option>Giảm tiền cố định</option></select>
        <select className="f-select"><option>Trạng thái</option><option>Đang hoạt động</option><option>Hết hạn</option></select>
        <input className="f-input" placeholder="Tìm mã coupon..." />
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Điều kiện</th>
                <th>Đã dùng / Giới hạn</th>
                <th>Thời hạn</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {couponData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '13px', fontFamily: 'monospace' }}>
                      {item.code}
                    </span>
                  </td>
                  <td><span className={`badge ${item.typeClass}`}>{item.type}</span></td>
                  <td className="td-b">{item.value}</td>
                  <td style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.condition}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{item.usage}</span>
                      <div className="pbar" style={{ width: '60px' }}>
                        <div className="pbar-fill" style={{ width: `${item.percent}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.expiry}</td>
                  <td><span className={`badge ${item.statusClass}`}>{item.status}</span></td>
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