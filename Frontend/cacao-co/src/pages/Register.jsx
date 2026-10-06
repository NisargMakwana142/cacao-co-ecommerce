import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    setError("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    try {
      setLoading(true);

      await register(
        form.name,
        form.email,
        form.password
      );

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      setError(
        error.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        <div className="auth-heading">

          <p className="eyebrow">
            CACAO & CO.
          </p>

          <h1>
            Create Account
          </h1>

          <p>
            Join us and discover exceptional chocolate.
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

            <label htmlFor="register-name">
              FULL NAME
            </label>

            <input
              id="register-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />

          </div>

          <div className="auth-field">

            <label htmlFor="register-email">
              EMAIL
            </label>

            <input
              id="register-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

          </div>

          <div className="auth-field">

            <label htmlFor="register-password">
              PASSWORD
            </label>

            <input
              id="register-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
            />

          </div>

          <div className="auth-field">

            <label htmlFor="register-confirm-password">
              CONFIRM PASSWORD
            </label>

            <input
              id="register-confirm-password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
            />

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "CREATING ACCOUNT..."
              : "CREATE ACCOUNT"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            SIGN IN
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Register;