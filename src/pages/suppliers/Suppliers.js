import React, { useState, useEffect, useCallback } from 'react';
import { refreshAuth } from '../../components/refresh/refresh';

const parseJsonSafe = async (response) => {
    try {
        return await response.json();
    } catch (_) {
        return null;
    }
};

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('asc');

    // State theo dõi xem đang sửa nhà cung cấp nào (null = đang ở chế độ Thêm mới)
    const [editingId, setEditingId] = useState(null);

    // STATE CHO FORM THÊM MỚI/CẬP NHẬT (INLINE FORM)
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        email: '',
        phone: '',
        address: '',
        isActive: true
    });

    const apiUrl = process.env.REACT_APP_ROOT_API || 'https://clothes-api.fernirx.io.vn/api/clothes';

    const fetchWithAuthRetry = useCallback(async (url, options = {}, isRetry = false) => {
        const accessToken = localStorage.getItem('accessToken');

        const response = await fetch(url, {
            ...options,
            headers: {
                Accept: 'application/json',
                ...(options.headers || {}),
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            }
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

    const fetchSuppliers = useCallback(async () => {
        try {
            setIsLoading(true);

            const params = new URLSearchParams({
                page: String(page),
                size: String(size),
                sortBy,
                sortDir
            });

            const response = await fetchWithAuthRetry(`${apiUrl}/admin/suppliers?${params.toString()}`, {
                method: 'GET'
            });

            if (!response.ok) {
                const errorData = await parseJsonSafe(response);
                throw new Error(errorData?.message || ('HTTP error ' + response.status));
            }

            const result = await response.json();
            if (result?.data?.content) {
                setSuppliers(result.data.content);
                setTotalPages(result.data.totalPages || 0);
                setTotalElements(result.data.totalElements || 0);
            } else if (Array.isArray(result?.data)) {
                setSuppliers(result.data);
                setTotalPages(1);
                setTotalElements(result.data.length);
            } else {
                setSuppliers([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu nhà cung cấp:', error);
            setSuppliers([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, fetchWithAuthRetry, page, size, sortBy, sortDir]);

    // 1. GET: LẤY DANH SÁCH
    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    // XỬ LÝ KHI GÕ VÀO FORM
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 2. XỬ LÝ KHI BẤM NÚT SỬA TRÊN BẢNG
    const handleEditClick = (supplier) => {
        setEditingId(supplier.id); // Đánh dấu đang sửa
        // Đổ dữ liệu lên form
        setFormData({
            name: supplier.name || '',
            code: supplier.code || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
            address: supplier.address || '',
            isActive: supplier.isActive !== undefined ? supplier.isActive : true
        });
        // Cuộn lên đầu trang (nếu danh sách dài)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', code: '', email: '', phone: '', address: '', isActive: true });
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

    // 4. SUBMIT FORM: XỬ LÝ CẢ THÊM MỚI (POST) VÀ CẬP NHẬT (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Vui lòng nhập Tên nhà cung cấp!");
            return;
        }
        if (editingId) {
            try {
                const payload = {
                    ...formData,
                    name: formData.name.trim(),
                    code: formData.code.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim()
                };

                const response = await fetchWithAuthRetry(`${apiUrl}/admin/suppliers/${editingId}`, {
                    method: 'PUT',
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
                const updatedSupplier = result?.data || { ...payload, id: editingId };

                setSuppliers(prev => prev.map(supplier =>
                    supplier.id === editingId ? { ...supplier, ...updatedSupplier } : supplier
                ));

                alert(`Đã cập nhật thành công nhà cung cấp: ${formData.name}`);
                handleCancelEdit(); // Reset form về chế độ thêm mới
                fetchSuppliers();

            } catch (error) {
                console.error("Lỗi khi cập nhật nhà cung cấp:", error);
                alert(error.message || 'Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại!');
            }

        } else {
            try {
                const payload = {
                    ...formData,
                    name: formData.name.trim(),
                    code: formData.code.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim()
                };

                const response = await fetchWithAuthRetry(`${apiUrl}/admin/suppliers`, {
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
                const newSupplier = result.data || { ...payload, id: Date.now() };

                setSuppliers(prev => [newSupplier, ...prev]);
                setFormData({ name: '', code: '', email: '', phone: '', address: '', isActive: true });
                alert(`Đã thêm thành công nhà cung cấp: ${payload.name}`);
                fetchSuppliers();

            } catch (error) {
                console.error("Lỗi khi thêm nhà cung cấp:", error);
                alert(error.message || 'Đã xảy ra lỗi khi thêm. Vui lòng thử lại!');
            }
        }
    };

    // 5. DELETE: XÓA NHÀ CUNG CẤP
    const handleDelete = async (id, name) => {
        const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${name}" không?`);
        if (!isConfirm) return;

        try {
            const response = await fetchWithAuthRetry(`${apiUrl}/admin/suppliers/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await parseJsonSafe(response);
                throw new Error(errorData?.message || ('Xóa thất bại, mã lỗi: ' + response.status));
            }

            setSuppliers(prev => prev.filter(supplier => supplier.id !== id));

            // Nếu đang sửa chính thằng vừa bị xóa thì reset form
            if (editingId === id) {
                handleCancelEdit();
            }

            alert(`Đã xóa thành công nhà cung cấp ${name}`);
            fetchSuppliers();
        } catch (error) {
            console.error("Lỗi khi xóa nhà cung cấp:", error);
            alert(error.message || 'Đã xảy ra lỗi khi xóa. Vui lòng thử lại!');
        }
    };

    return (
        <div className="page-content">
            <div className="filters" style={{ marginBottom: '10px' }}>
                <select className="f-select" defaultValue="Trạng thái">
                    <option value="Trạng thái">Trạng thái</option>
                    <option value="Đang hợp tác">Đang hợp tác</option>
                    <option value="Ngừng">Ngừng</option>
                </select>
                <input className="f-input" placeholder="Tìm tên, mã nhà cung cấp..." />
            </div>

            {/* ====== FORM THÊM MỚI / CẬP NHẬT INLINE ====== */}
            <form onSubmit={handleSubmit} className="card" style={{ padding: '15px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: editingId ? '#fff3cd' : '#f8f9fa', border: `1px dashed ${editingId ? '#ffc107' : '#ced4da'}` }}>
                {editingId && <strong style={{ color: '#856404', width: '100%' }}>Đang chỉnh sửa nhà cung cấp...</strong>}

                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Tên NCC (*)" className="f-input" style={{ flex: '1 1 150px' }} required />
                <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="Mã NCC" className="f-input" style={{ flex: '1 1 100px' }} />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="f-input" style={{ flex: '1 1 150px' }} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Số điện thoại" className="f-input" style={{ flex: '1 1 120px' }} />
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Địa chỉ" className="f-input" style={{ flex: '1 1 150px' }} />

                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                    Hoạt động
                </label>

                <div style={{ display: 'flex', gap: '5px' }}>
                    <button type="submit" className="btn" style={{ backgroundColor: editingId ? '#28a745' : '#0d6efd', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {editingId ? "Lưu thay đổi" : "+ Thêm"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="btn" style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Hủy
                        </button>
                    )}
                </div>
            </form>
            {/* ====================================================== */}

            <div className="card">
                <div className="tbl-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('name')}>
                                    Nhà cung cấp {sortBy === 'name' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
                                </th>
                                <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('code')}>
                                    Mã {sortBy === 'code' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
                                </th>
                                <th>Liên hệ</th>
                                <th>Email</th>
                                <th>Đơn nhập</th>
                                <th>Tổng chi</th>
                                <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSortChange('isActive')}>
                                    Trạng thái {sortBy === 'isActive' && <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>}
                                </th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td>
                                </tr>
                            ) : (
                                suppliers.map((supplier) => {
                                    const statusText = supplier.isActive ? "Hoạt động" : "Ngừng";
                                    const statusClass = supplier.isActive ? "b-active" : "b-inactive";

                                    return (
                                        <tr key={supplier.id || supplier.code}>
                                            <td>
                                                <div className="td-b">{supplier.name}</div>
                                                <div className="supplier-contact" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                                                    Địa chỉ: {supplier.address || 'Chưa cập nhật'}
                                                </div>
                                            </td>
                                            <td className="td-mono">{supplier.code}</td>
                                            <td className="supplier-phone">{supplier.phone || '—'}</td>
                                            <td className="supplier-email">{supplier.email || '—'}</td>
                                            <td className="td-b">0</td>
                                            <td className="td-b">0đ</td>
                                            <td><span className={`badge ${statusClass}`}>{statusText}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        className="btn btn-sm"
                                                        onClick={() => handleEditClick(supplier)} // Gọi hàm sửa
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                                                        onClick={() => handleDelete(supplier.id, supplier.name)}
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
                        Hiển thị {suppliers.length > 0 ? (page * size + 1) : 0} - {Math.min((page + 1) * size, totalElements)} trong {totalElements} nhà cung cấp
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