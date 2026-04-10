import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import CreateProductForm from './pages/Form/CreateProductForm';
import HomeList from './pages/home/HomeList';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Login from './pages/Login/login';
function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const pageConfig = {
    "/": { title: "Dashboard", button: "Xuất báo cáo" },
    "/orders": { title: "Quản lý đơn hàng", button: "+ Tạo đơn" },
    "/products": { title: "Quản lý sản phẩm", button: "+ Thêm sản phẩm" },
    "/coupons": { title: "Khuyến mãi / Coupon", button: "+ Tạo coupon" },
    "/reviews": { title: "Đánh giá & Bình luận", button: "Xuất báo cáo" },
    "/users": { title: "Quản lý người dùng", button: "+ Thêm admin" },
    "/suppliers": { title: "Nhà cung cấp" },
    "/notifications": { title: "Thông báo", button: "+ Tạo thông báo" },
    "/inventory": { title: "Tồn kho", button: "+ Tạo phiếu nhập" },
  };

  const currentConfig = pageConfig[location.pathname] || {
    title: "StyleAdmin",
    button: "+ Thêm mới",
  };
  const handleButtonTopbar = () => {
    if (location.pathname === "/products") {
      navigate("/products/form");
      return;
    }
  }
  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <Topbar
          title={currentConfig.title}
          buttonText={currentConfig.button}
          onButtonClick={handleButtonTopbar}
        />

        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
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
      <Routes>
        {/* 1. CÁC TRANG FORM ĐỘC LẬP (Không có sidebar/topbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/products/form/" element={<CreateProductForm />} />
        <Route path="/products/form/:id" element={<CreateProductForm />} />

        {/* 2. CÁC TRANG DÀNH CHO KHÁCH HÀNG (Hiển thị HomeList / Chi tiết) */}
        <Route path="/" element={<HomeList />} />
        <Route path="/home" element={<HomeList />} />
        <Route path="/new-arrivals" element={<HomeList />} />
        
        {/* 👉 ĐÂY LÀ DÒNG BỊ THIẾU MÀ MÌNH ĐÃ THÊM VÀO GIÚP BẠN */}
        <Route path="/danh-sach-quan-ao" element={<HomeList />} /> 
        
        <Route path="/ao-thun" element={<HomeList />} />
        <Route path="/quan-jean" element={<HomeList />} />
        <Route path="/ao-khoac" element={<HomeList />} />
        <Route path="/vay-dam" element={<HomeList />} />
        <Route path="/phu-kien" element={<HomeList />} />
        <Route path="/sale" element={<HomeList />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />

        {/* 3. CÁC TRANG ADMIN DÙNG LAYOUT CHUNG */}
        {/* Luôn để đường dẫn có dấu "/*" ở CUỐI CÙNG của danh sách */}
        <Route path="/*" element={<AdminLayout />} />

      </Routes>
    </Router>
  );
}

export default App;