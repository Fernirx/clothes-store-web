export const refreshAuth = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        // Gọi API để lấy token mới
        const response = await fetch('https://clothes-api.fernirx.io.vn/api/clothes/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) throw new Error("Refresh failed");

        const data = await response.json();
        console.log(data);

        // data trả về thường có dạng: { accessToken: '...', refreshToken: '...', user: {...} }

        // 1. Cập nhật lại localStorage
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    } catch (error) {
        // Nếu refresh thất bại (hết hạn hoàn toàn), đăng xuất người dùng
        localStorage.clear();
        window.location.href = '/login';
        return null;
    }
};