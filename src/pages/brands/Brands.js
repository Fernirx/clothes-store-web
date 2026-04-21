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
	const [isUploadingLogo, setIsUploadingLogo] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		slug: '',
		description: '',
		logoUrl: '',
		logoPublicId: '',
		isActive: true
	});

	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [sortBy, setSortBy] = useState('id');
	const [sortDir, setSortDir] = useState('asc');

	const apiUrl = process.env.REACT_APP_ROOT_API || 'https://clothes-api.fernirx.io.vn/api/clothes';

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
				...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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

	const fetchBrands = useCallback(async (signal) => {
		try {
			setIsLoading(true);

			const params = new URLSearchParams({
				page: String(page),
				size: String(size),
				sort: `${sortBy},${sortDir}`
			});

			if (searchTerm.trim()) {
				params.set('search', searchTerm.trim());
			}

			if (statusFilter !== '') {
				params.set('isActive', statusFilter === 'true' ? 'true' : 'false');
			}

			const response = await fetchWithAuthRetry(`${apiUrl}/admin/brands?${params.toString()}`, {
				signal,
				method: 'GET',
			});

			if (!response.ok) {
				const errorData = await parseJsonSafe(response);
				throw new Error(errorData?.message || ('HTTP error ' + response.status));
			}

			const result = await response.json();
			if (result?.data?.content) {
				setBrands(result.data.content);
				setTotalPages(result.data.totalPages || 0);
				setTotalElements(result.data.totalElements || 0);
			} else if (Array.isArray(result?.data)) {
				setBrands(result.data);
				setTotalPages(1);
				setTotalElements(result.data.length);
			} else {
				setBrands([]);
				setTotalPages(0);
				setTotalElements(0);
			}
		} catch (error) {
			if (error?.name === 'AbortError') return;
			console.error('Lỗi khi lấy dữ liệu thương hiệu:', error);
			setBrands([]);
			setTotalPages(0);
			setTotalElements(0);
		} finally {
			if (!signal || !signal.aborted) {
				setIsLoading(false);
			}
		}
	}, [apiUrl, fetchWithAuthRetry, page, searchTerm, size, sortBy, sortDir, statusFilter]);

	useEffect(() => {
		const controller = new AbortController();
		fetchBrands(controller.signal);
		return () => {
			controller.abort();
		};
	}, [fetchBrands]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		const nextValue = type === 'checkbox' ? checked : value;
		setFormData((prev) => ({
			...prev,
			[name]: nextValue,
			...(name === 'logoUrl' ? { logoPublicId: '' } : {})
		}));
	};

	const handleLogoFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploadingLogo(true);
		try {
			const form = new FormData();
			form.append('file', file);

			const response = await fetchWithAuthRetry(`${apiUrl}/media/image?context=BRAND`, {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: form
			});

			if (!response.ok) {
				const errorData = await parseJsonSafe(response);
				throw new Error(errorData?.message || ('Upload ảnh thất bại, mã lỗi: ' + response.status));
			}

			const result = await response.json();
			const imageUrl = result?.data?.imageUrl || '';
			const publicId = result?.data?.publicId || '';

			if (!imageUrl) {
				throw new Error('Media API chưa trả về imageUrl.');
			}

			setFormData((prev) => ({
				...prev,
				logoUrl: imageUrl,
				logoPublicId: publicId
			}));

			alert('Upload logo thành công!');
		} catch (error) {
			console.error('Lỗi khi upload logo:', error);
			alert(error.message || 'Đã xảy ra lỗi khi upload logo. Vui lòng thử lại!');
		} finally {
			setIsUploadingLogo(false);
			e.target.value = '';
		}
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setPage(0);
	};

	const handleStatusFilterChange = (e) => {
		setStatusFilter(e.target.value);
		setPage(0);
	};

	const handleSortChange = (field) => {
		if (sortBy === field) {
			setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(field);
			setSortDir('asc');
		}
		setPage(0);
	};

	const handleEditClick = (brand) => {
		setEditingId(brand.id);
		setFormData({
			name: brand.name || '',
			slug: brand.slug || '',
			description: brand.description || '',
			logoUrl: brand.logoUrl || '',
			logoPublicId: brand.logoPublicId || '',
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
			logoPublicId: '',
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
			logoPublicId: formData.logoPublicId.trim(),
		};

		if (editingId) {
			try {
				const response = await fetchWithAuthRetry(`${apiUrl}/admin/brands/${editingId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					const errorData = await parseJsonSafe(response);
					throw new Error(errorData?.message || ('Cập nhật thất bại, mã lỗi: ' + response.status));
				}

				const result = await response.json();
				const updatedBrand = result?.data || { ...payload, id: editingId };
				setBrands((prev) => prev.map((brand) =>
					brand.id === editingId ? { ...brand, ...updatedBrand } : brand
				));

				alert(`Đã cập nhật thành công thương hiệu: ${payload.name}`);
				handleCancelEdit();
				fetchBrands();
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
						Accept: 'application/json'
					},
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					const errorData = await parseJsonSafe(response);
					throw new Error(errorData?.message || ('Thêm thất bại, mã lỗi: ' + response.status));
				}

				const result = await response.json();
				const newBrand = result.data || { ...payload, id: Date.now() };
				setBrands((prev) => [newBrand, ...prev]);
				setFormData({ name: '', slug: '', description: '', logoUrl: '', logoPublicId: '', isActive: true });
				alert(`Đã thêm thành công thương hiệu: ${payload.name}`);
				fetchBrands();
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
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) {
				const errorData = await parseJsonSafe(response);
				const apiMessage = errorData?.message || ('Xóa thất bại, mã lỗi: ' + response.status);
				alert(apiMessage);
				return;
			}

			setBrands((prev) => prev.filter((brand) => brand.id !== id));

			if (editingId === id) {
				handleCancelEdit();
			}

			alert(`Đã xóa thành công thương hiệu ${name}`);
			fetchBrands();
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
				<select
					className="f-select"
					value={statusFilter}
					onChange={handleStatusFilterChange}
				>
					<option value="">Tất cả trạng thái</option>
					<option value="true">Hoạt động</option>
					<option value="false">Ngừng</option>
				</select>
				<input
					className="f-input"
					placeholder="Tìm tên, slug thương hiệu..."
					value={searchTerm}
					onChange={handleSearchChange}
				/>
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
				<label
					style={{
						flex: '1 1 200px',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						fontSize: '13px',
						whiteSpace: 'nowrap'
					}}
				>
					<input
						type="file"
						accept="image/*"
						onChange={handleLogoFileUpload}
						disabled={isUploadingLogo}
					/>
					<span style={{ color: 'var(--muted)' }}>
						{isUploadingLogo ? 'Đang upload...' : 'Upload logo'}
					</span>
				</label>
				<input
					type="text"
					name="logoPublicId"
					value={formData.logoPublicId}
					onChange={handleInputChange}
					placeholder="Logo Public ID"
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
								<th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('name')}>
									Thương hiệu {sortBy === 'name' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
								</th>
								<th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('slug')}>
									Slug {sortBy === 'slug' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
								</th>
								<th>Mô tả</th>
								<th>Logo</th>
								<th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('isActive')}>
									Trạng thái {sortBy === 'isActive' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
								</th>
								<th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('createdAt')}>
									Ngày tạo {sortBy === 'createdAt' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
								</th>
								<th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('updatedAt')}>
									Cập nhật {sortBy === 'updatedAt' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
								</th>
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

				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '10px 0', borderTop: '1px solid #e0e0e0' }}>
					<div style={{ fontSize: '13px', color: 'var(--muted)' }}>
						Hiển thị {brands.length > 0 ? (page * size + 1) : 0} - {Math.min((page + 1) * size, totalElements)} trong {totalElements} thương hiệu
					</div>

					<div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
						<button
							onClick={() => setPage(Math.max(0, page - 1))}
							disabled={page === 0}
							style={{
								padding: '6px 12px',
								fontSize: '13px',
								backgroundColor: page === 0 ? '#e0e0e0' : '#0d6efd',
								color: page === 0 ? '#999' : 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: page === 0 ? 'not-allowed' : 'pointer'
							}}
						>
							← Trước
						</button>

						<span style={{ padding: '0 8px', fontSize: '13px', minWidth: '50px', textAlign: 'center' }}>
							{totalPages > 0 ? `${page + 1} / ${totalPages}` : '—'}
						</span>

						<button
							onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
							disabled={page >= totalPages - 1 || totalPages === 0}
							style={{
								padding: '6px 12px',
								fontSize: '13px',
								backgroundColor: page >= totalPages - 1 || totalPages === 0 ? '#e0e0e0' : '#0d6efd',
								color: page >= totalPages - 1 || totalPages === 0 ? '#999' : 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: page >= totalPages - 1 || totalPages === 0 ? 'not-allowed' : 'pointer'
							}}
						>
							Sau →
						</button>

						<select
							value={size}
							onChange={(e) => {
								setSize(Number(e.target.value));
								setPage(0);
							}}
							style={{
								padding: '6px 8px',
								fontSize: '13px',
								border: '1px solid #ced4da',
								borderRadius: '4px',
								marginLeft: '10px'
							}}
						>
							<option value="5">5 / trang</option>
							<option value="10">10 / trang</option>
							<option value="20">20 / trang</option>
							<option value="50">50 / trang</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}