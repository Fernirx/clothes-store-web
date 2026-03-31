import React, { useState, useEffect } from 'react';

export default function Suppliers() {
	const [suppliers, setSuppliers] = useState([]);

	useEffect(() => {
		const fetchSuppliers = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_ROOT_API}/api/v1/suppliers`);
				if (!response.ok) {
					throw new Error("HTTP error " + response.status);
				}
				const result = await response.json();
				console.log(result);

				if (result.data && result.data.content) {
					setSuppliers(result.data.content);
				} else if (Array.isArray(result.data)) {
					setSuppliers(result.data);
				}

			} catch (error) {
				console.error("Lỗi khi lấy dữ liệu nhà cung cấp:", error);
			}
		};
		fetchSuppliers();
	}, []);

	const handleDelete = async (id, name) => {
		const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${name}" không?`);

		if (!isConfirm) return;

		try {
			const response = await fetch(`https://clothes-api.fernirx.io.vn/api/clothes/api/v1/suppliers/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error("Xóa thất bại, mã lỗi: " + response.status);
			}
			const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
			setSuppliers(updatedSuppliers);

			alert(`Đã xóa thành công nhà cung cấp ${name}`);

		} catch (error) {
			console.error("Lỗi khi xóa nhà cung cấp:", error);
			alert("Đã xảy ra lỗi khi xóa. Vui lòng thử lại!");
		}
	};

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
								<th>Hành động</th>
							</tr>
						</thead>
						<tbody>
							{suppliers.map((supplier) => {
								const statusText = supplier.isActive ? "Hoạt động" : "Ngừng";
								const statusClass = supplier.isActive ? "b-active" : "b-inactive";

								return (
									<tr key={supplier.id}>
										<td>
											<div className="td-b">{supplier.name}</div>
											<div className="supplier-contact">Người LH: {supplier.contactPerson || 'Chưa cập nhật'}</div>
										</td>
										<td className="td-mono">{supplier.code}</td>
										<td className="supplier-phone">{supplier.phone || '—'}</td>
										<td className="supplier-email">{supplier.email || '—'}</td>
										<td className="td-b">0</td>
										<td className="td-b">0đ</td>
										<td><span className={`badge ${statusClass}`}>{statusText}</span></td>
										<td>
											<div style={{ display: 'flex', gap: '8px' }}>
												<button className="btn btn-sm">Chi tiết</button>
												<button
													className="btn btn-sm"
													style={{ backgroundColor: '#dc3545', color: 'white' }}
													onClick={() => handleDelete(supplier.id, supplier.name)}
												>
													Xóa
												</button>
											</div>
										</td>
									</tr>
								);
							})}
							{suppliers.length === 0 && (
								<tr>
									<td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}