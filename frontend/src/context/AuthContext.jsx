import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/login", payload);
      persist(data.data.token, data.data.user);
      toast.success("تم تسجيل الدخول بنجاح");
      return true;
    } catch (e) {
      toast.error(e?.response?.data?.message || "فشل تسجيل الدخول");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/register", payload);
      persist(data.data.token, data.data.user);
      toast.success("تم إنشاء الحساب بنجاح");
      return true;
    } catch (e) {
      toast.error(e?.response?.data?.message || "فشل إنشاء الحساب");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      /* ignore */
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("تم تسجيل الخروج");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
