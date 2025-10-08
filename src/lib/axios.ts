// src/lib/axios.ts
import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig, AxiosError } from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send refresh token cookie
});

// Protected routes for auto redirect
const protectedRoutes = ["/vault", "/vent", "/reflections", "/dashboard"];

// REQUEST INTERCEPTOR
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    const axiosError = error as AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean }; response?: any };
    const originalRequest = axiosError.config;

    // Login error
    if (axiosError.response?.status === 401 && originalRequest?.url?.includes("/users/login")) {
      if (typeof window !== "undefined") {
        toast.error(axiosError.response?.data?.message || "Invalid credentials");
      }
      return Promise.reject(axiosError);
    }

    // Refresh token logic for other 401 errors
    if (
      axiosError.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/refresh-token") &&
      !originalRequest.url?.includes("/users/login") &&
      !originalRequest.url?.includes("/users/register") &&
      !originalRequest.url?.includes("/users/change-password")
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data?.message?.accessToken as string;
        if (newAccessToken) localStorage.setItem("accessToken", newAccessToken);

        if (!originalRequest.headers) originalRequest.headers = {} as AxiosRequestHeaders;
        (originalRequest.headers as AxiosRequestHeaders).Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshErr: unknown) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");

          if (protectedRoutes.includes(window.location.pathname)) {
            toast.error("Session expired. Please sign in again.");
            window.location.href = "/sign-in";
          }
        }
        return Promise.reject(refreshErr);
      }
    }

    // Network error
    if (typeof window !== "undefined" && !(axiosError as AxiosError).response) {
      toast.error("Network error. Please try again.");
      return Promise.reject(new Error("Network error. Please try again."));
    }

    if (axiosError.response?.data?.message) {
      return Promise.reject(new Error(axiosError.response.data.message));
    }

    // Fallback
    return Promise.reject(axiosError);
  }
);

export default API;
