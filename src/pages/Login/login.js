import React, { useState } from 'react';
import './login.css';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!email.trim() || !password.trim()) {
			setMessage('Vui lòng nhập đầy đủ email và mật khẩu.');
			return;
		}

		setMessage('Đăng nhập thành công.');
	};

	return (
		<div className="login-page">
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

						{message && <p className="login-message">{message}</p>}
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;
