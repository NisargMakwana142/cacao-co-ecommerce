import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/useCart";
import { useAuth } from "../context/AuthContext";

import { orderApi } from "../api/api";

function Checkout() {
  const {
    cart,
    subtotal,
    shipping,
    total,
    clearCart,
  } = useCart();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setForm((current) => ({
      ...current,
      name:
        current.name ||
        user?.name ||
        "",
      email:
        current.email ||
        user?.email ||
        "",
    }));
  }, [
    isAuthenticated,
    user,
  ]);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });

      return;
    }

    if (cart.length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const order =
        await orderApi.create({
          customerName:
            form.name,

          email:
            form.email,

          phone:
            form.phone,

          address:
            `${form.address}, ${form.city}, ${form.postalCode}`,

          items: cart.map(
            (item) => ({
              productId:
                Number(item.id),
              quantity:
                item.quantity,
            })
          ),
        });

      clearCart();

      navigate(
        "/order-success",
        {
          state: {
            orderId:
              order.id,
          },
        }
      );

    } catch (error) {
      console.error(
        "Failed to place order:",
        error
      );

      if (
        error.status === 401
      ) {
        setError(
          "Your session has expired. Please sign in again."
        );

        return;
      }

      if (
        error.status === 403
      ) {
        setError(
          "You are not allowed to place this order."
        );

        return;
      }

      if (
        error.status === 409
      ) {
        setError(
          error.message ||
            "Some products do not have enough stock."
        );

        return;
      }

      if (
        error.status === 400
      ) {
        setError(
          error.message ||
            "Please check your details and try again."
        );

        return;
      }

      setError(
        error.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="checkout-page">

        <div className="cart-empty">

          <h1>
            Sign In To Checkout
          </h1>

          <p>
            Please sign in to your Cacao & Co.
            account before placing an order.
          </p>

          <Link
            to="/login"
            state={{
              from: "/checkout",
            }}
          >
            SIGN IN
          </Link>

        </div>

      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page">

        <div className="cart-empty">

          <h1>
            Your cart is empty
          </h1>

          <Link to="/shop">
            Continue Shopping
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        <section>

          <p className="eyebrow">
            CHECKOUT
          </p>

          <h1>
            Complete Your Order
          </h1>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <form
            className="checkout-form"
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-group">

              <label>
                FULL NAME
              </label>

              <input
                type="text"
                name="name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  EMAIL
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  PHONE
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                ADDRESS
              </label>

              <textarea
                name="address"
                value={
                  form.address
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  CITY
                </label>

                <input
                  type="text"
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  POSTAL CODE
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={
                    form.postalCode
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="checkout-button"
              disabled={
                submitting
              }
            >
              {submitting
                ? "PLACING ORDER..."
                : "PLACE ORDER"}
            </button>

          </form>

        </section>

        <aside className="checkout-summary">

          <h2>
            YOUR ORDER
          </h2>

          {cart.map(
            (item) => (
              <div
                className="checkout-item"
                key={item.id}
              >

                <img
                  src={
                    item.image
                  }
                  alt={
                    item.name
                  }
                />

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    Qty:{" "}
                    {
                      item.quantity
                    }
                  </span>

                </div>

                <span>
                  ₹
                  {(
                    Number(
                      item.price
                    ) *
                    item.quantity
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>
            )
          )}

          <div className="summary-line">

            <span>
              Subtotal
            </span>

            <span>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

          <div className="summary-line">

            <span>
              Shipping
            </span>

            <span>
              {shipping === 0
                ? "FREE"
                : `₹${shipping}`}
            </span>

          </div>

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <p className="payment-note">
            Payment gateway can be
            connected here later.
          </p>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;