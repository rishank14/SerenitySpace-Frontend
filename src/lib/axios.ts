// src/lib/axios.ts
import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send refresh token cookie
});

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
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes("/users/login")
    ) {
      if (typeof window !== "undefined") {
        toast.error(error.response?.data?.message || "Invalid credentials");
      }
      return Promise.reject(error);
    }

    // Refresh token logic for other 401 errors
    if (
      error.response?.status === 401 &&
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

        const newAccessToken = refreshRes.data.message.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        if (!originalRequest.headers) originalRequest.headers = {} as AxiosRequestHeaders;
        (originalRequest.headers as AxiosRequestHeaders).Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshErr: any) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          if (window.location.pathname !== "/sign-in") {
            toast.error("Session expired. Please sign in again.");
            window.location.href = "/sign-in";
          }
        }
        return Promise.reject(refreshErr);
      }
    }

    // Network error
    if (typeof window !== "undefined" && !error.response) {
      toast.error("Network error. Please try again.");
      return Promise.reject(new Error("Network error. Please try again."));
    }

    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    // Fallback
    return Promise.reject(error);
  }
);

export default API;
