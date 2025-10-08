import axios, { AxiosRequestHeaders, AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Type for refresh token response
interface RefreshResponse {
  message: {
    accessToken: string;
  };
}

// Protected routes for auto redirect
const protectedRoutes = ["/vault", "/vent", "/reflections", "/dashboard"];

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Type guard for AxiosError
function isAxiosError<T = unknown>(err: unknown): err is AxiosError<T> {
  return (err as AxiosError<T>).isAxiosError !== undefined;
}

// Request interceptor
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

// Response interceptor
API.interceptors.response.use(
  (res) => res,
  async (err: unknown) => {
    const error = err as AxiosError<{ message?: string }> & {
      config?: InternalAxiosRequestConfig & { _retry?: boolean };
    };
    const originalRequest = error.config;

    // Login 401
    if (error.response?.status === 401 && originalRequest?.url?.includes("/users/login")) {
      if (typeof window !== "undefined") {
        toast.error(error.response.data?.message || "Invalid credentials");
      }
      return Promise.reject(error);
    }

    // Refresh token flow
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/refresh-token") &&
      !originalRequest.url?.includes("/users/login") &&
      !originalRequest.url?.includes("/users/register") &&
      !originalRequest.url?.includes("/users/change-password")
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post<RefreshResponse>(
          `${BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshRes.data.message.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

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
    if (typeof window !== "undefined" && !error.response) {
      toast.error("Network error. Please try again.");
      return Promise.reject(new Error("Network error. Please try again."));
    }

    // Backend error with message
    if (isAxiosError<{ message: string }>(error) && error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    return Promise.reject(error);
  }
);

export default API;
