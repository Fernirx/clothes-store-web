import React, { useState, useEffect } from 'react';
import { refreshAuth } from '../../components/refresh/refresh';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    // 1. GET: LẤY DANH SÁCH
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
                const response = await fetch(`${apiUrl}/admin/suppliers`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                // --- ĐOẠN SỬA QUAN TRỌNG NHẤT goi refresh neu 401 ---
                if (!response.ok) {
                    if (response.status === 401) {
                        await refreshAuth(); // Hàm này phải return true/false
                        return fetchSuppliers(); // Gọi lại chính nó để lấy data sau khi refresh
                    }
                    throw new Error(`Lỗi server: ${response.status}`);
                }
                const result = await response.json();

                if (result.data && result.data.content) {
                    setSuppliers(result.data.content);
                } else if (Array.isArray(result.data)) {
                    setSuppliers(result.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu nhà cung cấp:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSuppliers();
    }, [apiUrl]);

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

    // 4. SUBMIT FORM: XỬ LÝ CẢ THÊM MỚI (POST) VÀ CẬP NHẬT (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Vui lòng nhập Tên nhà cung cấp!");
            return;
        }
        if (editingId) {
            try {

                const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
                const response = await fetch(`${apiUrl}/admin/suppliers/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(formData)
                });
                // --- ĐOẠN SỬA QUAN TRỌNG NHẤT goi refresh neu 401 ---
                if (!response.ok) {
                    if (response.status === 401) {
                        await refreshAuth(); // Hàm này phải return true/false
                    }
                    throw new Error(`Lỗi server: ${response.status}`);
                }
                // -------------------------------

                const updatedSuppliers = suppliers.map(supplier =>
                    supplier.id === editingId ? { ...supplier, ...formData } : supplier
                );
                setSuppliers(updatedSuppliers);

                alert(`Đã cập nhật thành công nhà cung cấp: ${formData.name}`);
                handleCancelEdit(); // Reset form về chế độ thêm mới

            } catch (error) {
                console.error("Lỗi khi cập nhật nhà cung cấp:", error);
                alert("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại!");
            }

        } else {
            try {
                const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
                const response = await fetch(`${apiUrl}/api/v1/suppliers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error("Thêm thất bại, mã lỗi: " + response.status);

                const result = await response.json();
                const newSupplier = result.data || { ...formData, id: Date.now() }; // Fallback id nếu API không trả về

                setSuppliers([newSupplier, ...suppliers]);
                setFormData({ name: '', code: '', email: '', phone: '', address: '', isActive: true });
                alert(`Đã thêm thành công nhà cung cấp: ${formData.name}`);

            } catch (error) {
                console.error("Lỗi khi thêm nhà cung cấp:", error);
                alert("Đã xảy ra lỗi khi thêm. Vui lòng thử lại!");
            }
        }
    };

    // 5. DELETE: XÓA NHÀ CUNG CẤP
    const handleDelete = async (id, name) => {
        const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${name}" không?`);
        if (!isConfirm) return;

        try {
            const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage
            const response = await fetch(`${apiUrl}/admin/suppliers/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // --- ĐOẠN SỬA QUAN TRỌNG NHẤT goi refresh neu 401 ---
            if (!response.ok) {
                if (response.status === 401) {
                    await refreshAuth(); // Hàm này phải return true/false
                }
                throw new Error(`Lỗi server: ${response.status}`);
            }
            // -------------------------------

            if (!response.ok) throw new Error("Xóa thất bại, mã lỗi: " + response.status);

            const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
            setSuppliers(updatedSuppliers);

            // Nếu đang sửa chính thằng vừa bị xóa thì reset form
            if (editingId === id) {
                handleCancelEdit();
            }

            alert(`Đã xóa thành công nhà cung cấp ${name}`);
        } catch (error) {
            console.error("Lỗi khi xóa nhà cung cấp:", error);
            alert("Đã xảy ra lỗi khi xóa. Vui lòng thử lại!");
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
            </div>
        </div>
    );
}