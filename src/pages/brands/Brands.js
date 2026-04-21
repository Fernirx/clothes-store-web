import React, { useEffect, useState, useCallback } from 'react';
import { refreshAuth } from '../../components/refresh/refresh';

const parseJsonSafe = async (response) => {
	try {
		return await response.json();
	} catch (_) {
		return null;
	}
};

export default function Brands() {
	const [brands, setBrands] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);

	const [formData, setFormData] = useState({
		name: '',
		slug: '',
		description: '',
		logoUrl: '',
		isActive: true
	});

	const apiUrl = process.env.REACT_APP_ROOT_API || 'https://clothes-api.fernirx.io.vn/api/clothes/';

	// =========================================================
	// HÀM CHUNG:
	// - tự gắn accessToken vào header
	// - nếu 401 thì refresh token đúng 1 lần
	// - refresh thành công => retry lại request cũ
	// - refresh thất bại => xóa token và chuyển về login
	// =========================================================
	const fetchWithAuthRetry = useCallback(async (url, options = {}, isRetry = false) => {
		const accessToken = localStorage.getItem('accessToken');

		const response = await fetch(url, {
			...options,
			headers: {
				Accept: 'application/json',
				...(options.headers || {}),
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// Nếu accessToken hết hạn và đây chưa phải lần retry
		if (response.status === 401 && !isRetry) {
			try {
				// refreshAuth phải tự lưu accessToken mới vào localStorage
				const refreshResult = await refreshAuth();

				// refresh thất bại -> đăng nhập lại
				if (!refreshResult) {
					localStorage.removeItem('accessToken');
					alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
					window.location.href = '/login';
					throw new Error('Refresh token thất bại');
				}

				// Refresh thành công -> gọi lại đúng request cũ, chỉ retry 1 lần
				return await fetchWithAuthRetry(url, options, true);
			} catch (error) {
				localStorage.removeItem('accessToken');
				alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
				window.location.href = '/login';
				throw error;
			}
		}

		return response;
	}, []);

	useEffect(() => {
		const controller = new AbortController();

		const fetchBrands = async () => {
			try {
				setIsLoading(true);

				const response = await fetchWithAuthRetry(`${apiUrl}/brands`, {
					signal: controller.signal,
					method: 'GET',
				});

				if (!response.ok) {
					throw new Error('HTTP error ' + response.status);
				}

				const result = await response.json();

				if (result.data && result.data.content) {
					setBrands(result.data.content);
				} else if (Array.isArray(result.data)) {
					setBrands(result.data);
				} else {
					setBrands([]);
				}
			} catch (error) {
				if (error.name === 'AbortError') return;
				console.error('Lỗi khi lấy dữ liệu thương hiệu:', error);
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		};

		fetchBrands();

		return () => {
			controller.abort();
		};
	}, [apiUrl, fetchWithAuthRetry]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const handleEditClick = (brand) => {
		setEditingId(brand.id);
		setFormData({
			name: brand.name || '',
			slug: brand.slug || '',
			description: brand.description || '',
			logoUrl: brand.logoUrl || '',
			isActive: brand.isActive !== undefined ? brand.isActive : true
		});
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setFormData({
			name: '',
			slug: '',
			description: '',
			logoUrl: '',
			isActive: true
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			alert('Vui lòng nhập tên thương hiệu!');
			return;
		}

		if (!formData.slug.trim()) {
			alert('Vui lòng nhập slug thương hiệu!');
			return;
		}

		const payload = {
			...formData,
			name: formData.name.trim(),
			slug: formData.slug.trim(),
			description: formData.description.trim(),
			logoUrl: formData.logoUrl.trim(),
		};

		if (editingId) {
			try {
				const response = await fetchWithAuthRetry(`${apiUrl}/admin/brands/${editingId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					const errorData = await parseJsonSafe(response);
					throw new Error(errorData?.message || ('Cập nhật thất bại, mã lỗi: ' + response.status));
				}

				const result = await response.json();
				const updatedBrand = result?.data || { ...payload, id: editingId };

				const updatedBrands = brands.map((brand) =>
					brand.id === editingId ? { ...brand, ...updatedBrand } : brand
				);
				setBrands(updatedBrands);

				alert(`Đã cập nhật thành công thương hiệu: ${payload.name}`);
				handleCancelEdit();
			} catch (error) {
				console.error('Lỗi khi cập nhật thương hiệu:', error);
				alert(error.message || 'Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại!');
			}
		} else {
			try {
				const response = await fetchWithAuthRetry(`${apiUrl}/admin/brands`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					const errorData = await parseJsonSafe(response);
					throw new Error(errorData?.message || ('Thêm thất bại, mã lỗi: ' + response.status));
				}

				const result = await response.json();
				const newBrand = result.data || { ...payload, id: Date.now() };

				setBrands([newBrand, ...brands]);
				setFormData({ name: '', slug: '', description: '', logoUrl: '', isActive: true });
				alert(`Đã thêm thành công thương hiệu: ${payload.name}`);
			} catch (error) {
				console.error('Lỗi khi thêm thương hiệu:', error);
				alert(error.message || 'Đã xảy ra lỗi khi thêm. Vui lòng thử lại!');
			}
		}
	};

	const handleDelete = async (brand) => {
		const { id, name } = brand;
		const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${name}" không?`);
		if (!isConfirm) return;

		try {
			const response = await fetchWithAuthRetry(`${apiUrl}/admin/brands/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const errorData = await parseJsonSafe(response);
				const apiMessage = errorData?.message || ('Xóa thất bại, mã lỗi: ' + response.status);
				alert(apiMessage);
				return;
			}

			const updatedBrands = brands.filter((brand) => brand.id !== id);
			setBrands(updatedBrands);

			if (editingId === id) {
				handleCancelEdit();
			}

			alert(`Đã xóa thành công thương hiệu ${name}`);
		} catch (error) {
			if (error?.name === 'AbortError') return;
			console.error('Lỗi khi xóa thương hiệu:', error);
			alert(error.message || 'Đã xảy ra lỗi khi xóa. Vui lòng thử lại!');
		}
	};

	const formatDate = (value) => {
		if (!value) return '—';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '—';
		return date.toLocaleString('vi-VN');
	};

	return (
		<div className="page-content">
			<div className="filters" style={{ marginBottom: '10px' }}>
				<select className="f-select" defaultValue="Trạng thái">
					<option value="Trạng thái">Trạng thái</option>
					<option value="Hoạt động">Hoạt động</option>
					<option value="Ngừng">Ngừng</option>
				</select>
				<input className="f-input" placeholder="Tìm tên, slug thương hiệu..." />
			</div>

			<form
				onSubmit={handleSubmit}
				className="card"
				style={{
					padding: '15px',
					marginBottom: '20px',
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					flexWrap: 'wrap',
					backgroundColor: editingId ? '#fff3cd' : '#f8f9fa',
					border: `1px dashed ${editingId ? '#ffc107' : '#ced4da'}`
				}}
			>
				{editingId && <strong style={{ color: '#856404', width: '100%' }}>Đang chỉnh sửa thương hiệu...</strong>}

				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					placeholder="Tên thương hiệu (*)"
					className="f-input"
					style={{ flex: '1 1 180px' }}
					required
				/>
				<input
					type="text"
					name="slug"
					value={formData.slug}
					onChange={handleInputChange}
					placeholder="Slug (*)"
					className="f-input"
					style={{ flex: '1 1 160px' }}
					required
				/>
				<input
					type="text"
					name="logoUrl"
					value={formData.logoUrl}
					onChange={handleInputChange}
					placeholder="Logo URL"
					className="f-input"
					style={{ flex: '1 1 220px' }}
				/>
				<input
					type="text"
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					placeholder="Mô tả"
					className="f-input"
					style={{ flex: '2 1 260px' }}
				/>

				<label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
					<input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
					Hoạt động
				</label>

				<div style={{ display: 'flex', gap: '5px' }}>
					<button
						type="submit"
						className="btn"
						style={{ backgroundColor: editingId ? '#28a745' : '#0d6efd', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
					>
						{editingId ? 'Lưu thay đổi' : '+ Thêm'}
					</button>
					{editingId && (
						<button
							type="button"
							onClick={handleCancelEdit}
							className="btn"
							style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
						>
							Hủy
						</button>
					)}
				</div>
			</form>

			<div className="card">
				<div className="tbl-wrap">
					<table>
						<thead>
							<tr>
								<th>Thương hiệu</th>
								<th>Slug</th>
								<th>Mô tả</th>
								<th>Logo</th>
								<th>Trạng thái</th>
								<th>Ngày tạo</th>
								<th>Cập nhật</th>
								<th>Hành động</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td>
								</tr>
							) : brands.length === 0 ? (
								<tr>
									<td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td>
								</tr>
							) : (
								brands.map((brand) => {
									const statusText = brand.isActive ? 'Hoạt động' : 'Ngừng';
									const statusClass = brand.isActive ? 'b-active' : 'b-inactive';

									return (
										<tr key={brand.id || brand.slug}>
											<td>
												<div className="td-b">{brand.name}</div>
												<div style={{ fontSize: '12px', color: 'var(--muted)' }}>
													ID: {brand.id || '—'}
												</div>
											</td>
											<td className="td-mono">{brand.slug || '—'}</td>
											<td style={{ maxWidth: '260px' }}>{brand.description || '—'}</td>
											<td>
												{brand.logoUrl ? (
													<a href={brand.logoUrl} target="_blank" rel="noreferrer">Xem logo</a>
												) : (
													'—'
												)}
											</td>
											<td><span className={`badge ${statusClass}`}>{statusText}</span></td>
											<td style={{ fontSize: '12px' }}>{formatDate(brand.createdAt)}</td>
											<td style={{ fontSize: '12px' }}>{formatDate(brand.updatedAt)}</td>
											<td>
												<div style={{ display: 'flex', gap: '8px' }}>
													<button
														className="btn btn-sm"
														onClick={() => handleEditClick(brand)}
													>
														Sửa
													</button>
													<button
														className="btn btn-sm"
														style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
														onClick={() => handleDelete(brand)}
													>
														Xóa
													</button>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}