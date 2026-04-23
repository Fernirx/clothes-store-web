import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_ROOT_API || 'https://clothes-api.fernirx.io.vn/api/clothes';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- State cho việc chỉnh sửa ---
  const [editingOrder, setEditingOrder] = useState(null); // Lưu toàn bộ thông tin đơn đang sửa
  const [editForm, setEditForm] = useState({ status: '', adminNote: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) { navigate('/login'); return; }

      const response = await fetch(`${API_BASE_URL}/admin/orders?page=0&size=20`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      const json = await response.json();
      const content = json.data?.content || [];
      content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(content);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Bật chế độ sửa và scroll lên đầu trang
  const startEdit = (order) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingOrder(order);
    setEditForm({
      status: order.status || 'PENDING',
      adminNote: order.adminNote || ''
    });
  };

  // Hủy chế độ sửa
  const cancelEdit = () => {
    setEditingOrder(null);
  };

  // Gọi API cập nhật
  const handleSaveStatus = async () => {
    if (!editingOrder) return;
    try {
      setIsUpdating(true);
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/orders/${editingOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setEditingOrder(null); // Tắt form sửa
        fetchOrders(); // Tải lại danh sách
        alert('Cập nhật thành công!');
      } else {
        alert('Lỗi khi cập nhật!');
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Hàm xử lý Xóa (Bạn cần thay thế endpoint API cho phù hợp nếu có)
  const handleDelete = async (id, code) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${code} không?`)) {
        // Gọi API Xóa ở đây
        alert(`Đã gửi yêu cầu xóa đơn hàng ${code} (Cần tích hợp API xóa)`);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return { text: 'Chờ xác nhận', class: 'b-pending', style: { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' } };
      case 'CONFIRMED': return { text: 'Đã xác nhận', class: 'b-info', style: { backgroundColor: '#cce5ff', color: '#004085', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' } };
      case 'SHIPPING': return { text: 'Vận chuyển', class: 'b-shipping', style: { backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' } };
      case 'DELIVERED': return { text: 'Đã giao', class: 'b-delivered', style: { backgroundColor: '#28a745', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' } };
      case 'CANCELED': return { text: 'Đã hủy', class: 'b-danger', style: { backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' } };
      default: return { text: status, class: '', style: {} };
    }
  };

  return (
    <div className="page-content">
      
      {/* KHUNG CHỈNH SỬA MÀU VÀNG (Hiện ra khi bấm nút Sửa) */}
      {editingOrder && (
        <div style={{
          backgroundColor: '#fffbeb', 
          border: '1px solid #fde68a', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#b45309', fontSize: '16px' }}>
            Đang chỉnh sửa trạng thái đơn hàng: <span style={{fontWeight: 'bold', color: '#d97706'}}>{editingOrder.code}</span>
          </h4>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{display: 'block', fontSize: '12px', marginBottom: '5px', color: '#6b7280'}}>Trạng thái</label>
              <select 
                className="f-select" 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                value={editForm.status}
                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="SHIPPING">Vận chuyển</option>
                <option value="DELIVERED">Đã giao</option>
                <option value="CANCELED">Đã hủy</option>
              </select>
            </div>

            <div style={{ flex: '2', minWidth: '300px' }}>
              <label style={{display: 'block', fontSize: '12px', marginBottom: '5px', color: '#6b7280'}}>Ghi chú Admin (Tùy chọn)</label>
              <input 
                className="f-input"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                value={editForm.adminNote}
                onChange={(e) => setEditForm({...editForm, adminNote: e.target.value})}
                placeholder="Nhập ghi chú cho đơn hàng này..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn" 
                style={{ backgroundColor: '#28a745', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={handleSaveStatus}
                disabled={isUpdating}
              >
                {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button 
                className="btn" 
                style={{ backgroundColor: '#6c757d', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} 
                onClick={cancelEdit}
              >
                Hủy
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
      <div className="card">
        <div className="tbl-wrap">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>
          ) : error ? (
             <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>MÃ ĐƠN</th>
                  <th style={{ padding: '12px' }}>KHÁCH HÀNG</th>
                  <th style={{ padding: '12px' }}>TỔNG TIỀN</th>
                  <th style={{ padding: '12px' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '12px' }}>GHI CHÚ ADMIN</th>
                  <th style={{ padding: '12px' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const isEditingThis = editingOrder && editingOrder.id === order.id;

                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #eee', backgroundColor: isEditingThis ? '#f8f9fa' : 'transparent' }}>
                      <td style={{ padding: '12px', color: '#6b7280' }}>{order.code}</td>
                      <td style={{ padding: '12px' }}>{order.recipientName || 'Khách vãng lai'}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{formatPrice(order.totalAmount)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={badge.style}>{badge.text}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>
                        {order.adminNote || '---'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-sm" style={{ border: '1px solid #d1d5db', background: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Chi tiết</button>
                          <button 
                            className="btn btn-sm" 
                            style={{ border: '1px solid #d1d5db', background: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => startEdit(order)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="btn btn-sm" 
                            style={{ border: 'none', background: '#dc3545', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => handleDelete(order.id, order.code)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}