import HomeTopbar from "../../components/HomeTopbar";
import "./PaymentLayout.css";
import "./PaymentResult.css";

function PaymentLayout({ children }) {
  return (
    <div className="payment-layout">
      <HomeTopbar />

      <main className="payment-main">{children}</main>
    </div>
  );
}

export default PaymentLayout;
