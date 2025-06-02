import axios from "axios";
import { toast } from "sonner";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Helper function to get JWT token from localStorage
const getJwtToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Helper function to set JWT token in localStorage
export const setJwtToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

// Helper function to remove JWT token from localStorage
export const removeJwtToken = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
};

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getJwtToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for financial data validation and error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // Handle unauthorized access - redirect to login
      removeJwtToken();
      if (window.location.pathname !== "/auth/login") {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/auth/login";
      }
    } else if (response?.status === 403) {
      toast.error(
        "Access denied. You don't have permission to perform this action."
      );
    } else if (response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (response?.status === 429) {
      toast.error("Too many requests. Please wait before trying again.");
    } else if (!response) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
