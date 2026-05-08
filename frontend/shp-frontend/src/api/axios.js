import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
});

// ✅ REQUEST INTERCEPTOR (ADD TOKEN HERE)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or wherever you store it

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR (YOUR EXISTING LOGIC)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.log("Session expired. Redirecting...");
        localStorage.removeItem("token"); // optional cleanup
        window.location.href = "/";
      }

      // keep 403 handling as-is
    }

    return Promise.reject(error);
  }
);

export default api;