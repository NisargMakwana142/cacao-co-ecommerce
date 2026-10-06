import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  ProductProvider,
} from "./context/ProductContext";

import {
  CartProvider,
} from "./context/CartContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderHistory from "./pages/OrderHistory";

import "./App.css";
import "./Auth.css";
import "./pages/OrderHistory.css";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <ProductProvider>

          <CartProvider>

            <Header />

            <Routes>

              <Route
                path="/"
                element={
                  <Home />
                }
              />

              <Route
                path="/shop"
                element={
                  <Shop />
                }
              />

              <Route
                path="/cart"
                element={
                  <Cart />
                }
              />

              <Route
                path="/checkout"
                element={
                  <Checkout />
                }
              />

              <Route
                path="/order-success"
                element={
                  <OrderSuccess />
                }
              />

              <Route
                path="/login"
                element={
                  <Login />
                }
              />

              <Route
                path="/register"
                element={
                  <Register />
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />

            </Routes>

            <Footer />

          </CartProvider>

        </ProductProvider>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;