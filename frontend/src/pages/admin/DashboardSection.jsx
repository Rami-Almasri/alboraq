import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign, FiShoppingBag, FiBox, FiUsers, FiAlertTriangle, FiTrendingUp, FiAward,
} from "react-icons/fi";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import { STATUSES } from "./OrdersSection";

const statusMeta = (v) => STATUSES.find((s) => s.value === v);

export default function DashboardSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-28" />)}
      </div>
    );

  if (!stats)
    return <div className="card p-10 text-center text-slate-400">تعذّر تحميل الإحصائيات</div>;

  const t = stats.totals;
  const maxRev = Math.max(...stats.revenue_series.map((s) => s.total), 1);
  const totalOrders = Object.values(stats.status_counts || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FiDollarSign />} label="إجمالي الإيرادات" value={`${formatPrice(t.revenue)} ل.س`} tone="from-emerald-500 to-emerald-600" />
        <StatCard icon={<FiShoppingBag />} label="الطلبات" value={t.orders} tone="from-brand-500 to-brand-700" />
        <StatCard icon={<FiBox />} label="المنتجات" value={t.products} tone="from-indigo-500 to-indigo-600" />
        <StatCard icon={<FiUsers />} label="العملاء" value={t.customers} tone="from-cyan-500 to-cyan-600" />
      </div>

      {/* Inventory alerts */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat icon={<FiBox />} label="منتجات مفعّلة" value={t.active_products} tone="text-emerald-600 bg-emerald-50" />
        <MiniStat icon={<FiAlertTriangle />} label="كمية محدودة (≤5)" value={t.low_stock} tone="text-amber-600 bg-amber-50" />
        <MiniStat icon={<FiAlertTriangle />} label="نفد المخزون" value={t.out_of_stock} tone="text-red-500 bg-red-50" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="mb-6 flex items-center gap-2 font-bold text-slate-800">
            <FiTrendingUp className="text-brand-500" /> الإيرادات آخر 6 أشهر
          </h3>
          <div className="flex h-52 items-end justify-between gap-2 sm:gap-4">
            {stats.revenue_series.map((s, i) => (
              <div key={s.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">
                  {s.total > 0 ? compact(s.total) : ""}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(s.total / maxRev) * 100}%` }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-accent"
                  style={{ minHeight: s.total > 0 ? 6 : 0 }}
                />
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="card p-6">
          <h3 className="mb-5 font-bold text-slate-800">حالات الطلبات</h3>
          <div className="space-y-3">
            {STATUSES.map((s) => {
              const count = stats.status_counts?.[s.value] || 0;
              const pct = Math.round((count / totalOrders) * 100);
              return (
                <div key={s.value}>
                  <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                    <span>{s.label}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${s.bar}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
            <FiAward className="text-amber-500" /> الأكثر مبيعاً
          </h3>
          {stats.top_products.length ? (
            <ol className="space-y-3">
              {stats.top_products.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-black ${i === 0 ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
                  <span className="line-clamp-1 flex-1 text-sm font-semibold text-slate-700">{p.name}</span>
                  <span className="shrink-0 rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600">{p.qty} مبيع</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">لا توجد مبيعات بعد</p>
          )}
        </div>

        {/* Recent orders */}
        <div className="card p-6">
          <h3 className="mb-4 font-bold text-slate-800">أحدث الطلبات</h3>
          {stats.recent_orders.length ? (
            <ul className="divide-y divide-slate-100">
              {stats.recent_orders.map((o) => {
                const m = statusMeta(o.status);
                return (
                  <li key={o.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-mono text-sm font-bold text-brand-700">{o.reference}</p>
                      <p className="text-xs text-slate-400">{o.customer_name || o.user?.name || "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{formatPrice(o.total)} ل.س</p>
                      {m && <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.tone}`}>{m.label}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">لا توجد طلبات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, tone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tone} p-5 text-white shadow-card`}
    >
      <div className="absolute -left-4 -top-4 text-7xl opacity-10">{icon}</div>
      <div className="relative">
        <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-white/20 text-xl">{icon}</div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs font-semibold text-white/80">{label}</p>
      </div>
    </motion.div>
  );
}

function MiniStat({ icon, label, value, tone }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className={`grid h-11 w-11 place-items-center rounded-xl text-lg ${tone}`}>{icon}</div>
      <div>
        <p className="text-xl font-black text-slate-800">{value}</p>
        <p className="text-xs font-semibold text-slate-400">{label}</p>
      </div>
    </div>
  );
}

// Compact currency for tight chart labels (e.g. 12.5M).
function compact(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(Math.round(n));
}
