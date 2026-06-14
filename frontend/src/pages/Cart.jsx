import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice, imgUrl } from "../utils/format";

export default function Cart() {
  const { items, total, updateQty, removeFromCart, refresh } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const shipping = total > 0 ? 25000 : 0;

  const checkout = async () => {
    if (!user) return navigate("/login");
    setPlacing(true);
    try {
      await api.post("/orders");
      await refresh();
      toast.success("تم تأكيد طلبك بنجاح! 🎉");
      navigate("/");
    } catch (e) {
      toast.error(e?.response?.data?.message || "تعذر إتمام الطلب");
    } finally {
      setPlacing(false);
    }
  };

  if (!items.length)
    return (
      <PageWrapper>
        <div className="container-app grid place-items-center py-28 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-50 text-4xl text-brand-500">
              <FiShoppingBag />
            </div>
            <h2 className="mt-5 text-2xl font-black">سلة التسوق فارغة</h2>
            <p className="mt-2 text-slate-500">لم تقم بإضافة أي منتجات بعد</p>
            <Link to="/products" className="btn-primary mt-6">ابدأ التسوق <FiArrowLeft /></Link>
          </motion.div>
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <div className="container-app py-10">
        <h1 className="mb-8 text-3xl font-black">سلة التسوق</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const p = item.product || {};
                return (
                  <motion.div
                    key={item.id || p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="card flex items-center gap-4 p-4"
                  >
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-slate-50 p-2">
                      <img src={imgUrl(p.image)} alt={p.name} className="max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/products/${p.slug}`} className="font-bold text-slate-800 hover:text-brand-500 line-clamp-1">
                        {p.name}
                      </Link>
                      <p className="text-sm text-slate-400">{p.category?.name}</p>
                      <p className="mt-1 font-extrabold text-brand-900">{formatPrice(p.price)} ل.س</p>
                    </div>
                    <div className="flex items-center rounded-xl border border-slate-200">
                      <button onClick={() => updateQty(p.id, Math.max(1, item.quantity - 1))} className="px-3 py-1.5 font-bold text-slate-600">−</button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(p.id, item.quantity + 1)} className="px-3 py-1.5 font-bold text-slate-600">+</button>
                    </div>
                    <button onClick={() => removeFromCart(p.id)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <FiTrash2 />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="h-fit lg:sticky lg:top-20">
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-black">ملخص الطلب</h3>
              <div className="space-y-3 text-sm">
                <Row label="المجموع الفرعي" value={`${formatPrice(total)} ل.س`} />
                <Row label="رسوم التوصيل" value={`${formatPrice(shipping)} ل.س`} />
                <div className="border-t border-dashed pt-3">
                  <Row label="الإجمالي" value={`${formatPrice(total + shipping)} ل.س`} bold />
                </div>
              </div>
              <button onClick={checkout} disabled={placing} className="btn-primary mt-6 w-full disabled:opacity-60">
                {placing ? "جارٍ التأكيد..." : "إتمام الطلب"}
              </button>
              <Link to="/products" className="mt-3 block text-center text-sm font-semibold text-brand-500 hover:underline">
                متابعة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-lg font-black text-brand-900" : "text-slate-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
