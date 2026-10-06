
const API_BASE_URL =
  "http://localhost:8080/api";

async function request(
  endpoint,
  options = {}
) {

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers || {}),
        },
      }
    );

  const data =
    await response
      .json()
      .catch(() => null);

  if (!response.ok) {

    const error =
      new Error(
        data?.message ||
          "Authentication request failed"
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }

  return data;
}

export const authApi = {

  register(data) {

    return request(
      "/auth/register",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      }
    );
  },

  login(data) {

    return request(
      "/auth/login",
      {
        method: "POST",

        body:
          JSON.stringify(data),
      }
    );
  },
};
