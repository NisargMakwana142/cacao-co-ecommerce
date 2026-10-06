import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/useCart";

function Cart() {
  const {
    cart,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">

          <p className="eyebrow">
            YOUR BAG
          </p>

          <h1>Your cart is empty</h1>

          <p>
            Discover something delicious from our collection.
          </p>

          <Link
            to="/shop"
            className="checkout-button"
          >
            SHOP CHOCOLATE
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        <div className="cart-main">

          <p className="eyebrow">YOUR BAG</p>

          <h1>Your Cart</h1>

          {cart.map((item) => (

            <div
              className="cart-item"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">

                <p className="product-category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                <p>
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </p>

                <div className="quantity-control">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove-button"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  REMOVE
                </button>

              </div>

              <strong>
                ₹
                {(
                  item.price * item.quantity
                ).toLocaleString("en-IN")}
              </strong>

            </div>

          ))}

        </div>

        <aside className="cart-summary">

          <h2>ORDER SUMMARY</h2>

          <div>
            <span>Subtotal</span>
            <span>
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div>
            <span>Shipping</span>
            <span>
              {shipping === 0
                ? "FREE"
                : `₹${shipping}`}
            </span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>

          <button
            className="checkout-button"
            onClick={() =>
              navigate("/checkout")
            }
          >
            PROCEED TO CHECKOUT
          </button>

        </aside>

      </div>

    </main>
  );
}

export default Cart;