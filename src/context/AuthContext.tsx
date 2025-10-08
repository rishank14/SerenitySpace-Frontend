"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import API from "@/lib/axios";
import { toast } from "sonner";

export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // refreshUser loading
  authLoading: boolean; // login/signup button loading
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Type for login/signup API response
interface AuthResponse {
  accessToken: string;
  user: User;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (identifier: string, password: string) => {
    setAuthLoading(true);
    try {
      const isEmail = identifier.includes("@");
      const body = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await API.post<{ message: AuthResponse }>("/users/login", body);
      const data = res.data.message;

      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      toast.success("Logged in successfully!");
    } catch (err: unknown) {
      let msg = "Invalid credentials";
      if (err && typeof err === "object" && "response" in err) {
        // Axios error structure
        // @ts-ignore
        msg = err.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      throw new Error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setAuthLoading(true);
    try {
      const res = await API.post<{ message: AuthResponse }>("/users/register", {
        username,
        email,
        password,
      });
      const data = res.data.message;

      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      toast.success("Account created successfully!");
    } catch (err: unknown) {
      let msg = "Signup failed";
      if (err && typeof err === "object" && "response" in err) {
        // Axios error structure
        // @ts-ignore
        msg = err.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      throw new Error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post("/users/logout");
    } catch {
      toast.error("Logout failed");
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      toast.success("Logged out successfully!");
    }
  };

  const refreshUser = async () => {
    setUser(null);
    try {
      const res = await API.get<{ message: User }>("/users/current-user");
      setUser(res.data.message);
    } catch {
      localStorage.removeItem("accessToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
