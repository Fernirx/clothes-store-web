import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Kiểm tra xem mảng user.roles của BE có chứa bất kỳ quyền nào trong allowedRoles không
    // Lưu ý: Dùng .some để kiểm tra mảng
    const hasPermission = user.roles?.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;