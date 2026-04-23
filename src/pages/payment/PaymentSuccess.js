import { useLocation } from "react-router-dom";
import PaymentLayout from "./PaymentLayout";

/** @param {number} value */
const formatPrice = (value) => (value || 0).toLocaleString("vi-VN") + " đ";

function PaymentSuccess() {
  const { state } = useLocation();

  return (
    <PaymentLayout>
      <div className="payment-result-page">
        <div className="payment-result-card">
          <div className="payment-badge success">✓</div>
          <h1>Thanh toán thành công</h1>
          <p>Khách hàng: {state?.recipient_name || "Chưa cập nhật"}</p>
          <p>Phương thức: {state?.payment_method || "COD"}</p>
          <p>Tổng tiền: {formatPrice(state?.total_amount)}</p>

          <div className="payment-result-actions">
            <button className="result-btn primary" onClick={() => (window.location.href = "/")}>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </PaymentLayout>
  );
}

export default PaymentSuccess;
