import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		setMessage('');

		if (!email.trim() || !password.trim()) {
			setError('Vui lòng nhập đầy đủ email và mật khẩu.');
			return;
		}
		try {
			const response = await fetch(
				'https://clothes-api.fernirx.io.vn/api/clothes/auth/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: email,
						password: password,
					}),
				}
			);
			const data = await response.json();

			if (response.ok && data.data) {
				// Lưu tokens vào localStorage
				localStorage.setItem('accessToken', data.data.accessToken);
				localStorage.setItem('refreshToken', data.data.refreshToken);

				// Lưu user info vào localStorage
				localStorage.setItem('user', JSON.stringify(data.data.user));

				setMessage('Đăng nhập thành công. Chuyển hướng...');

				// Chuyển hướng đến dashboard sau 1.5s
				setTimeout(() => {
					navigate('/');
				}, 1500);
			} else {
				setError(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
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

						<h2>Đăng nhập</h2>
						<p className="login-description">
							Nhập thông tin tài khoản để tiếp tục vào trang quản trị.
						</p>
					</div>

					<form className="login-form" onSubmit={handleSubmit}>
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
							placeholder="Nhập mật khẩu"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>

						<button type="submit">Đăng nhập</button>

						{error && <p className="login-error">{error}</p>}
						<div className="login-signup">
							<p>Bạn chưa có tài khoản? <a className="signup-link" onClick={() => navigate('/register')}>Đăng ký</a></p>
						</div>
					</form>



				</div>
			</div>
		</div>
	);
}

export default Login;
