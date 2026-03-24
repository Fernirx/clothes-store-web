import React from 'react';

const categoryData = [
	{ name: 'Tất cả', count: '15', badgeClass: 'b-new', active: true },
	{ name: 'Đơn hàng', count: '6', badgeClass: 'b-shipping' },
	{ name: 'Thanh toán', count: '3', badgeClass: 'b-paid' },
	{ name: 'Kho hàng', count: '4', badgeClass: 'b-cancelled' },
	{ name: 'Đánh giá', count: '2' },
	{ name: 'Khuyến mãi', count: '0' },
];

const notificationsData = [
	{
		icon: '📦',
		iconClass: 'notif-bg-blue notif-unread',
		title: 'Đơn ORD-00891 đã giao thành công',
		body: 'Khách hàng Nguyễn Văn A đã nhận hàng. Nhắc review sản phẩm.',
		time: '2 phút trước',
		tag: 'ĐƠN HÀNG',
		tagClass: 'b-shipping',
	},
	{
		icon: '⚠️',
		iconClass: 'notif-bg-yellow',
		title: 'Tồn kho SP001-RED-M còn 2 cái',
		body: 'Biến thể Áo thun basic / Đỏ / M đã xuống dưới mức tối thiểu (5). Cần nhập thêm hàng.',
		time: '1 giờ trước',
		tag: 'KHO HÀNG',
		tagClass: 'b-cancelled',
	},
	{
		icon: '💳',
		iconClass: 'notif-bg-green',
		title: 'Thanh toán VNPay thành công',
		body: 'Đơn ORD-00890 đã được thanh toán 1.200.000đ qua VNPay.',
		time: '2 giờ trước',
		tag: 'THANH TOÁN',
		tagClass: 'b-active',
	},
	{
		icon: '⭐',
		iconClass: 'notif-bg-purple',
		title: 'Đánh giá mới cần duyệt',
		body: 'Lê Minh C vừa đánh giá 3 sao cho Váy hoa midi nữ. Cần kiểm tra và duyệt.',
		time: '3 giờ trước',
		tag: 'ĐÁNH GIÁ',
		tagClass: 'b-percentage',
	},
	{
		icon: '🔔',
		iconClass: 'notif-bg-gray',
		title: 'Hệ thống: Backup DB hoàn tất',
		body: 'Backup tự động lúc 02:00 ngày 15/03/2026 đã hoàn thành thành công.',
		time: '13 giờ trước',
		tag: 'HỆ THỐNG',
		tagClass: 'b-inactive',
	},
];

export default function Notifications() {
	return (
		<div className="page-content">
			<div className="g12">
				<div className="card notif-side-card">
					<div className="card-hd">
						<span className="card-ttl">Phân loại</span>
					</div>

					<div className="notif-categories">
						{categoryData.map((category) => (
							<div
								key={category.name}
								className={`notif-category-item ${category.active ? 'on' : ''}`}
							>
								<span className="notif-category-name">{category.name}</span>
								{category.badgeClass ? (
									<span className={`badge ${category.badgeClass}`}>{category.count}</span>
								) : (
									<span className="notif-count-muted">{category.count}</span>
								)}
							</div>
						))}
					</div>

					<div className="notif-side-footer">
						<button className="btn btn-sm btn-dark notif-create-btn">+ Tạo thông báo</button>
					</div>
				</div>

				<div className="card">
					<div className="card-hd">
						<span className="card-ttl">Tất cả thông báo</span>
						<span className="card-act">Đánh dấu đã đọc tất cả</span>
					</div>

					{notificationsData.map((item, index) => (
						<div className="notif-item" key={index}>
							<div className={`notif-ico ${item.iconClass}`}>{item.icon}</div>
							<div className="notif-main">
								<div className="notif-title">{item.title}</div>
								<div className="notif-body">{item.body}</div>
							</div>
							<div className="notif-meta">
								<div className="notif-time">{item.time}</div>
								<span className={`badge ${item.tagClass} notif-tag`}>{item.tag}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
