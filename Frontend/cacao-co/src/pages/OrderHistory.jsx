import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  orderApi,
} from "../api/api";

function OrderHistory() {
  const {
    isAuthenticated,
  } = useAuth();

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadOrders =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await orderApi.getMyOrders();

          setOrders(
            Array.isArray(data)
              ? data
              : []
          );

        } catch (error) {
          console.error(
            "Failed to load orders:",
            error
          );

          if (
            error.status === 401
          ) {
            setError(
              "Your session has expired. Please sign in again."
            );
          } else {
            setError(
              error.message ||
                "Unable to load your orders."
            );
          }
        } finally {
          setLoading(false);
        }
      };

    loadOrders();
  }, [
    isAuthenticated,
  ]);

  if (loading) {
    return (
      <main className="orders-page">

        <div className="orders-container">

          <p className="eyebrow">
            YOUR ACCOUNT
          </p>

          <h1>
            My Orders
          </h1>

          <p>
            Loading your orders...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="orders-page">

      <div className="orders-container">

        <div className="orders-heading">

          <div>
            <p className="eyebrow">
              YOUR ACCOUNT
            </p>

            <h1>
              My Orders
            </h1>
          </div>

          <Link to="/shop">
            CONTINUE SHOPPING
          </Link>

        </div>

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {!error &&
          orders.length === 0 && (
            <div className="orders-empty">

              <h2>
                No orders yet
              </h2>

              <p>
                Your chocolate journey starts here.
              </p>

              <Link to="/shop">
                SHOP CHOCOLATE
              </Link>

            </div>
          )}

        {orders.length > 0 && (
          <div className="orders-list">

            {orders.map(
              (order) => (
                <article
                  className="order-card"
                  key={order.id}
                >

                  <div className="order-card-header">

                    <div>
                      <span>
                        ORDER
                      </span>

                      <strong>
                        #{order.id}
                      </strong>
                    </div>

                    <span
                      className={`order-status status-${String(
                        order.status || ""
                      ).toLowerCase()}`}
                    >
                      {order.status}
                    </span>

                  </div>

                  <div className="order-card-body">

                    <div className="order-info">

                      <span>
                        DATE
                      </span>

                      <strong>
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </strong>

                    </div>

                    <div className="order-info">

                      <span>
                        ITEMS
                      </span>

                      <strong>
                        {order.items?.reduce(
                          (
                            total,
                            item
                          ) =>
                            total +
                            Number(
                              item.quantity ||
                                0
                            ),
                          0
                        ) || 0}
                      </strong>

                    </div>

                    <div className="order-info">

                      <span>
                        TOTAL
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.totalAmount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  </div>

                  <div className="order-products">

                    {order.items?.map(
                      (item) => (
                        <div
                          className="order-product"
                          key={
                            item.id
                          }
                        >

                          <span>
                            {
                              item.productName
                            }
                          </span>

                          <span>
                            ×{" "}
                            {
                              item.quantity
                            }
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </div>

    </main>
  );
}

export default OrderHistory;