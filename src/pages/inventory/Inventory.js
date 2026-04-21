import React, { useState, useEffect } from 'react';

export default function Inventory() {
    // State lưu trữ danh sách phiếu kiểm kê
    const [adjustmentTickets, setAdjustmentTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdjustmentData = async () => {
            try {
                // Sửa URL: Lấy danh sách phiếu thay vì lấy 1 phiếu cụ thể bằng {id}
                const accessToken = localStorage.getItem("accessToken"); // lấy token từ localstorage

                const response = await fetch("https://clothes-api.fernirx.io.vn/api/clothes/api/v1/stock-adjustments", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }

                const result = await response.json();

                // Logic xử lý giống code Suppliers của bạn
                if (result.data && result.data.content) {
                    setAdjustmentTickets(result.data.content);
                } else if (Array.isArray(result.data)) {
                    setAdjustmentTickets(result.data);
                } else if (result.data) {
                    // Trong trường hợp API vẫn trả về 1 object đơn lẻ, ta bọc nó vào mảng
                    setAdjustmentTickets([result.data]);
                } else {
                    setAdjustmentTickets([]);
                }

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phiếu kiểm kê:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdjustmentData();
    }, []);

    // Hàm format thời gian
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    // Hàm xác định class CSS cho trạng thái phiếu
    const getStatusClass = (status) => {
        switch (status) {
            case 'DRAFT': return 'b-draft';
            case 'CONFIRMED': return 'b-completed';
            default: return 'b-pending';
        }
    };

    return (
        <div className="page-content">
            {/* ... Giữ nguyên phần Thống kê (stats) và Bảng 1 (Tồn kho theo variant) ... */}

            <div className="g2">
                {/* ... Bảng 1 ... */}

                {/* BẢNG 2: DANH SÁCH PHIẾU KIỂM KÊ */}
                <div className="card">
                    <div className="card-hd">
                        <span className="card-ttl">Danh sách Phiếu Kiểm kê / Điều chỉnh</span>
                        <span className="card-act">Tất cả →</span>
                    </div>

                    <div className="tbl-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã phiếu</th>
                                    <th>Loại</th>
                                    <th>Trạng thái</th>
                                    <th>Lý do</th>
                                    <th>Ngày tạo</th>
                                    <th>Cập nhật lần cuối</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td>
                                    </tr>
                                ) : adjustmentTickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu phiếu kiểm kê</td>
                                    </tr>
                                ) : (
                                    adjustmentTickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td className="td-mono td-b">{ticket.code}</td>
                                            <td>{ticket.type === 'STOCKTAKE' ? 'Kiểm kê' : 'Điều chỉnh'}</td>
                                            <td>
                                                <span className={`badge ${getStatusClass(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="inv-muted" style={{ fontSize: '12px' }}>
                                                {ticket.reason || '—'}
                                            </td>
                                            <td style={{ fontSize: '12px' }}>
                                                {formatDate(ticket.createdAt)}
                                            </td>
                                            <td style={{ fontSize: '12px' }}>
                                                {formatDate(ticket.updatedAt)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}