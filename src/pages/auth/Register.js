import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp.');
            return;
        }

        try {
            const response = await fetch(
                'https://clothes-api.fernirx.io.vn/api/clothes/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage('Đăng ký thành công! Vui lòng xác thực OTP.');
                setTimeout(() => {
                    navigate('/verify-otp', { state: { email: email } });
                }, 1500);
            } else {
                setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="login-page">
            <button className="back-button-top" onClick={() => navigate(-1)} title="Quay lại">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
            </button>
            <div className="login-split">
                <div className="login-decor">
                    <div className="decor-orb decor-orb-one" />
                    <div className="decor-orb decor-orb-two" />
                    <div className="decor-card decor-card-top">
                        <span>+128%</span>
                        <p>Doanh thu tháng này</p>
                    </div>
                    <div className="decor-card decor-card-bottom">
                        <span>24/7</span>
                        <p>Quản trị đơn hàng</p>
                    </div>
                    <div className="decor-content">
                        <h1>Quản lý cửa hàng gọn gàng, nhanh và trực quan.</h1>
                        <p className="decor-text">
                            Theo dõi đơn hàng, tồn kho và khách hàng trên một không gian hiện đại.
                        </p>
                        <div className="decor-pills">
                            <span>Đơn hàng</span>
                            <span>Sản phẩm</span>
                            <span>Khách hàng</span>
                        </div>
                    </div>
                </div>

                <div className="login-card">
                    <div className="login-header">
                        <h2>Đăng ký</h2>
                        <p className="login-description">
                            Tạo tài khoản mới để quản lý cửa hàng của bạn.
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="firstName">Họ</label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="Nhập họ"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                        />

                        <label htmlFor="lastName">Tên</label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Nhập tên"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />

                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />

                        <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />

                        <button type="submit">Đăng ký</button>

                        {error && <p className="login-error">{error}</p>}
                        {message && <p className="login-message">{message}</p>}
                    </form>

                    <div className="login-signup">
                        <p>Đã có tài khoản? <a className="signup-link" onClick={() => navigate('/login')}>Đăng nhập</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
