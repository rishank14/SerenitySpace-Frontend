// src/lib/axios.ts
import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner"; // client-side toast

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // for sending refresh token cookie
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
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/refresh-token")
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
      } catch (refreshErr) {
        // ✅ If refresh fails, logout + show toast + redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");

          setTimeout(() => {
            toast.error("Session expired. Please sign in again.");
            window.location.href = "/sign-in";
          }, 100);
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
