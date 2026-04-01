import React, { useState, useEffect } from 'react';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // STATE CHO FORM THÊM MỚI (INLINE FORM)
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
                const response = await fetch(`${apiUrl}/api/v1/suppliers`);
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
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

    // 2. POST: THÊM NHÀ CUNG CẤP
    const handleAddSupplier = async (e) => {
        e.preventDefault();
        
        // Validate cơ bản
        if (!formData.name.trim()) {
            alert("Vui lòng nhập Tên nhà cung cấp!");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/v1/suppliers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Thêm thất bại, mã lỗi: " + response.status);
            }

            const result = await response.json();
            const newSupplier = result.data || formData;

            // Thêm data mới vào đầu mảng
            setSuppliers([newSupplier, ...suppliers]);
            
            // Xóa rỗng form sau khi thêm thành công
            setFormData({ name: '', code: '', email: '', phone: '', address: '', isActive: true });
            
            alert(`Đã thêm thành công nhà cung cấp: ${newSupplier.name}`);

        } catch (error) {
            console.error("Lỗi khi thêm nhà cung cấp:", error);
            alert("Đã xảy ra lỗi khi thêm. Vui lòng thử lại!");
        }
    };

    // 3. DELETE: XÓA NHÀ CUNG CẤP
    const handleDelete = async (id, name) => {
        const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${name}" không?`);

        if (!isConfirm) return;

        try {
            const response = await fetch(`${apiUrl}/api/v1/suppliers/${id}`, {
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
            <div className="filters" style={{ marginBottom: '10px' }}>
                <select className="f-select" defaultValue="Trạng thái">
                    <option value="Trạng thái">Trạng thái</option>
                    <option value="Đang hợp tác">Đang hợp tác</option>
                    <option value="Ngừng">Ngừng</option>
                </select>
                <input className="f-input" placeholder="Tìm tên, mã nhà cung cấp..." />
            </div>

            {/* ====== FORM THÊM MỚI INLINE (VỊ TRÍ Ô VUÔNG ĐỎ) ====== */}
            <form onSubmit={handleAddSupplier} className="card" style={{ padding: '15px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#f8f9fa', border: '1px dashed #ced4da' }}>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Tên NCC (*)" className="f-input" style={{ flex: '1 1 150px' }} required />
                <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="Mã NCC" className="f-input" style={{ flex: '1 1 100px' }} />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="f-input" style={{ flex: '1 1 150px' }} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Số điện thoại" className="f-input" style={{ flex: '1 1 120px' }} />
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Địa chỉ" className="f-input" style={{ flex: '1 1 150px' }} />
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                    Hoạt động
                </label>
                
                <button type="submit" className="btn" style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Thêm
                </button>
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
                                                    <button className="btn btn-sm">Sửa</button>
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