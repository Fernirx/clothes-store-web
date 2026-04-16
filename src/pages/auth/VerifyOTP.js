import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const inputRefs = useRef([]);

    const email = location.state?.email || '';

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ 6 chữ số OTP.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'https://clothes-api.fernirx.io.vn/api/clothes/auth/verify-otp',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        otp: otpCode,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage('Xác thực thành công! Vui lòng đăng nhập.');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setError(data.message || 'OTP không chính xác. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setMessage('');

        try {
            const response = await fetch(
                'https://clothes-api.fernirx.io.vn/api/clothes/auth/resend-otp',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                    }),
                }
            );

            if (response.ok) {
                setMessage('OTP mới đã được gửi tới email của bạn.');
                setResendTimer(60);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                setError('Không thể gửi lại OTP. Vui lòng thử lại.');
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
                        <span>✓</span>
                        <p>Xác thực an toàn</p>
                    </div>
                    <div className="decor-card decor-card-bottom">
                        <span>OTP</span>
                        <p>One-time Password</p>
                    </div>
                    <div className="decor-content">
                        <h1>Xác thực tài khoản của bạn</h1>
                        <p className="decor-text">
                            Chúng tôi đã gửi mã xác thực 6 chữ số tới email của bạn. Vui lòng nhập mã để hoàn tất quá trình đăng ký.
                        </p>
                        <div className="decor-pills">
                            <span>An toàn</span>
                            <span>Nhanh chóng</span>
                            <span>Dễ dàng</span>
                        </div>
                    </div>
                </div>

                <div className="login-card">
                    <div className="login-header">
                        <h2>Xác thực OTP</h2>
                        <p className="login-description">
                            Nhập mã OTP đã được gửi tới {email}
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label>Mã OTP (6 chữ số)</label>
                        <div className="otp-input-group">
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    placeholder="◯"
                                    value={value}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    className="otp-input"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Đang xác thực...' : 'Xác thực'}
                        </button>

                        {error && <p className="login-error">{error}</p>}
                        {message && <p className="login-message">{message}</p>}
                    </form>

                    <div className="otp-footer">
                        <p>Không nhận được mã?</p>
                        <button
                            className="resend-button"
                            onClick={handleResendOtp}
                            disabled={resendTimer > 0 || loading}
                        >
                            {resendTimer > 0 ? `Gửi lại trong ${resendTimer}s` : 'Gửi lại'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;
