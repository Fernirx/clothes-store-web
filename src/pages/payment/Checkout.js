import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  if (value === undefined || value === null) return "0 đ";
  return value.toLocaleString("vi-VN") + " đ";
};

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ Cart
  const cartItems = location.state?.cartItems || [];
  const selectedItemIds = location.state?.selectedItemIds || [];
  const totalAmount = location.state?.totalAmount || 0;

  const [formData, setFormData] = useState({
    recipient_name: "",
    recipient_phone: "",
    shipping_street: "",
    shipping_ward: "",
    shipping_district: "",
    shipping_province: "",
    note: "",
    coupon_code: "",
    payment_method: "COD"
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Lấy thông tin user từ localStorage nếu có
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setFormData(prev => ({
          ...prev,
          recipient_name: user.fullName || '',
          recipient_phone: user.phone || '',
        }));
      } catch (e) {
        console.error('Lỗi khi parse user info:', e);
      }
    }
  }, []);

  // Lọc những item được chọn từ cart
  const orderItems = useMemo(() => {
    return cartItems
      .filter(item => selectedItemIds.includes(item.id))
      .map((item) => {
        const price = item.price || item.unit_price || 0;
        const subtotal = price * (item.quantity || 1);
        return {
          ...item,
          subtotal,
          price: price,
          product_name: item.name || item.product_name || 'Sản phẩm',
          product_code: item.code || item.product_code || '',
          variant_size: item.size || item.variant_size || '',
          variant_color: item.color || item.variant_color || '',
          quantity: item.quantity || 1,
          image: item.image || 'https://via.placeholder.com/100'
        };
      });
  }, [cartItems, selectedItemIds]);

  const subtotal = useMemo(() => {
    const sum = orderItems.reduce((sum, item) => {
      return sum + (item.subtotal || 0);
    }, 0);
    return isNaN(sum) ? 0 : sum;
  }, [orderItems]);

  const shipping_fee = totalAmount > 0 ? 50000 : 0;
  const discount_amount = 0; // Tính từ coupon code nếu có
  const total_amount = subtotal + shipping_fee - discount_amount;

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi user sửa
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.recipient_name.trim()) newErrors.recipient_name = 'Vui lòng nhập tên';
    if (!formData.recipient_phone.trim()) newErrors.recipient_phone = 'Vui lòng nhập số điện thoại';
    if (!formData.shipping_street.trim()) newErrors.shipping_street = 'Vui lòng nhập địa chỉ';
    if (!formData.shipping_ward.trim()) newErrors.shipping_ward = 'Vui lòng nhập phường/xã';
    if (!formData.shipping_district.trim()) newErrors.shipping_district = 'Vui lòng nhập quận/huyện';
    if (!formData.shipping_province.trim()) newErrors.shipping_province = 'Vui lòng nhập tỉnh/thành phố';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitCheckout = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (selectedItemIds.length === 0) {
      alert('Không có sản phẩm nào để thanh toán');
      return;
    }

    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');

      const payload = {
        selectedCartItemIds: selectedItemIds,
        paymentMethod: formData.payment_method,
        recipientName: formData.recipient_name,
        recipientPhone: formData.recipient_phone,
        shippingStreet: formData.shipping_street,
        shippingWard: formData.shipping_ward,
        shippingDistrict: formData.shipping_district,
        shippingProvince: formData.shipping_province,
        couponeCode: formData.coupon_code || null,
        note: formData.note || null,
      };

      const response = await fetch(
        'https://clothes-api.fernirx.io.vn/api/clothes/orders/checkout-selected',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Tạo đơn hàng thất bại');
      }

      console.log('Tạo đơn hàng thành công:', result);

      // Chuyển sang trang thanh toán hoặc xác nhận đơn hàng
      const orderId = result.data?.id || result.data?.orderId;
      navigate("/payment/success", {
        state: {
          total_amount,
          payment_method: formData.payment_method,
          recipient_name: formData.recipient_name,
          order: result.data,
          orderId: orderId
        }
      });
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      alert(error.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
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
                <label>Mã giảm giá</label>
                <input
                  name="coupon_code"
                  value={formData.coupon_code}
                  onChange={onChangeInput}
                  placeholder="Nhập mã giảm giá (nếu có)"
                />
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

              <button className="btn-checkout" type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </PaymentLayout>
  );
}

export default Checkout;
