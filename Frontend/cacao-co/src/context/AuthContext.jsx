import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "cacao_auth";

function readStoredAuth() {
  try {
    const storedAuth =
      localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) {
      return null;
    }

    const parsedAuth =
      JSON.parse(storedAuth);

    if (
      !parsedAuth ||
      typeof parsedAuth !== "object" ||
      !parsedAuth.token
    ) {
      return null;
    }

    return parsedAuth;

  } catch (error) {
    console.error(
      "Failed to read stored authentication:",
      error
    );

    return null;
  }
}

function saveAuth(authData) {
  if (!authData?.token) {
    return;
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(authData)
  );
}

function removeAuth() {
  localStorage.removeItem(
    AUTH_STORAGE_KEY
  );
}

export function AuthProvider({
  children,
}) {
  const [auth, setAuth] = useState(() => {
    return readStoredAuth();
  });

  /*
   * Re-read authentication from localStorage.
   *
   * This is intentionally kept separate from the
   * login/register functions so the application can
   * recover the session even if React state was reset.
   */
  const syncAuth = () => {
    const storedAuth =
      readStoredAuth();

    setAuth(storedAuth);

    return storedAuth;
  };

  const login = async (
    email,
    password
  ) => {
    const response =
      await authApi.login({
        email,
        password,
      });

    if (!response?.token) {
      throw new Error(
        "Login succeeded but the server did not return an authentication token."
      );
    }

    saveAuth(response);

    setAuth(response);

    return response;
  };

  const register = async (
    name,
    email,
    password
  ) => {
    const response =
      await authApi.register({
        name,
        email,
        password,
      });

    if (!response?.token) {
      throw new Error(
        "Registration succeeded but the server did not return an authentication token."
      );
    }

    saveAuth(response);

    setAuth(response);

    return response;
  };

  const logout = () => {
    removeAuth();

    setAuth(null);
  };

  useEffect(() => {
    /*
     * Synchronize if localStorage changes in another tab.
     */
    const handleStorageChange = (
      event
    ) => {
      if (
        event.key === AUTH_STORAGE_KEY
      ) {
        syncAuth();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    /*
     * Synchronize whenever the browser tab
     * becomes active again.
     */
    const handleFocus = () => {
      syncAuth();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    /*
     * api.js dispatches this event when the
     * backend actually returns HTTP 401.
     */
    const handleAuthExpired = () => {
      removeAuth();
      setAuth(null);
    };

    window.addEventListener(
      "cacao-auth-expired",
      handleAuthExpired
    );

    /*
     * Make sure the state matches localStorage
     * after the provider has mounted.
     */
    syncAuth();

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "cacao-auth-expired",
        handleAuthExpired
      );
    };
  }, []);

  /*
   * IMPORTANT:
   *
   * The stored authentication is the source of truth.
   *
   * If React state somehow becomes null while the
   * browser still has a valid cacao_auth object,
   * recover it immediately.
   */
  const storedAuth =
    auth || readStoredAuth();

  const isAuthenticated =
    Boolean(
      storedAuth?.token
    );

  const isAdmin =
    storedAuth?.role === "ADMIN";

  const isCustomer =
    storedAuth?.role === "CUSTOMER";

  const user =
    storedAuth
      ? {
          id:
            storedAuth.userId,

          name:
            storedAuth.name,

          email:
            storedAuth.email,

          role:
            storedAuth.role,
        }
      : null;

  return (
    <AuthContext.Provider
      value={{
        auth:
          storedAuth,

        user,

        token:
          storedAuth?.token || null,

        isAuthenticated,

        isAdmin,

        isCustomer,

        login,

        register,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}