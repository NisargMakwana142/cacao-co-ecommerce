import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const orderId =
    location.state?.orderId || "YOUR ORDER";

  return (
    <main className="order-success">

      <div className="success-content">

        <div className="success-icon">
          ✓
        </div>

        <p className="eyebrow">
          ORDER CONFIRMED
        </p>

        <h1>Thank You.</h1>

        <p>
          Your order has been received successfully.
        </p>

        <p className="order-number">
          Order: <strong>{orderId}</strong>
        </p>

        <Link
          to="/shop"
          className="checkout-button"
        >
          CONTINUE SHOPPING
        </Link>

      </div>

    </main>
  );
}

export default OrderSuccess;