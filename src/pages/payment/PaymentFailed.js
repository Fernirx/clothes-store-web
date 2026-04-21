import { useLocation, useNavigate } from "react-router-dom";
import PaymentLayout from "./PaymentLayout";

/** @param {number} value */
const formatPrice = (value) => (value || 0).toLocaleString("vi-VN") + " đ";

function PaymentFailed() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <PaymentLayout>
      <div className="payment-result-page">
        <div className="payment-result-card">
          <div className="payment-badge failed">!</div>
          <h1>Thanh toán thất bại</h1>
          <p>Khách hàng: {state?.recipient_name || "Chưa cập nhật"}</p>
          <p>Phương thức: {state?.payment_method || "VNPAY"}</p>
          <p>Số tiền: {formatPrice(state?.total_amount)}</p>
          <p>Vui lòng thử lại hoặc chọn COD.</p>

          <div className="payment-result-actions">
            <button className="result-btn primary" onClick={() => navigate("/checkout")}>
              Thử lại
            </button>
            <button className="result-btn secondary" onClick={() => navigate("/")}>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </PaymentLayout>
  );
}

export default PaymentFailed;
