import React from 'react';

const usersData = [
	{
		name: 'Nguyễn Văn A',
		initials: 'NA',
		avatarClass: 'av-blue',
		email: 'nguyenvana@gmail.com',
		role: 'USER',
		roleClass: 'b-user',
		loginBy: 'Google',
		orders: '12',
		spent: '4.2M',
		joined: '01/01/2026',
		status: 'Hoạt động',
		statusClass: 'b-active',
	},
	{
		name: 'Trần Thị B',
		initials: 'TB',
		avatarClass: 'av-purple',
		email: 'tranthib@email.com',
		role: 'USER',
		roleClass: 'b-user',
		loginBy: 'Email',
		orders: '5',
		spent: '1.8M',
		joined: '15/01/2026',
		status: 'Hoạt động',
		statusClass: 'b-active',
	},
	{
		name: 'Admin Hệ thống',
		initials: 'AD',
		avatarClass: 'av-orange',
		email: 'admin@styleshop.vn',
		role: 'ADMIN',
		roleClass: 'b-admin',
		loginBy: 'Email',
		orders: '—',
		spent: '—',
		joined: '01/01/2025',
		status: 'Hoạt động',
		statusClass: 'b-active',
	},
	{
		name: 'Hoàng Văn D',
		initials: 'HV',
		avatarClass: 'av-red',
		email: 'hoangvand@gmail.com',
		role: 'USER',
		roleClass: 'b-user',
		loginBy: 'Google',
		orders: '1',
		spent: '420k',
		joined: '10/03/2026',
		status: 'Bị khóa',
		statusClass: 'b-inactive',
	},
];

export default function Users() {
	return (
		<div className="page-content">
			<div className="filters">
				<select className="f-select" defaultValue="Vai trò">
					<option value="Vai trò">Vai trò</option>
					<option value="USER">USER</option>
					<option value="ADMIN">ADMIN</option>
				</select>

				<select className="f-select" defaultValue="Trạng thái">
					<option value="Trạng thái">Trạng thái</option>
					<option value="Hoạt động">Hoạt động</option>
					<option value="Bị khóa">Bị khóa</option>
				</select>

				<select className="f-select" defaultValue="Đăng nhập qua">
					<option value="Đăng nhập qua">Đăng nhập qua</option>
					<option value="Email">Email</option>
					<option value="Google">Google</option>
				</select>

				<input className="f-input" placeholder="Tìm email, tên người dùng..." />
			</div>

			<div className="card">
				<div className="tbl-wrap">
					<table>
						<thead>
							<tr>
								<th>Người dùng</th>
								<th>Email</th>
								<th>Vai trò</th>
								<th>Đăng nhập qua</th>
								<th>Đơn hàng</th>
								<th>Đã chi</th>
								<th>Đăng ký</th>
								<th>Trạng thái</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{usersData.map((user) => (
								<tr key={user.email}>
									<td>
										<div className="user-main">
											<div className={`av ${user.avatarClass}`}>{user.initials}</div>
											<div className="user-name">{user.name}</div>
										</div>
									</td>
									<td className="user-email">{user.email}</td>
									<td>
										<span className={`badge ${user.roleClass}`}>{user.role}</span>
									</td>
									<td className="login-method">{user.loginBy}</td>
									<td className="td-b num-center">{user.orders}</td>
									<td className="td-b">{user.spent}</td>
									<td className="user-date">{user.joined}</td>
									<td>
										<span className={`badge ${user.statusClass}`}>{user.status}</span>
									</td>
									<td>
										<button className="btn btn-sm">Xem</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
