import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath =
    location.state?.from || "/";

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login(
        form.email,
        form.password
      );

      if (response.role === "ADMIN") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate(redirectPath, {
          replace: true,
        });
      }

    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      if (error.status === 401) {
        setError(
          "Invalid email or password."
        );
      } else {
        setError(
          error.message ||
            "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        <div className="auth-heading">

          <p className="eyebrow">
            WELCOME BACK
          </p>

          <h1>
            Sign In
          </h1>

          <p>
            Sign in to your Cacao & Co. account.
          </p>

        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="auth-field">

            <label htmlFor="login-email">
              EMAIL
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

          </div>

          <div className="auth-field">

            <label htmlFor="login-password">
              PASSWORD
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "SIGNING IN..."
              : "SIGN IN"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            CREATE ACCOUNT
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Login;