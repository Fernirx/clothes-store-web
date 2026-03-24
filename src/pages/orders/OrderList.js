import React from 'react';

export default function OrderList() {
  const orderData = [
    { id: "ORD-00891", name: "Nguyễn Văn A", phone: "0901234567", items: "3 sản phẩm", total: "850.000đ", payment: "Đã thanh toán", status: "Đã giao", date: "15/03/2026", avColor: "av-blue", avText: "NA", payClass: "b-paid", statusClass: "b-delivered" },
    { id: "ORD-00890", name: "Trần Thị B", phone: "0912345678", items: "1 sản phẩm", total: "1.200.000đ", payment: "Đã thanh toán", status: "Vận chuyển", date: "14/03/2026", avColor: "av-purple", avText: "TB", payClass: "b-paid", statusClass: "b-shipping" },
    { id: "ORD-00889", name: "Lê Minh C", phone: "0923456789", items: "2 sản phẩm", total: "420.000đ", payment: "Chưa TT", status: "Chờ xác nhận", date: "15/03/2026", avColor: "av-green", avText: "LM", payClass: "b-unpaid", statusClass: "b-pending" },
  ];
  return (
    <div className="page-content">
      <div className="filters">
        <select className="f-select"><option>Tất cả trạng thái</option><option>PENDING</option><option>DELIVERED</option></select>
        <select className="f-select"><option>Thanh toán</option><option>UNPAID</option><option>PAID</option></select>
        <select className="f-select"><option>Phương thức</option><option>VNPay</option><option>COD</option></select>
        <input className="f-input" placeholder="Tìm mã đơn, tên khách..." />
        <button className="btn btn-sm">Lọc</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orderData.map((order, index) => (
                <tr key={index}>
                  <td className="td-mono">{order.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className={`av ${order.avColor}`}>{order.avText}</div>
                      <div>
                        <div className="td-b">{order.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{order.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '11px' }}>{order.items}</td>
                  <td className="td-b">{order.total}</td>
                  <td><span className={`badge ${order.payClass}`}>{order.payment}</span></td>
                  <td><span className={`badge ${order.statusClass}`}>{order.status}</span></td>
                  <td style={{ fontSize: '11px', color: 'var(--muted)' }}>{order.date}</td>
                  <td><button className="btn btn-sm">Chi tiết</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}