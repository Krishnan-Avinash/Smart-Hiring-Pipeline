import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      sessionStorage.setItem(
        "globalSnackbar",
        "Session expired. Please login again."
      );

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;