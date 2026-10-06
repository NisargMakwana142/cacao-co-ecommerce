import { Link } from "react-router-dom";

import { useCart } from "../context/useCart";
import { useAuth } from "../context/AuthContext";

function Header() {
  const {
    itemCount,
  } = useCart();

  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  return (
    <header className="site-header">

      <div className="header-container">

        <Link
          to="/"
          className="logo"
        >
          CACAO & CO.
        </Link>

        <nav className="main-nav">

          <Link to="/">
            HOME
          </Link>

          <Link to="/shop">
            SHOP
          </Link>

          <Link to="/#about">
            ABOUT
          </Link>

          <Link to="/#contact">
            CONTACT
          </Link>

        </nav>

        <div className="header-actions">

          <button
            className="search-button"
            type="button"
          >
            SEARCH
          </button>

          <Link
            to="/cart"
            className="cart-link"
          >
            CART

            {itemCount > 0 && (
              <span className="cart-count">
                {itemCount}
              </span>
            )}

          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="account-link"
            >
              ACCOUNT
            </Link>
          )}

          {isAuthenticated && (
            <div className="account-menu">

              <span className="account-name">
                {user?.name}
              </span>

              {!isAdmin && (
                <Link
                  to="/orders"
                  className="account-link"
                >
                  MY ORDERS
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="account-link"
                >
                  ADMIN
                </Link>
              )}

              <button
                type="button"
                className="logout-button"
                onClick={logout}
              >
                LOG OUT
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Header;