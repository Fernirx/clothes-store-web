import React from 'react';

export default function Reviews() {
  const reviewData = [
    { name: "Nguyễn A", avText: "NA", avColor: "av-blue", product: "Áo thun basic nam", stars: "★★★★★", text: "Vải mềm, mặc thoải mái, đúng size", date: "15/03", status: "Hiện", statusClass: "b-active" },
    { name: "Trần B", avText: "TB", avColor: "av-purple", product: "Quần jean slim fit", stars: "★★★★☆", text: "Đẹp nhưng hơi chật, nên lên 1 size", date: "14/03", status: "Hiện", statusClass: "b-active" },
    { name: "Lê M", avText: "LM", avColor: "av-green", product: "Váy hoa midi nữ", stars: "★★★☆☆", text: "Màu khác ảnh một chút", date: "13/03", status: "Ẩn", statusClass: "b-inactive" },
    { name: "Phạm T", avText: "PT", avColor: "av-orange", product: "Áo khoác bomber", stars: "★★★★★", text: "Mặc ấm, chất vải tốt, giao nhanh", date: "12/03", status: "Hiện", statusClass: "b-active" },
  ];
  const commentData = [
    { 
      name: "Nguyễn Văn A", avText: "NA", avColor: "av-blue", product: "Áo thun basic nam", date: "15/03", 
      body: "Size M có màu xanh navy không shop ơi?", 
      reply: "Shop: Dạ có bạn nhé! Bạn có thể chọn màu Xanh Navy khi đặt hàng ạ 😊",
      status: "Hiện", statusClass: "b-active" 
    },
    { 
      name: "Trần Thị B", avText: "TB", avColor: "av-purple", product: "Váy hoa midi nữ", date: "14/03", 
      body: "Váy mặc đi biển có đẹp không ạ?", 
      reply: null,
      status: "Hiện", statusClass: "b-active" 
    },
    { 
      name: "Hoàng Văn C", avText: "HV", avColor: "av-red", product: "Quần jean slim fit", date: "13/03", 
      body: "Quần bị lỗi đường chỉ, mình đã liên hệ shop rồi", 
      reply: null,
      status: "Ẩn", statusClass: "b-inactive" 
    }
  ];

  return (
    <div className="page-content">
      <div className="g2">
        <div>
          <div className="filters" style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>ĐÁNH GIÁ</span>
            <select className="f-select"><option>Tất cả sao</option><option>5 sao</option><option>4 sao</option></select>
            <select className="f-select"><option>Trạng thái</option><option>Hiển thị</option><option>Ẩn</option></select>
          </div>
          <div className="card">
            <div className="card-hd">
              <span className="card-ttl">Đánh giá sản phẩm</span>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Tổng 128 đánh giá</span>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Sao</th>
                    <th>Nhận xét</th>
                    <th>Ngày</th>
                    <th>Hiển thị</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewData.map((rev, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div className={`av ${rev.avColor}`} style={{ width: '22px', height: '22px', fontSize: '8px' }}>{rev.avText}</div>
                          <span className="td-b">{rev.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '11px' }}>{rev.product}</td>
                      <td><span className="stars">{rev.stars}</span></td>
                      <td style={{ fontSize: '11px', color: 'var(--text2)', maxWidth: '160px' }}>{rev.text}</td>
                      <td style={{ fontSize: '10px', color: 'var(--muted)' }}>{rev.date}</td>
                      <td><span className={`badge ${rev.statusClass}`}>{rev.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="filters" style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>BÌNH LUẬN</span>
            <select className="f-select"><option>Trạng thái</option><option>Hiển thị</option><option>Ẩn</option></select>
          </div>
          <div className="card">
            <div className="card-hd">
              <span className="card-ttl">Bình luận sản phẩm</span>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Tổng 56 bình luận</span>
            </div>
            {commentData.map((cmt, i) => (
              <div className="cmt-item" key={i}>
                <div className="cmt-head">
                  <div className={`av ${cmt.avColor}`} style={{ width: '26px', height: '26px', fontSize: '9px' }}>{cmt.avText}</div>
                  <div>
                    <div className="cmt-name">{cmt.name}</div>
                    <div className="cmt-prod">{cmt.product} · {cmt.date}</div>
                  </div>
                  <span className={`badge ${cmt.statusClass}`} style={{ marginLeft: 'auto' }}>{cmt.status}</span>
                </div>
                <div className="cmt-body">{cmt.body}</div>
                {cmt.reply && <div className="cmt-reply">{cmt.reply}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}