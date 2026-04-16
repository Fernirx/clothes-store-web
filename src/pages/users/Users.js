import React, { useState, useEffect } from 'react';

// --- CÁC HÀM HELPER ---
const getNameFromEmail = (email) => {
    if (!email) return 'Unknown';
    return email.split('@')[0];
};

const getInitials = (name) => {
    return name.substring(0, 2).toUpperCase();
};

const formatDate = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const getAvatarClass = (role) => {
    return role === 'ADMIN' ? 'av-orange' : 'av-blue'; 
};

export default function Users() {
    // --- STATE DANH SÁCH & FILTER ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');
    const [filterProvider, setFilterProvider] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [refresh, setRefresh] = useState(false);
    
    // Thêm state quản lý màn hình Thùng rác
    const [isViewTrash, setIsViewTrash] = useState(false);

    // --- STATE FORM ---
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState('add'); 
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '', 
        role: 'USER',
        provider: 'LOCAL',
        active: true
    });
    const [isSaving, setIsSaving] = useState(false);

    // --- HÀM FETCH DATA ---
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const queryParams = new URLSearchParams({ page: page, size: size });
                if (filterRole) queryParams.append('role', filterRole);
                if (filterProvider === 'Email') queryParams.append('provider', 'LOCAL');
                if (filterProvider === 'Google') queryParams.append('provider', 'GOOGLE');
                
                // Đổi endpoint dựa vào trạng thái xem
                const endpoint = isViewTrash ? 'users/trash' : 'users';
                const url = `https://clothes-api.fernirx.io.vn/api/clothes/${endpoint}?${queryParams.toString()}`;
                
                const response = await fetch(url);
                if (!response.ok) throw new Error('Lỗi mạng hoặc server');

                const apiData = await response.json();
                if (apiData.data && apiData.data.content) {
                    const formattedUsers = apiData.data.content.map((user) => ({
                        id: user.id,
                        name: getNameFromEmail(user.email),
                        initials: getInitials(getNameFromEmail(user.email)),
                        avatarClass: getAvatarClass(user.role),
                        email: user.email,
                        role: user.role,
                        roleClass: user.role === 'ADMIN' ? 'b-admin' : 'b-user',
                        provider: user.provider,
                        loginBy: user.provider === 'LOCAL' ? 'Email' : user.provider,
                        joined: formatDate(user.createdAt),
                        active: user.active,
                        status: user.active ? 'Hoạt động' : 'Bị khóa',
                        statusClass: user.active ? 'b-active' : 'b-inactive',
                    }));
                    setUsers(formattedUsers);
                }
            } catch (error) {
                console.error("Lỗi khi fetch API:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    // Thêm isViewTrash vào dependency array để load lại data khi đổi chế độ
    }, [filterRole, filterProvider, page, size, refresh, isViewTrash]); 

    // --- XỬ LÝ XÓA MỀM (Soft Delete) ---
    const handleDelete = async (userId, userEmail) => {
        const isConfirm = window.confirm(`Bạn có chắc chắn muốn chuyển tài khoản ${userEmail} vào thùng rác?`);
        if (!isConfirm) return;
        try {
            const response = await fetch(`https://clothes-api.fernirx.io.vn/api/clothes/users/${userId}`, { method: 'DELETE' });
            if (response.ok) {
                setRefresh(!refresh);
                if (selectedUserId === userId) setShowForm(false); 
            } else alert('Xóa thất bại.');
        } catch (error) {
            alert('Lỗi kết nối máy chủ!');
        }
    };

    // --- XỬ LÝ KHÔI PHỤC (Restore) ---
    const handleRestore = async (userId, userEmail) => {
        const isConfirm = window.confirm(`Bạn có chắc muốn khôi phục tài khoản ${userEmail}?`);
        if (!isConfirm) return;
        try {
            const response = await fetch(`https://clothes-api.fernirx.io.vn/api/clothes/users/${userId}/restore`, { method: 'PATCH' });
            if (response.ok) {
                setRefresh(!refresh);
                alert('Đã khôi phục người dùng!');
            } else alert('Khôi phục thất bại.');
        } catch (error) {
            alert('Lỗi kết nối máy chủ!');
        }
    };

    // --- XỬ LÝ XÓA CỨNG (Hard Delete) ---
    const handleHardDelete = async (userId, userEmail) => {
        const isConfirm = window.confirm(`CẢNH BÁO: Bạn có chắc muốn xóa VĨNH VIỄN tài khoản ${userEmail}? Hành động này không thể hoàn tác!`);
        if (!isConfirm) return;
        try {
            const response = await fetch(`https://clothes-api.fernirx.io.vn/api/clothes/users/${userId}/hard`, { method: 'DELETE' });
            if (response.ok) {
                setRefresh(!refresh);
                alert('Đã xóa vĩnh viễn người dùng!');
            } else alert('Xóa vĩnh viễn thất bại.');
        } catch (error) {
            alert('Lỗi kết nối máy chủ!');
        }
    };

    // --- XỬ LÝ MỞ FORM ---
    const handleOpenAddForm = () => {
        setFormMode('add');
        setFormData({ email: '', password: '', role: 'USER', provider: 'LOCAL', active: true });
        setShowForm(true);
    };

    const handleOpenEditForm = (user) => {
        setFormMode('edit');
        setSelectedUserId(user.id);
        setFormData({ 
            email: user.email, 
            password: '', 
            role: user.role, 
            provider: user.provider, 
            active: user.active 
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const url = formMode === 'add' 
        ? 'https://clothes-api.fernirx.io.vn/api/clothes/users'
        : `https://clothes-api.fernirx.io.vn/api/clothes/users/${selectedUserId}`;
    const method = formMode === 'add' ? 'POST' : 'PATCH';
    
    // Tạo bản sao của dữ liệu form để gửi đi
    const payload = { ...formData };
    
    // NẾU LÀ SỬA (EDIT): Bắt buộc xóa password và email khỏi payload
    if (formMode === 'edit') {
        delete payload.password; 
        delete payload.email;     // THÊM DÒNG NÀY ĐỂ TRÁNH LỖI 409
        delete payload.provider;  // (Tùy chọn) Xóa luôn provider vì cũng không cho đổi
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(formMode === 'add' ? 'Thêm thành công!' : 'Cập nhật thành công!');
            setShowForm(false);
            setRefresh(!refresh);
        } else {
            alert('Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu.');
        }
    } catch (error) {
        console.error("Lỗi submit form:", error);
        alert('Lỗi kết nối máy chủ!');
    } finally {
        setIsSaving(false);
    }
};
    const toggleTrashView = () => {
        setIsViewTrash(!isViewTrash);
        setShowForm(false); // Đóng form nếu đang mở
        setPage(0); // Reset trang về đầu
    };

    return (
        <div className="page-content">
            {/* Thanh Header: Tiêu đề & Cụm nút */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    {isViewTrash ? 'Quản lý người dùng - Thùng rác' : 'Quản lý người dùng'}
                </h2>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Nút chuyển đổi Thùng rác / Danh sách */}
                    <button 
                        className="btn"
                        style={{ background: '#f8f9fa', color: '#333', border: '1px solid #ccc', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        onClick={toggleTrashView}
                    >
                        {isViewTrash ? '🔙 Quay lại danh sách' : '🗑️ Thùng rác'}
                    </button>

                    {/* Chỉ hiện Thêm mới ở màn hình danh sách chính */}
                    {!isViewTrash && (
                        <button 
                            className="btn btn-primary"
                            style={{ background: '#007bff', color: '#fff', border: '1px solid #007bff', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                            onClick={handleOpenAddForm}
                        >
                            + Thêm mới
                        </button>
                    )}
                </div>
            </div>

            {/* Thanh Filters */}
            <div className="filters">
                <select className="f-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                    <option value="">Vai trò (Tất cả)</option>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <select className="f-select" value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)}>
                    <option value="">Đăng nhập qua (Tất cả)</option>
                    <option value="Email">Email</option>
                    <option value="Google">Google</option>
                </select>
                <input className="f-input" placeholder="Tìm email, tên người dùng..." style={{ flex: 1 }} />
            </div>

            {/* --- INLINE FORM (Chỉ mở ở danh sách chính) --- */}
            {showForm && !isViewTrash && (
                <div className="card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #007bff' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                        
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email (*)" 
                            className="f-input" 
                            style={{ minWidth: '200px' }}
                            value={formData.email} 
                            onChange={handleInputChange} 
                            disabled={formMode === 'edit'} 
                            required 
                        />
                        
                        {formMode === 'add' && (
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Mật khẩu (*)" 
                                className="f-input" 
                                style={{ minWidth: '150px' }}
                                value={formData.password} 
                                onChange={handleInputChange} 
                                required 
                            />
                        )}

                        <select name="role" className="f-select" value={formData.role} onChange={handleInputChange}>
                            <option value="USER">Vai trò: USER</option>
                            <option value="ADMIN">Vai trò: ADMIN</option>
                        </select>

                        <select name="provider" className="f-select" value={formData.provider} onChange={handleInputChange} disabled={formMode === 'edit'}>
                            <option value="LOCAL">Nguồn: LOCAL</option>
                            <option value="GOOGLE">Nguồn: GOOGLE</option>
                        </select>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input 
                                type="checkbox" 
                                name="active" 
                                id="statusActive"
                                checked={formData.active} 
                                onChange={handleInputChange} 
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <label htmlFor="statusActive" style={{ margin: 0, cursor: 'pointer', fontWeight: '500' }}>Hoạt động</label>
                        </div>

                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                            <button 
                                type="button" 
                                onClick={() => setShowForm(false)} 
                                style={{ padding: '8px 16px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Hủy
                            </button>
                            <button 
                                type="submit" 
                                style={{ padding: '8px 16px', background: formMode === 'add' ? '#007bff' : '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Đang lưu...' : (formMode === 'add' ? '+ Thêm' : 'Cập nhật')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Bảng Dữ Liệu */}
            <div className="card">
                <div className="tbl-wrap">
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Đang tải dữ liệu...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Người dùng</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
                                    <th>Đăng nhập qua</th>
                                    <th>Đăng ký</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu.</td>
                                    </tr>
                                ) : users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-main">
                                                <div className={`av ${user.avatarClass}`}>{user.initials}</div>
                                                <div className="user-name">{user.name}</div>
                                            </div>
                                        </td>
                                        <td className="user-email">{user.email}</td>
                                        <td><span className={`badge ${user.roleClass}`}>{user.role}</span></td>
                                        <td className="login-method">{user.loginBy}</td>
                                        <td className="user-date">{user.joined}</td>
                                        <td><span className={`badge ${user.statusClass}`}>{user.status}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {/* Render Các Nút Tùy Chế Độ Xem */}
                                                {isViewTrash ? (
                                                    <>
                                                        <button 
                                                            className="btn btn-sm" 
                                                            style={{ border: '1px solid #28a745', background: '#e9fbee', color: '#28a745', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                                                            onClick={() => handleRestore(user.id, user.email)}
                                                        >
                                                            Khôi phục
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm" 
                                                            style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                                                            onClick={() => handleHardDelete(user.id, user.email)}
                                                        >
                                                            Xóa cứng
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            className="btn btn-sm" 
                                                            style={{ border: '1px solid #ddd', background: '#fff', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                                                            onClick={() => handleOpenEditForm(user)}
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm" 
                                                            style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                                                            onClick={() => handleDelete(user.id, user.email)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}