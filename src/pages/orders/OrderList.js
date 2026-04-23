import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_ROOT_API || 'https://clothes-api.fernirx.io.vn/api/clothes';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- State mới cho việc chỉnh sửa ---
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', adminNote: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null); // Reset lỗi mỗi lần gọi lại
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) { navigate('/login'); return; }

      const response = await fetch(`${API_BASE_URL}/admin/orders?page=0&size=20`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Lỗi Server: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      console.log("Dữ liệu API trả về:", json); // IN RA ĐỂ KIỂM TRA

      // Đảm bảo lấy đúng mảng dữ liệu. Nếu json.data không có content thì thử lấy trực tiếp json.data
      const content = json.data?.content || (Array.isArray(json.data) ? json.data : []);
      
      content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(content);
    } catch (err) {
      console.error("Lỗi fetch API:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (order) => {
    setEditingId(order.id);
    setEditForm({
      status: order.status,
      adminNote: order.adminNote || ''
    });
  };

  const handleSaveStatus = async (id) => {
    try {
      setIsUpdating(true);
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setEditingId(null); 
        fetchOrders(); 
        alert('Cập nhật trạng thái thành công!');
      } else {
        alert('Lỗi khi cập nhật trạng thái');
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return { text: 'Chờ xác nhận', class: 'b-pending' };
      case 'CONFIRMED': return { text: 'Đã xác nhận', class: 'b-info' };
      case 'SHIPPING': return { text: 'Vận chuyển', class: 'b-shipping' };
      case 'DELIVERED': return { text: 'Đã giao', class: 'b-delivered' };
      case 'CANCELED': return { text: 'Đã hủy', class: 'b-danger' };
      default: return { text: status, class: '' };
    }
  };

  return (
    <div className="page-content">
      <div className="card">
        <div className="tbl-wrap">
          
          {/* ĐÃ THÊM LẠI KIỂM TRA TRẠNG THÁI LOADING VÀ ERROR */}
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', fontWeight: 'bold' }}>Đang tải dữ liệu...</div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
              Lỗi: {error}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Chưa có đơn hàng nào.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú Admin</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="td-mono">{order.code}</td>
                    <td>{order.recipientName}</td>
                    <td>{formatPrice(order.totalAmount)}</td>
                    
                    <td>
                      {editingId === order.id ? (
                        <select 
                          className="f-select" 
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        >
                          <option value="PENDING">Chờ xác nhận</option>
                          <option value="CONFIRMED">Đã xác nhận</option>
                          <option value="SHIPPING">Vận chuyển</option>
                          <option value="DELIVERED">Đã giao</option>
                          <option value="CANCELED">Đã hủy</option>
                        </select>
                      ) : (
                        <span className={`badge ${getStatusBadge(order.status).class}`}>
                          {getStatusBadge(order.status).text}
                        </span>
                      )}
                    </td>

                    <td>
                      {editingId === order.id ? (
                        <input 
                          className="f-input"
                          value={editForm.adminNote}
                          onChange={(e) => setEditForm({...editForm, adminNote: e.target.value})}
                          placeholder="Nhập ghi chú..."
                        />
                      ) : (
                        <span style={{fontSize: '12px'}}>{order.adminNote || '---'}</span>
                      )}
                    </td>

                    <td>
                      {editingId === order.id ? (
                        <div style={{display: 'flex', gap: '4px'}}>
                          <button 
                            className="btn btn-sm" 
                            style={{backgroundColor: '#28a745', color: '#fff'}}
                            onClick={() => handleSaveStatus(order.id)}
                            disabled={isUpdating}
                          >
                            {isUpdating ? '...' : 'Lưu'}
                          </button>
                          <button className="btn btn-sm" onClick={() => setEditingId(null)}>Hủy</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-sm" style={{ border: '1px solid #d1d5db', background: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Chi tiết</button>
                          <button className="btn btn-sm" onClick={() => startEdit(order)} style={{ border: '1px solid #d1d5db', background: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Sửa</button>
                          <button className="btn btn-sm" style={{ border: 'none', background: '#dc3545', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Xóa</button>
                        </div>
                      )}
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