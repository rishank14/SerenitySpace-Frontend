// src/lib/axios.ts
import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookies ke liye
});

// REQUEST INTERCEPTOR
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Fix TS error: ensure headers exist
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;

      // Add Authorization header
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// RESPONSE INTERCEPTOR (Refresh Token)
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
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
