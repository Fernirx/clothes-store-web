import React, { useEffect, useState, useCallback } from 'react';
import { refreshAuth } from '../../components/refresh/refresh';

const parseJsonSafe = async (response) => {
	try {
		return await response.json();
	} catch (_) {
		return null;
	}
};

export default function Categories() {
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		displayOrder: 0,
		parentId: 0,
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
	// HÀM CHUNG: Tự gắn accessToken vào header, refresh token nếu 401
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

		if (response.status === 401 && !isRetry) {
			try {
				const refreshResult = await refreshAuth();

				if (!refreshResult) {
					localStorage.removeItem('accessToken');
					alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
					window.location.href = '/login';
					throw new Error('Refresh token thất bại');
				}

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

	const fetchCategories = useCallback(async (signal) => {
		try {
			setIsLoading(true);

			const params = new URLSearchParams({
				page: String(page),
				size: String(size),
				sortBy: String(sortBy),
				sortDir: String(sortDir)
			});

			if (searchTerm.trim()) {
				params.set('search', searchTerm.trim());
			}

			if (statusFilter !== '') {
				params.set('isActive', statusFilter === 'true' ? 'true' : 'false');
			}

			const response = await fetchWithAuthRetry(`${apiUrl}/admin/categories?${params.toString()}`, {
				signal,
				method: 'GET',
			});

			if (!response.ok) {
				const errorData = await parseJsonSafe(response);
				throw new Error(errorData?.message || ('HTTP error ' + response.status));
			}

			const result = await response.json();
			if (result?.data?.content) {
				setCategories(result.data.content);
				setTotalPages(result.data.totalPages || 0);
				setTotalElements(result.data.totalElements || 0);
			} else if (Array.isArray(result?.data)) {
				setCategories(result.data);
				setTotalPages(1);
				setTotalElements(result.data.length);
			} else {
				setCategories([]);
				setTotalPages(0);
				setTotalElements(0);
			}
		} catch (error) {
			if (error?.name === 'AbortError') return;
			console.error('Lỗi khi lấy dữ liệu danh mục:', error);
			setCategories([]);
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
		fetchCategories(controller.signal);
		return () => {
			controller.abort();
		};
	}, [fetchCategories]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		const nextValue = type === 'checkbox'
			? checked
			: (name === 'displayOrder' || name === 'parentId'
				? Math.max(0, Number(value) || 0)
				: value);
		setFormData((prev) => ({
			...prev,
			[name]: nextValue,
		}));
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

	const handleEditClick = (category) => {
		setEditingId(category.id);
		setFormData({
			name: category.name || '',
			description: category.description || '',
			displayOrder: category.displayOrder || 0,
			parentId: category.parentId || 0,
			isActive: category.isActive !== undefined ? category.isActive : true
		});
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setFormData({
			name: '',
			description: '',
			displayOrder: 0,
			parentId: 0,
			isActive: true
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const normalizedName = String(formData.name || '').trim();
		const normalizedDescription = String(formData.description || '').trim();

		if (!normalizedName) {
			alert('Vui lòng nhập tên danh mục!');
			return;
		}

		if (formData.displayOrder < 0) {
			alert('Thứ tự hiển thị không được nhỏ hơn 0!');
			return;
		}

		if (formData.parentId < 0) {
			alert('ID danh mục cha không được nhỏ hơn 0!');
			return;
		}

		const payload = {
			name: normalizedName,
			description: normalizedDescription,
			displayOrder: formData.displayOrder,
			parentId: formData.parentId,
			isActive: formData.isActive
		};

		if (editingId) {
			try {
				const response = await fetchWithAuthRetry(`${apiUrl}/admin/categories/${editingId}`, {
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
				const updatedCategory = result?.data || { ...payload, id: editingId };
				setCategories((prev) => prev.map((cat) =>
					cat.id === editingId ? { ...cat, ...updatedCategory } : cat
				));

				alert(`Đã cập nhật thành công danh mục: ${payload.name}`);
				handleCancelEdit();
				fetchCategories();
			} catch (error) {
				console.error('Lỗi khi cập nhật danh mục:', error);
				alert(error.message || 'Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại!');
			}
		} else {
			try {
				const response = await fetchWithAuthRetry(`${apiUrl}/admin/categories`, {
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
				const newCategory = result.data || { ...payload, id: Date.now() };
				setCategories((prev) => [newCategory, ...prev]);
				setFormData({ name: '', description: '', displayOrder: 0, parentId: 0, isActive: true });
				alert(`Đã thêm thành công danh mục: ${payload.name}`);
				fetchCategories();
			} catch (error) {
				console.error('Lỗi khi thêm danh mục:', error);
				alert(error.message || 'Đã xảy ra lỗi khi thêm. Vui lòng thử lại!');
			}
		}
	};

	const handleDelete = async (category) => {
		const { id, name } = category;
		const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`);
		if (!isConfirm) return;

		try {
			const response = await fetchWithAuthRetry(`${apiUrl}/admin/categories/${id}`, {
				method: 'DELETE',
				headers: { Accept: 'application/json' }
			});

			if (!response.ok) {
				const errorData = await parseJsonSafe(response);
				const apiMessage = errorData?.message || ('Xóa thất bại, mã lỗi: ' + response.status);
				alert(apiMessage);
				return;
			}

			setCategories((prev) => prev.filter((cat) => cat.id !== id));

			if (editingId === id) {
				handleCancelEdit();
			}

			alert(`Đã xóa thành công danh mục ${name}`);
			fetchCategories();
		} catch (error) {
			if (error?.name === 'AbortError') return;
			console.error('Lỗi khi xóa danh mục:', error);
			alert(error.message || 'Đã xảy ra lỗi khi xóa. Vui lòng thử lại!');
		}
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
					placeholder="Tìm tên danh mục..."
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
				{editingId && <strong style={{ color: '#856404', width: '100%' }}>Đang chỉnh sửa danh mục...</strong>}

				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					placeholder="Tên danh mục (*)"
					className="f-input"
					style={{ flex: '1 1 180px' }}
					required
				/>
				<input
					type="text"
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					placeholder="Mô tả"
					className="f-input"
					style={{ flex: '1 1 200px' }}
				/>
				<div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '0 1 170px' }}>
					<span style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>Thứ tự</span>
					<input
						type="number"
						name="displayOrder"
						value={formData.displayOrder}
						onChange={handleInputChange}
						placeholder="0"
						className="f-input"
						min={0}
						style={{ width: '84px' }}
					/>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '0 1 220px' }}>
					<span style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>Danh mục cha</span>
					<input
						type="number"
						name="parentId"
						value={formData.parentId}
						onChange={handleInputChange}
						placeholder="0"
						className="f-input"
						min={0}
						style={{ width: '110px' }}
					/>
				</div>

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
									Danh mục {sortBy === 'name' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
								</th>
								<th>Mô tả</th>
								<th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('displayOrder')}>
									Thứ tự {sortBy === 'displayOrder' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
								</th>
								<th>Danh mục cha</th>
								<th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('isActive')}>
									Trạng thái {sortBy === 'isActive' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
								</th>
								<th>Hành động</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td>
								</tr>
							) : categories.length === 0 ? (
								<tr>
									<td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td>
								</tr>
							) : (
								categories.map((category) => {
									const statusText = category.isActive ? 'Hoạt động' : 'Ngừng';
									const statusClass = category.isActive ? 'b-active' : 'b-inactive';

									return (
										<tr key={category.id || category.name}>
											<td>
												<div className="td-b">{category.name}</div>
												<div style={{ fontSize: '12px', color: 'var(--muted)' }}>
													ID: {category.id || '—'}
												</div>
											</td>
											<td style={{ maxWidth: '260px' }}>{category.description || '—'}</td>
											<td style={{ textAlign: 'center' }}>{category.displayOrder || 0}</td>
											<td style={{ textAlign: 'center' }}>{category.parentId || '—'}</td>
											<td><span className={`badge ${statusClass}`}>{statusText}</span></td>
											<td>
												<div style={{ display: 'flex', gap: '8px' }}>
													<button
														className="btn btn-sm"
														onClick={() => handleEditClick(category)}
													>
														Sửa
													</button>
													<button
														className="btn btn-sm"
														style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
														onClick={() => handleDelete(category)}
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
						Hiển thị {categories.length > 0 ? (page * size + 1) : 0} - {Math.min((page + 1) * size, totalElements)} trong {totalElements} danh mục
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
