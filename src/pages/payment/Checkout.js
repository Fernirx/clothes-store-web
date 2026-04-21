import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import PaymentLayout from "./PaymentLayout";

const fakeCartItems = [
  {
    id: 1,
    product_name: "Áo thun basic form rộng",
    product_code: "TS-001",
    variant_size: "M",
    variant_color: "Trắng",
    variant_sku: "TS-001-WH-M",
    quantity: 2,
    unit_price: 249000,
    discount_amount: 20000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    product_name: "Quần jean ống suông",
    product_code: "JN-014",
    variant_size: "L",
    variant_color: "Xanh denim",
    variant_sku: "JN-014-DN-L",
    quantity: 1,
    unit_price: 499000,
    discount_amount: 0,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    product_name: "Áo khoác bomber",
    product_code: "JK-021",
    variant_size: "XL",
    variant_color: "Đen",
    variant_sku: "JK-021-BK-XL",
    quantity: 1,
    unit_price: 699000,
    discount_amount: 50000,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop"
  }
];

const fakeShippingFee = 30000;
const fakeCouponDiscount = 40000;

const formatPrice = (value) => {
  return value.toLocaleString("vi-VN") + " đ";
};

function Checkout() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipient_name: "",
    recipient_phone: "",
    shipping_street: "",
    shipping_ward: "",
    shipping_district: "",
    shipping_province: "",
    note: "",
    payment_method: "COD"
  });

  const orderItems = useMemo(() => {
    return fakeCartItems.map((item) => {
      const subtotal = item.unit_price * item.quantity - item.discount_amount;
      return { ...item, subtotal };
    });
  }, []);

  const subtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [orderItems]);

  const shipping_fee = fakeShippingFee;
  const discount_amount = fakeCouponDiscount;
  const total_amount = subtotal + shipping_fee - discount_amount;

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitCheckout = (event) => {
    event.preventDefault();

    // Demo điều hướng: COD luôn thành công, VNPAY random thành công/thất bại.
    if (formData.payment_method === "COD") {
      navigate("/payment/success", {
        state: {
          total_amount,
          payment_method: formData.payment_method,
          recipient_name: formData.recipient_name
        }
      });
      return;
    }

    const isSuccess = Math.random() > 0.3;
    navigate(isSuccess ? "/payment/success" : "/payment/failed", {
      state: {
        total_amount,
        payment_method: formData.payment_method,
        recipient_name: formData.recipient_name
      }
    });
  };

  return (
    <PaymentLayout>
      <div className="checkout-page">
        <div className="checkout-container">
          <section className="checkout-left">
            <h2 className="checkout-title">Order Summary</h2>

            <div className="order-list">
              {orderItems.map((item) => (
                <article className="order-item" key={item.id}>
                  <img src={item.image} alt={item.product_name} className="order-item-image" />

                  <div className="order-item-info">
                    <h3>{item.product_name}</h3>
                    <p className="small-text">Mã SP: {item.product_code}</p>
                    <p className="small-text">
                      Variant: {item.variant_size} / {item.variant_color} / {item.variant_sku}
                    </p>
                    <p className="small-text">
                      {item.quantity} x {formatPrice(item.unit_price)}
                    </p>
                    <p className="small-text">
                      Giảm giá item: {formatPrice(item.discount_amount)}
                    </p>
                  </div>

                  <div className="order-item-subtotal">{formatPrice(item.subtotal)}</div>
                </article>
              ))}
            </div>

            <div className="summary-box mobile-only">
              <div className="summary-row">
                <span>Tổng tiền hàng</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <strong>{formatPrice(shipping_fee)}</strong>
              </div>
              <div className="summary-row">
                <span>Giảm giá coupon</span>
                <strong>- {formatPrice(discount_amount)}</strong>
              </div>
              <div className="summary-row total-row">
                <span>Tổng thanh toán</span>
                <strong>{formatPrice(total_amount)}</strong>
              </div>
            </div>
          </section>

          <section className="checkout-right">
            <h2 className="checkout-title">Shipping & Payment</h2>

            <form className="checkout-form" onSubmit={onSubmitCheckout}>
              <div className="field-grid">
                <div className="field-group">
                  <label>Người nhận</label>
                  <input
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={onChangeInput}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div className="field-group">
                  <label>Số điện thoại</label>
                  <input
                    name="recipient_phone"
                    value={formData.recipient_phone}
                    onChange={onChangeInput}
                    placeholder="09xxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Số nhà, tên đường</label>
                <input
                  name="shipping_street"
                  value={formData.shipping_street}
                  onChange={onChangeInput}
                  placeholder="123 Lê Lợi"
                  required
                />
              </div>

              <div className="field-grid three-col">
                <div className="field-group">
                  <label>Phường/Xã</label>
                  <input
                    name="shipping_ward"
                    value={formData.shipping_ward}
                    onChange={onChangeInput}
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Quận/Huyện</label>
                  <input
                    name="shipping_district"
                    value={formData.shipping_district}
                    onChange={onChangeInput}
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Tỉnh/Thành phố</label>
                  <input
                    name="shipping_province"
                    value={formData.shipping_province}
                    onChange={onChangeInput}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Ghi chú</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={onChangeInput}
                  placeholder="Giao giờ hành chính..."
                  rows={3}
                />
              </div>

              <div className="field-group payment-group">
                <label>Phương thức thanh toán</label>
                <div className="payment-options">
                  <label className={formData.payment_method === "VNPAY" ? "pay-option active" : "pay-option"}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="VNPAY"
                      checked={formData.payment_method === "VNPAY"}
                      onChange={onChangeInput}
                    />
                    VNPAY
                  </label>
                  <label className={formData.payment_method === "COD" ? "pay-option active" : "pay-option"}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={formData.payment_method === "COD"}
                      onChange={onChangeInput}
                    />
                    COD
                  </label>
                </div>
              </div>

              <div className="summary-box desktop-only">
                <div className="summary-row">
                  <span>Tổng tiền hàng</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <strong>{formatPrice(shipping_fee)}</strong>
                </div>
                <div className="summary-row">
                  <span>Giảm giá coupon</span>
                  <strong>- {formatPrice(discount_amount)}</strong>
                </div>
                <div className="summary-row total-row">
                  <span>Tổng thanh toán</span>
                  <strong>{formatPrice(total_amount)}</strong>
                </div>
              </div>

              <button className="btn-checkout" type="submit">
                Thanh toán ngay
              </button>
            </form>
          </section>
        </div>
      </div>
    </PaymentLayout>
  );
}

export default Checkout;
