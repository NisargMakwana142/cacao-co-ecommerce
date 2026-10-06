import { useNavigate } from "react-router-dom";

import { useProducts } from "../context/useProducts";
import { useCart } from "../context/useCart";

function Shop() {
  const { products } =
    useProducts();

  const { addToCart } =
    useCart();

  const navigate =
    useNavigate();

  const handleAddToCart = (
    product
  ) => {
    if (product.stock <= 0) {
      alert(
        "This product is currently out of stock."
      );

      return;
    }

    addToCart(product);
  };

  const handleBuyNow = (
    product
  ) => {
    if (product.stock <= 0) {
      alert(
        "This product is currently out of stock."
      );

      return;
    }

    addToCart(product);

    navigate("/checkout");
  };

  return (
    <main className="shop-page">

      <section className="shop-hero">

        <p className="eyebrow">
          THE COLLECTION
        </p>

        <h1>
          OUR CHOCOLATE
        </h1>

        <p>
          Discover carefully crafted
          chocolate made from exceptional
          cacao.
        </p>

      </section>

      <section className="shop-products">

        <div className="products-grid">

          {products.map(
            (product) => (
              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image-wrapper">

                  {product.isNew && (
                    <span className="product-badge">
                      NEW
                    </span>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />

                </div>

                <div className="product-info">

                  <p className="product-category">
                    {product.category}
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-price">
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p className="product-stock">
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </p>

                  <div className="product-actions">

                    <button
                      className="add-cart-button"
                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }
                      disabled={
                        product.stock <=
                        0
                      }
                    >
                      ADD TO CART
                    </button>

                    <button
                      className="buy-button"
                      onClick={() =>
                        handleBuyNow(
                          product
                        )
                      }
                      disabled={
                        product.stock <=
                        0
                      }
                    >
                      BUY NOW
                    </button>

                  </div>

                </div>

              </article>
            )
          )}

        </div>

      </section>

    </main>
  );
}

export default Shop;