import { useEffect, useState } from "react";

import { useProducts } from "../context/useProducts";
import { orderApi } from "../api/api";

const CATEGORY_OPTIONS = [
  {
    value: "DARK_CHOCOLATE",
    label: "DARK CHOCOLATE",
  },
  {
    value: "MILK_CHOCOLATE",
    label: "MILK CHOCOLATE",
  },
  {
    value: "SINGLE_ORIGIN",
    label: "SINGLE ORIGIN",
  },
  {
    value: "GIFT_COLLECTION",
    label: "GIFT COLLECTIONS",
  },
];

const ORDER_STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "PROCESSING",
    label: "Processing",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

function getCategoryLabel(category) {
  const found = CATEGORY_OPTIONS.find(
    (option) => option.value === category
  );

  return found
    ? found.label
    : category;
}

function getOrderStatusLabel(status) {
  const found =
    ORDER_STATUS_OPTIONS.find(
      (option) => option.value === status
    );

  return found
    ? found.label
    : status;
}

function Admin() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "DARK_CHOCOLATE",
    price: "",
    stock: "",
    image: "",
    isNew: false,
  });

  const [imageName, setImageName] =
    useState("");

  const [orders, setOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(true);

  const [ordersError, setOrdersError] =
    useState(null);

  const [savingOrderStatus, setSavingOrderStatus] =
    useState(null);

  const [savingProduct, setSavingProduct] =
    useState(false);

  const [deletingProductId, setDeletingProductId] =
    useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const data =
        await orderApi.getAll();

      setOrders(data);
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error
      );

      setOrdersError(
        error.message ||
          "Failed to load orders"
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "DARK_CHOCOLATE",
      price: "",
      stock: "",
      image: "",
      isNew: false,
    });

    setImageName("");
    setEditingId(null);
  };

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImageUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageName(file.name);

    const reader =
      new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert(
        "Please enter a product name."
      );

      return;
    }

    if (
      !form.price ||
      Number(form.price) <= 0
    ) {
      alert(
        "Please enter a valid price."
      );

      return;
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      alert(
        "Stock cannot be negative."
      );

      return;
    }

    if (!form.image) {
      alert(
        "Please upload a product image."
      );

      return;
    }

    try {
      setSavingProduct(true);

      if (editingId !== null) {
        await updateProduct(
          editingId,
          form
        );

        alert(
          "Product updated successfully."
        );
      } else {
        await addProduct(form);

        alert(
          "Product added successfully."
        );
      }

      resetForm();
    } catch (error) {
      console.error(
        "Failed to save product:",
        error
      );

      alert(
        error.message ||
          "Failed to save product."
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      isNew: Boolean(product.isNew),
    });

    setImageName("Current image");

    setActiveTab("products");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(id);

      await deleteProduct(id);

      if (editingId === id) {
        resetForm();
      }

      alert(
        "Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      alert(
        error.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setSavingOrderStatus(orderId);

      const updatedOrder =
        await orderApi.updateStatus(
          orderId,
          status
        );

      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (order) =>
              order.id === orderId
                ? updatedOrder
                : order
          )
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      alert(
        error.message ||
          "Failed to update order status."
      );
    } finally {
      setSavingOrderStatus(null);
    }
  };

  const revenue =
    orders.reduce(
      (total, order) =>
        total +
        Number(
          order.totalAmount || 0
        ),
      0
    );

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock) <= 5
    );

  return (
    <main className="admin-page">

      <aside className="admin-sidebar">

        <div className="admin-logo">
          CACAO & CO.
          <span>
            ADMIN
          </span>
        </div>

        <nav className="admin-nav">

          <button
            className={
              activeTab ===
              "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "dashboard"
              )
            }
          >
            DASHBOARD
          </button>

          <button
            className={
              activeTab ===
              "products"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "products"
              )
            }
          >
            PRODUCTS
          </button>

          <button
            className={
              activeTab ===
              "orders"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "orders"
              )
            }
          >
            ORDERS
          </button>

        </nav>

      </aside>

      <section className="admin-content">

        <header className="admin-header">

          <div>

            <p className="eyebrow">
              CACAO & CO.
            </p>

            <h1>
              {activeTab ===
                "dashboard" &&
                "Dashboard"}

              {activeTab ===
                "products" &&
                "Products"}

              {activeTab ===
                "orders" &&
                "Orders"}
            </h1>

          </div>

        </header>

        {activeTab ===
          "dashboard" && (
          <section>

            <div className="admin-stats">

              <div className="admin-stat">

                <span>
                  PRODUCTS
                </span>

                <strong>
                  {products.length}
                </strong>

              </div>

              <div className="admin-stat">

                <span>
                  ORDERS
                </span>

                <strong>
                  {orders.length}
                </strong>

              </div>

              <div className="admin-stat">

                <span>
                  REVENUE
                </span>

                <strong>
                  ₹
                  {revenue.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div className="admin-stat">

                <span>
                  LOW STOCK
                </span>

                <strong>
                  {
                    lowStockProducts.length
                  }
                </strong>

              </div>

            </div>

            <div className="admin-panel">

              <div className="panel-heading">

                <h2>
                  Recent Orders
                </h2>

                <button
                  onClick={() =>
                    setActiveTab(
                      "orders"
                    )
                  }
                >
                  VIEW ALL
                </button>

              </div>

              {ordersLoading ? (
                <p className="empty-admin">
                  Loading orders...
                </p>
              ) : ordersError ? (
                <p className="empty-admin">
                  {ordersError}
                </p>
              ) : orders.length ===
                0 ? (
                <p className="empty-admin">
                  No orders yet.
                </p>
              ) : (
                <div className="admin-orders-list">

                  {orders
                    .slice(0, 5)
                    .map(
                      (order) => (
                        <div
                          className="admin-order-row"
                          key={
                            order.id
                          }
                        >

                          <div>

                            <strong>
                              #{order.id}
                            </strong>

                            <span>
                              {
                                order.customerName
                              }
                            </span>

                          </div>

                          <strong>
                            ₹
                            {Number(
                              order.totalAmount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <span>
                            {
                              getOrderStatusLabel(
                                order.status
                              )
                            }
                          </span>

                        </div>
                      )
                    )}

                </div>
              )}

            </div>

          </section>
        )}

        {activeTab ===
          "products" && (
          <section>

            <div className="admin-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    {editingId !== null
                      ? "Edit Product"
                      : "Add New Product"}
                  </h2>

                  <p>
                    Products added here
                    appear automatically
                    in the Shop.
                  </p>

                </div>

              </div>

              <form
                className="admin-product-form"
                onSubmit={
                  handleSubmit
                }
              >

                <div className="image-upload-area">

                  {form.image ? (
                    <img
                      src={
                        form.image
                      }
                      alt="Product preview"
                      className="admin-image-preview"
                    />
                  ) : (
                    <div className="image-placeholder">
                      UPLOAD IMAGE
                    </div>
                  )}

                  <label className="upload-button">

                    CHOOSE IMAGE

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageUpload
                      }
                      hidden
                    />

                  </label>

                  {imageName && (
                    <small>
                      {imageName}
                    </small>
                  )}

                </div>

                <div className="admin-form-fields">

                  <div className="admin-field">

                    <label>
                      PRODUCT NAME
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Ecuador 72% Dark Chocolate"
                      value={
                        form.name
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="admin-field">

                    <label>
                      CATEGORY
                    </label>

                    <select
                      name="category"
                      value={
                        form.category
                      }
                      onChange={
                        handleChange
                      }
                    >

                      {CATEGORY_OPTIONS.map(
                        (category) => (
                          <option
                            key={
                              category.value
                            }
                            value={
                              category.value
                            }
                          >
                            {
                              category.label
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="admin-field">

                    <label>
                      PRICE (₹)
                    </label>

                    <input
                      type="number"
                      name="price"
                      min="0.01"
                      step="0.01"
                      value={
                        form.price
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="admin-field">

                    <label>
                      STOCK
                    </label>

                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={
                        form.stock
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <label className="new-product-toggle">

                    <input
                      type="checkbox"
                      name="isNew"
                      checked={
                        form.isNew
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <span>
                      Mark as NEW
                      PRODUCT
                    </span>

                  </label>

                  <div className="admin-form-buttons">

                    <button
                      type="submit"
                      className="admin-primary-button"
                      disabled={
                        savingProduct
                      }
                    >
                      {savingProduct
                        ? "SAVING..."
                        : editingId !== null
                        ? "UPDATE PRODUCT"
                        : "ADD PRODUCT"}
                    </button>

                    {editingId !== null && (
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={
                          resetForm
                        }
                        disabled={
                          savingProduct
                        }
                      >
                        CANCEL
                      </button>
                    )}

                  </div>

                </div>

              </form>

            </div>

            <div className="admin-panel">

              <div className="panel-heading">

                <h2>
                  All Products
                </h2>

                <span>
                  {
                    products.length
                  }{" "}
                  products
                </span>

              </div>

              <div className="admin-products-list">

                {products.map(
                  (product) => (
                    <div
                      className="admin-product-row"
                      key={
                        product.id
                      }
                    >

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                      />

                      <div className="admin-product-details">

                        <strong>
                          {
                            product.name
                          }
                        </strong>

                        <span>
                          {getCategoryLabel(
                            product.category
                          )}
                        </span>

                      </div>

                      <div className="admin-product-price">

                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </div>

                      <div className="admin-stock">

                        Stock:{" "}
                        {
                          product.stock
                        }

                      </div>

                      <div className="admin-product-actions">

                        <button
                          onClick={() =>
                            handleEdit(
                              product
                            )
                          }
                          disabled={
                            deletingProductId !==
                            null
                          }
                        >
                          EDIT
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          disabled={
                            deletingProductId ===
                            product.id
                          }
                        >
                          {deletingProductId ===
                          product.id
                            ? "DELETING..."
                            : "DELETE"}
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </section>
        )}

        {activeTab ===
          "orders" && (
          <section>

            <div className="admin-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    Customer Orders
                  </h2>

                  <p>
                    Manage orders placed
                    by customers.
                  </p>

                </div>

                <button
                  onClick={
                    loadOrders
                  }
                  disabled={
                    ordersLoading
                  }
                >
                  {ordersLoading
                    ? "LOADING..."
                    : "REFRESH"}
                </button>

              </div>

              {ordersLoading ? (
                <p className="empty-admin">
                  Loading orders...
                </p>
              ) : ordersError ? (
                <p className="empty-admin">
                  {ordersError}
                </p>
              ) : orders.length ===
                0 ? (
                <p className="empty-admin">
                  No orders have been
                  placed yet.
                </p>
              ) : (
                <div className="admin-order-list">

                  {orders.map(
                    (order) => (
                      <div
                        className="admin-order-card"
                        key={
                          order.id
                        }
                      >

                        <div className="order-card-header">

                          <div>

                            <strong>
                              #{order.id}
                            </strong>

                            <span>
                              {order.createdAt
                                ? new Date(
                                    order.createdAt
                                  ).toLocaleString()
                                : ""}
                            </span>

                          </div>

                          <select
                            value={
                              order.status
                            }
                            disabled={
                              savingOrderStatus ===
                              order.id
                            }
                            onChange={(
                              event
                            ) =>
                              handleOrderStatus(
                                order.id,
                                event
                                  .target
                                  .value
                              )
                            }
                          >

                            {ORDER_STATUS_OPTIONS.map(
                              (status) => (
                                <option
                                  key={
                                    status.value
                                  }
                                  value={
                                    status.value
                                  }
                                >
                                  {
                                    status.label
                                  }
                                </option>
                              )
                            )}

                          </select>

                        </div>

                        <div className="order-customer">

                          <strong>
                            Customer
                          </strong>

                          <span>
                            {
                              order.customerName
                            }
                          </span>

                          <span>
                            {
                              order.email
                            }
                          </span>

                          <span>
                            {
                              order.phone
                            }
                          </span>

                          <span>
                            {
                              order.address
                            }
                          </span>

                        </div>

                        <div className="order-products">

                          {order.items?.map(
                            (item) => (
                              <div
                                key={
                                  item.id
                                }
                                className="order-product"
                              >

                                <img
                                  src={
                                    item.product
                                      ?.image
                                  }
                                  alt={
                                    item.productName
                                  }
                                />

                                <div>

                                  <strong>
                                    {
                                      item.productName
                                    }
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
                                  {Number(
                                    item.subtotal ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>

                              </div>
                            )
                          )}

                        </div>

                        <div className="order-total">

                          <span>
                            Order Total
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
                    )
                  )}

                </div>
              )}

            </div>

          </section>
        )}

      </section>

    </main>
  );
}

export default Admin;