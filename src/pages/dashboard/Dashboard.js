import React, { useEffect } from 'react';
import StatCard from '../../components/StatCard'; // Nhớ đường dẫn này nhé

export default function Dashboard() {

  useEffect(() => {
    const ctx = document.getElementById('chart-revenue');
    let myChart = null;

    if (ctx && window.Chart) {
      myChart = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: ['9/3', '10/3', '11/3', '12/3', '13/3', '14/3', '15/3'],
          datasets: [{
            data: [32.4, 41.2, 28.7, 55.1, 38.9, 62.3, 45.8],
            borderColor: '#111', borderWidth: 2,
            backgroundColor: 'rgba(0,0,0,0.04)', fill: true, tension: 0.4,
            pointRadius: 3, pointBackgroundColor: '#111', pointBorderWidth: 0
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#f5f5f5' }, ticks: { color: '#bbb', font: { size: 11 } } },
            y: { grid: { color: '#f5f5f5' }, ticks: { color: '#bbb', font: { size: 11 }, callback: v => v + 'M' }, beginAtZero: true }
          }
        }
      });
    }

    // Xóa biểu đồ cũ khi chuyển sang trang khác để không bị lỗi
    return () => {
      if (myChart) myChart.destroy();
    };
  }, []);

  return (
    <div className="page-content">
      {/* 4 THẺ THỐNG KÊ (Dùng StatCard component cho gọn) */}
      <div className="stats">
        <StatCard title="Doanh thu tháng" value="284.5M" change="12.4% tháng trước" isUp={true} colorClass="c1" />
        <StatCard title="Đơn hàng" value="1,247" change="8.1% tháng trước" isUp={true} colorClass="c2" />
        <StatCard title="Khách hàng mới" value="342" change="3.2% tháng trước" isUp={false} colorClass="c3" />
        <StatCard title="Tỉ lệ hoàn hàng" value="2.1%" change="tốt hơn 0.5%" isUp={true} colorClass="c4" />
      </div>

      <div className="g2">
        {/* BIỂU ĐỒ */}
        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">Doanh thu 7 ngày</span>
            <span className="card-act">Chi tiết →</span>
          </div>
          {/* Cần thẻ div bọc ngoài để chỉnh chiều cao biểu đồ */}
          <div style={{ height: '200px' }}>
            <canvas id="chart-revenue"></canvas>
          </div>
        </div>

        {/* ĐƠN HÀNG GẦN ĐÂY */}
        <div className="card">
          <div className="card-hd">
            <span className="card-ttl">Đơn hàng gần đây</span>
            <span className="card-act">Tất cả →</span>
          </div>
          <div className="sum-row"><span className="td-mono">ORD-00891</span><span style={{ flex: 1, color: 'var(--text2)', fontSize: '12px' }}>Nguyễn Văn A</span><span style={{ fontWeight: 700, fontSize: '12px' }}>850k</span><span className="badge b-delivered">Đã giao</span></div>
          <div className="sum-row"><span className="td-mono">ORD-00890</span><span style={{ flex: 1, color: 'var(--text2)', fontSize: '12px' }}>Trần Thị B</span><span style={{ fontWeight: 700, fontSize: '12px' }}>1.2M</span><span className="badge b-shipping">Vận chuyển</span></div>
          <div className="sum-row"><span className="td-mono">ORD-00889</span><span style={{ flex: 1, color: 'var(--text2)', fontSize: '12px' }}>Lê Minh C</span><span style={{ fontWeight: 700, fontSize: '12px' }}>420k</span><span className="badge b-pending">Chờ duyệt</span></div>
          <div className="sum-row"><span className="td-mono">ORD-00888</span><span style={{ flex: 1, color: 'var(--text2)', fontSize: '12px' }}>Phạm Thị D</span><span style={{ fontWeight: 700, fontSize: '12px' }}>670k</span><span className="badge b-cancelled">Đã hủy</span></div>
          <div className="sum-row"><span className="td-mono">ORD-00887</span><span style={{ flex: 1, color: 'var(--text2)', fontSize: '12px' }}>Hoàng Văn E</span><span style={{ fontWeight: 700, fontSize: '12px' }}>2.1M</span><span className="badge b-delivered">Đã giao</span></div>
        </div>
      </div>

      <div className="g3">
        {/* BÁN CHẠY */}
        <div className="card">
          <div className="card-hd"><span className="card-ttl">Bán chạy</span><span className="card-act">Xem →</span></div>
          <div className="sum-row"><span style={{ width: '18px', textAlign: 'center', color: 'var(--muted)', fontSize: '11px' }}>1</span><div className="pthumb">👕</div><div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: 600 }}>Áo thun basic nam</div><div className="pbar"><div className="pbar-fill" style={{ width: '100%' }}></div></div></div><span style={{ fontWeight: 700, fontSize: '12px' }}>247</span></div>
          <div className="sum-row"><span style={{ width: '18px', textAlign: 'center', color: 'var(--muted)', fontSize: '11px' }}>2</span><div className="pthumb">👖</div><div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: 600 }}>Quần jean slim fit</div><div className="pbar"><div className="pbar-fill" style={{ width: '80%' }}></div></div></div><span style={{ fontWeight: 700, fontSize: '12px' }}>198</span></div>
          <div className="sum-row"><span style={{ width: '18px', textAlign: 'center', color: 'var(--muted)', fontSize: '11px' }}>3</span><div className="pthumb">👗</div><div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: 600 }}>Váy hoa midi nữ</div><div className="pbar"><div className="pbar-fill" style={{ width: '62%' }}></div></div></div><span style={{ fontWeight: 700, fontSize: '12px' }}>154</span></div>
          <div className="sum-row"><span style={{ width: '18px', textAlign: 'center', color: 'var(--muted)', fontSize: '11px' }}>4</span><div className="pthumb">🧥</div><div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: 600 }}>Áo khoác bomber</div><div className="pbar"><div className="pbar-fill" style={{ width: '48%' }}></div></div></div><span style={{ fontWeight: 700, fontSize: '12px' }}>119</span></div>
        </div>

        {/* TỒN KHO SẮP HẾT */}
        <div className="card">
          <div className="card-hd"><span className="card-ttl">Tồn kho sắp hết</span><span className="card-act">Nhập hàng →</span></div>
          <div className="sum-row"><span className="dot dot-red"></span><span style={{ flex: 1, fontSize: '12px' }}>Áo thun Đỏ / M</span><span className="stock-crit">2</span></div>
          <div className="sum-row"><span className="dot dot-red"></span><span style={{ flex: 1, fontSize: '12px' }}>Quần jean Đen / 30</span><span className="stock-crit">1</span></div>
          <div className="sum-row"><span className="dot dot-amber"></span><span style={{ flex: 1, fontSize: '12px' }}>Váy hoa Trắng / S</span><span className="stock-warn">4</span></div>
          <div className="sum-row"><span className="dot dot-amber"></span><span style={{ flex: 1, fontSize: '12px' }}>Áo khoác Navy / L</span><span className="stock-warn">3</span></div>
          <div className="sum-row"><span className="dot dot-green"></span><span style={{ flex: 1, fontSize: '12px' }}>Polo Hồng / XL</span><span className="stock-good">18</span></div>
        </div>

        {/* HOẠT ĐỘNG */}
        <div className="card">
          <div className="card-hd"><span className="card-ttl">Hoạt động</span></div>
          <div className="act-item"><div className="act-dot-w"><div className="act-dot2"></div><div className="act-line"></div></div><div style={{ flex: 1 }}><div className="act-txt">Đơn ORD-00891 đã giao thành công</div></div><span className="act-t">2 phút</span></div>
          <div className="act-item"><div className="act-dot-w"><div className="act-dot2"></div><div className="act-line"></div></div><div style={{ flex: 1 }}><div className="act-txt">Khách mới: nguyenvana@gmail.com</div></div><span className="act-t">15 phút</span></div>
          <div className="act-item"><div className="act-dot-w"><div className="act-dot2"></div><div className="act-line"></div></div><div style={{ flex: 1 }}><div className="act-txt">Phiếu nhập PUR-00043 xác nhận</div></div><span className="act-t">1 giờ</span></div>
          <div className="act-item"><div className="act-dot-w"><div className="act-dot2"></div></div><div style={{ flex: 1 }}><div className="act-txt">Coupon SUMMER2026 dùng 12 lần hôm nay</div></div><span className="act-t">2 giờ</span></div>
        </div>
      </div>

    </div>
  );
}