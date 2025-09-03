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

interface User {
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
      const body = isEmail ? { email: identifier, password } : { username: identifier, password };

      const res = await API.post("/users/login", body);
      const { accessToken, user } = res.data.message;

      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      toast.success("Logged in successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid credentials";
      throw new Error(msg); // <-- important: propagate backend message
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setAuthLoading(true);
    try {
      const res = await API.post("/users/register", { username, email, password });
      const { accessToken, user } = res.data.message;

      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      toast.success("Account created successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Signup failed";
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
    try {
      const res = await API.get("/users/current-user");
      setUser(res.data.message);
    } catch {
      setUser(null);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
