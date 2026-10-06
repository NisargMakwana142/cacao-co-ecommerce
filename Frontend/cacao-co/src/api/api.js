
const API_BASE_URL =
  "http://localhost:8080/api";

const AUTH_STORAGE_KEY =
  "cacao_auth";

function getAuthToken() {

  try {

    const storedAuth =
      localStorage.getItem(
        AUTH_STORAGE_KEY
      );

    if (!storedAuth) {
      return null;
    }

    const auth =
      JSON.parse(storedAuth);

    return auth?.token || null;

  } catch {

    return null;
  }
}

function handleUnauthorized() {

  localStorage.removeItem(
    AUTH_STORAGE_KEY
  );

  window.dispatchEvent(
    new CustomEvent(
      "cacao-auth-expired"
    )
  );
}

async function request(
  endpoint,
  options = {}
) {

  const token =
    getAuthToken();

  const headers = {
    "Content-Type":
      "application/json",

    ...(options.headers || {}),
  };

  /*
   * Every authenticated request gets:
   *
   * Authorization: Bearer <JWT>
   */
  if (token) {

    headers.Authorization =
      `Bearer ${token}`;
  }

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

  const data =
    await response
      .json()
      .catch(() => null);

  if (!response.ok) {

    if (
      response.status === 401
    ) {

      handleUnauthorized();
    }

    const error =
      new Error(
        data?.message ||
          "Something went wrong"
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }

  return data;
}

export const productApi = {

  getAll() {

    return request(
      "/products"
    );
  },

  getById(id) {

    return request(
      `/products/${id}`
    );
  },

  create(product) {

    return request(
      "/products",
      {
        method: "POST",

        body:
          JSON.stringify(product),
      }
    );
  },

  update(id, product) {

    return request(
      `/products/${id}`,
      {
        method: "PUT",

        body:
          JSON.stringify(product),
      }
    );
  },

  delete(id) {

    return request(
      `/products/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};

export const orderApi = {

  create(order) {

    return request(
      "/orders",
      {
        method: "POST",

        body:
          JSON.stringify(order),
      }
    );
  },

  getAll() {

    return request(
      "/orders"
    );
  },

  getMyOrders() {

    return request(
      "/orders/my"
    );
  },

  getById(id) {

    return request(
      `/orders/${id}`
    );
  },

  updateStatus(
    id,
    status
  ) {

    return request(
      `/orders/${id}/status?status=${encodeURIComponent(
        status
      )}`,
      {
        method: "PUT",
      }
    );
  },
};

