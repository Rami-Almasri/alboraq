import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiChevronDown } from "react-icons/fi";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import SmartImage from "../components/SmartImage";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";

const statusMap = {
  pending: { label: "قيد الانتظار", cls: "bg-amber-100 text-amber-700" },
  shipped: { label: "قيد الشحن", cls: "bg-blue-100 text-blue-700" },
  delivered: { label: "تم التسليم", cls: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "ملغي", cls: "bg-red-100 text-red-700" },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .get("/orders")
      .then((r) => setOrders(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user)
    return (
      <PageWrapper>
        <Empty title="سجّل الدخول لعرض طلباتك" cta="تسجيل الدخول" to="/login" />
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <div className="container-app py-10">
        <h1 className="mb-8 text-3xl font-black">طلباتي</h1>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="skeleton h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Empty title="لا توجد طلبات بعد" cta="ابدأ التسوق" to="/products" />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const st = statusMap[order.status] || statusMap.pending;
              const open = openId === order.id;
              const date = order.created_at
                ? new Date(order.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "";
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenId(open ? null : order.id)}
                    className="flex w-full items-center gap-4 p-5 text-right"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl text-brand-500">
                      <FiPackage />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{order.reference}</p>
                      <p className="text-xs text-slate-400">{date}</p>
                    </div>
                    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${st.cls}`}>
                      {st.label}
                    </span>
                    <div className="hidden text-left sm:block">
                      <p className="text-xs text-slate-400">الإجمالي</p>
                      <p className="font-extrabold text-brand-900">
                        {formatPrice(order.total)} ل.س
                      </p>
                    </div>
                    <FiChevronDown
                      className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="border-t border-black/5 bg-slate-50/50 p-5"
                    >
                      <div className="space-y-3">
                        {(order.items || []).map((it) => (
                          <div key={it.id} className="flex items-center gap-3">
                            <div className="h-14 w-14 shrink-0 rounded-lg bg-white p-1">
                              <SmartImage src={it.product?.image} alt={it.product_name} className="h-full w-full" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-700">{it.product_name}</p>
                              <p className="text-xs text-slate-400">الكمية: {it.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-brand-900">
                              {formatPrice(it.line_total)} ل.س
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-1 border-t border-dashed pt-4 text-sm sm:max-w-xs sm:mr-auto">
                        <Row label="المجموع الفرعي" value={`${formatPrice(order.subtotal)} ل.س`} />
                        <Row label="التوصيل" value={`${formatPrice(order.shipping)} ل.س`} />
                        {Number(order.discount) > 0 && (
                          <div className="flex items-center justify-between text-emerald-600">
                            <span>الخصم{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                            <span>− {formatPrice(order.discount)} ل.س</span>
                          </div>
                        )}
                        <Row label="الإجمالي" value={`${formatPrice(order.total)} ل.س`} bold />
                        {order.address && (
                          <p className="mt-2 text-xs text-slate-400">عنوان التوصيل: {order.address}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-black text-brand-900" : "text-slate-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Empty({ title, cta, to }) {
  return (
    <div className="container-app grid place-items-center py-28 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-50 text-4xl text-brand-500">
          <FiPackage />
        </div>
        <h2 className="mt-5 text-2xl font-black">{title}</h2>
        <Link to={to} className="btn-primary mt-6">{cta}</Link>
      </motion.div>
    </div>
  );
}
