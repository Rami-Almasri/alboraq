import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) {
      setItems([]);
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const [cartRes, favRes] = await Promise.all([
        api.get("/cart"),
        api.get("/favorites"),
      ]);
      setItems(cartRes.data.data || []);
      setFavorites(favRes.data.data || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const requireAuth = () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return false;
    }
    return true;
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!requireAuth()) return;
    try {
      await api.post(`/cart/${productId}`, { quantity });
      await refresh();
      toast.success("تمت الإضافة إلى السلة");
    } catch (e) {
      toast.error(e?.response?.data?.message || "تعذر الإضافة إلى السلة");
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      await api.put(`/cart/${productId}`, { quantity });
      await refresh();
    } catch (e) {
      toast.error(e?.response?.data?.message || "خطأ");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      await refresh();
      toast.success("تم الحذف من السلة");
    } catch (e) {
      toast.error(e?.response?.data?.message || "خطأ");
    }
  };

  const toggleFavorite = async (productId) => {
    if (!requireAuth()) return;
    try {
      await api.post(`/favorites/${productId}`);
      await refresh();
    } catch (e) {
      toast.error(e?.response?.data?.message || "خطأ");
    }
  };

  const isFavorite = (productId) =>
    favorites.some((f) => f.product?.id === productId || f.product_id === productId);

  const count = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const total = items.reduce(
    (s, i) => s + (i.quantity || 0) * Number(i.product?.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        favorites,
        loading,
        count,
        total,
        addToCart,
        updateQty,
        removeFromCart,
        toggleFavorite,
        isFavorite,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
