import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Thêm useLocation
import './App.css'; 

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/dashboard/Dashboard';
import OrderList from './pages/orders/OrderList';
import Coupons from './pages/coupons/Coupons';
import ProductList from './pages/products/ProductList';
import Reviews from './pages/reviews/Reviews';
import Users from './pages/users/Users';
import Suppliers from './pages/suppliers/Suppliers';
import Notifications from './pages/notifications/Notifications';
import Inventory from './pages/inventory/Inventory';

// 1. Tạo một component bọc để có thể dùng được useLocation
function AppContent() {
  const location = useLocation();

  // 2. Định nghĩa tiêu đề và nút bấm cho từng đường dẫn
  const pageConfig = {
    "/": { title: "Dashboard", button: "Xuất báo cáo" },
    "/orders": { title: "Quản lý đơn hàng", button: "+ Tạo đơn" },
    "/products": { title: "Quản lý sản phẩm", button: "+ Thêm sản phẩm" },
    "/coupons": { title: "Khuyến mãi / Coupon", button: "+ Tạo coupon" },
    "/reviews": { title: "Đánh giá & Bình luận", button: "Xuất báo cáo" },
    "/users": { title: "Quản lý người dùng", button: "+ Thêm admin" },
    "/suppliers": { title: "Nhà cung cấp", button: "+ Thêm nhà cung cấp" },
    "/notifications": { title: "Thông báo", button: "+ Tạo thông báo" },
    "/inventory": { title: "Tồn kho", button: "+ Tạo phiếu nhập" },
  };

  const currentConfig = pageConfig[location.pathname] || { title: "StyleAdmin", button: "+ Thêm mới" };

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar 
          title={currentConfig.title} 
          buttonText={currentConfig.button} 
          onButtonClick={() => alert(`Bạn vừa bấm nút ở trang ${currentConfig.title}`)}
        />
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/products" element={<ProductList />} /> 
            <Route path="/reviews" element={<Reviews />} /> 
            <Route path="/users" element={<Users />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;