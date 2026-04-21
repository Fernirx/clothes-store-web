import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

// Import các thành phần điều hướng và bảo vệ
import ProtectedRoute from './components/route/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Import Pages (Admin & Auth)
import Login from './pages/auth/login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import Brands from './pages/brands/Brands';
import Coupons from './pages/coupons/Coupons';
import Dashboard from './pages/dashboard/Dashboard';
import Inventory from './pages/inventory/Inventory';
import Notifications from './pages/notifications/Notifications';
import OrderList from './pages/orders/OrderList';
import ProductList from './pages/products/ProductList';
import Reviews from './pages/reviews/Reviews';
import Suppliers from './pages/suppliers/Suppliers';
import Users from './pages/users/Users';

// Import Pages (Customer)
import HomeList from './pages/home/HomeList';
import Checkout from './pages/payment/Checkout';
import PaymentFailed from './pages/payment/PaymentFailed';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import ProductDetail from './pages/ProductDetail/ProductDetail';

// Import Forms
import AddProductForm from './components/form/AddProductForm';
import EditProductForm from './components/form/EditProductForm';

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const pageConfig = {
    "/dashboard": { title: "Dashboard", button: "Xuất báo cáo" },
    "/orders": { title: "Quản lý đơn hàng", button: "+ Tạo đơn" },
    "/products": { title: "Quản lý sản phẩm", button: "+ Thêm sản phẩm" },
    "/coupons": { title: "Khuyến mãi / Coupon", button: "+ Tạo coupon" },
    "/reviews": { title: "Đánh giá & Bình luận", button: "Xuất báo cáo" },
    "/users": { title: "Quản lý người dùng" },
    "/suppliers": { title: "Nhà cung cấp" },
    "/brands": { title: "Thương hiệu" },
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
    }
  };

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
            <Route path="/brands" element={<Brands />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="*" element={<div style={{ padding: '20px' }}>404 - Không tìm thấy trang quản trị</div>} />
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
        {/* 1. PUBLIC ROUTES - Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* 2. PUBLIC ROUTES - Customer Pages */}
        <Route path="/" element={<HomeList />} />
        <Route path="/home" element={<HomeList />} />
        <Route path="/new-arrivals" element={<HomeList />} />
        <Route path="/danh-sach-quan-ao" element={<HomeList />} />
        <Route path="/ao-thun" element={<HomeList />} />
        <Route path="/quan-jean" element={<HomeList />} />
        <Route path="/ao-khoac" element={<HomeList />} />
        <Route path="/vay-dam" element={<HomeList />} />
        <Route path="/phu-kien" element={<HomeList />} />
        <Route path="/sale" element={<HomeList />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />

        {/* 3. PROTECTED ROUTES - Admin Only */}
        {/* LƯU Ý: allowedRoles chuyển thành 'ROLE_ADMIN' để khớp với Backend */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          {/* Các form tách rời layout */}
          <Route path="/products/form" element={<AddProductForm />} />
          <Route path="/products/form/edit/:idProduct" element={<EditProductForm />} />

          {/* Toàn bộ các trang có Sidebar/Topbar */}
          <Route path="/*" element={<AdminLayout />} />
        </Route>

        {/* 4. GLOBAL 404 */}
        <Route path="*" element={<div style={{ padding: '50px', textAlign: 'center' }}><h1>404</h1><p>Trang web không tồn tại</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;