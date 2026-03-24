import React from 'react';

const suppliersData = [
	{
		name: 'Công ty Dệt may A',
		contactPerson: 'Nguyễn Thành',
		code: 'SUP-001',
		phone: '0901 111 222',
		email: 'congtyA@email.com',
		purchaseOrders: '18',
		totalSpend: '142.5M',
		status: 'Hoạt động',
		statusClass: 'b-active',
	},
	{
		name: 'Xưởng may B',
		contactPerson: 'Trần Hoa',
		code: 'SUP-002',
		phone: '0912 222 333',
		email: 'xuongb@email.com',
		purchaseOrders: '9',
		totalSpend: '67.2M',
		status: 'Hoạt động',
		statusClass: 'b-active',
	},
	{
		name: 'NCC Thời trang C',
		contactPerson: 'Lê Minh',
		code: 'SUP-003',
		phone: '0923 333 444',
		email: 'nccC@email.com',
		purchaseOrders: '5',
		totalSpend: '28.9M',
		status: 'Hoạt động',
		statusClass: 'b-active',
	},
	{
		name: 'Kho vải D',
		contactPerson: 'Phạm An',
		code: 'SUP-004',
		phone: '0934 444 555',
		email: 'khovaiD@email.com',
		purchaseOrders: '2',
		totalSpend: '8.1M',
		status: 'Ngừng',
		statusClass: 'b-inactive',
	},
];

export default function Suppliers() {
	return (
		<div className="page-content">
			<div className="filters">
				<select className="f-select" defaultValue="Trạng thái">
					<option value="Trạng thái">Trạng thái</option>
					<option value="Đang hợp tác">Đang hợp tác</option>
					<option value="Ngừng">Ngừng</option>
				</select>
				<input className="f-input" placeholder="Tìm tên, mã nhà cung cấp..." />
			</div>

			<div className="card">
				<div className="tbl-wrap">
					<table>
						<thead>
							<tr>
								<th>Nhà cung cấp</th>
								<th>Mã</th>
								<th>Liên hệ</th>
								<th>Email</th>
								<th>Đơn nhập</th>
								<th>Tổng chi</th>
								<th>Trạng thái</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{suppliersData.map((supplier) => (
								<tr key={supplier.code}>
									<td>
										<div className="td-b">{supplier.name}</div>
										<div className="supplier-contact">Người LH: {supplier.contactPerson}</div>
									</td>
									<td className="td-mono">{supplier.code}</td>
									<td className="supplier-phone">{supplier.phone}</td>
									<td className="supplier-email">{supplier.email}</td>
									<td className="td-b">{supplier.purchaseOrders}</td>
									<td className="td-b">{supplier.totalSpend}</td>
									<td>
										<span className={`badge ${supplier.statusClass}`}>{supplier.status}</span>
									</td>
									<td>
										<button className="btn btn-sm">Chi tiết</button>
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
