import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiSearch, FiEye, FiTrash2, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import { Modal, ConfirmDialog, SectionHeader, EmptyRow, SkeletonRows } from "./ui";

export const STATUSES = [
  { value: "pending", label: "قيد الانتظار", tone: "bg-amber-100 text-amber-700", bar: "bg-amber-400" },
  { value: "processing", label: "قيد التجهيز", tone: "bg-blue-100 text-blue-700", bar: "bg-blue-400" },
  { value: "shipped", label: "تم الشحن", tone: "bg-indigo-100 text-indigo-700", bar: "bg-indigo-400" },
  { value: "delivered", label: "تم التسليم", tone: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-400" },
  { value: "cancelled", label: "ملغي", tone: "bg-red-100 text-red-600", bar: "bg-red-400" },
];

const statusMeta = (v) => STATUSES.find((s) => s.value === v) || STATUSES[0];

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/orders", { params: { search, status, per_page: 50 } });
      setOrders(data.data?.data || data.data || []);
    } catch {
      toast.error("تعذّر تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const changeStatus = async (order, value) => {
    const prev = order.status;
    setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: value } : o)));
    try {
      await api.put(`/admin/orders/${order.id}`, { status: value });
      toast.success("تم تحديث حالة الطلب");
    } catch {
      toast.error("فشل التحديث");
      setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: prev } : o)));
    }
  };

  const remove = async (o) => {
    try {
      await api.delete(`/admin/orders/${o.id}`);
      setOrders((list) => list.filter((x) => x.id !== o.id));
      toast.success("تم حذف الطلب");
    } catch {
      toast.error("تعذّر الحذف");
    } finally {
      setDel(null);
    }
  };

  return (
    <div>
      <SectionHeader title="الطلبات" subtitle={`${orders.length} طلب`} />

      <div className="card mb-5 flex flex-wrap items-center gap-3 p-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
          <FiSearch className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب أو الاسم أو الهاتف..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="inp w-auto">
          <option value="">كل الحالات</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-right text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4 font-bold">رقم الطلب</th>
                <th className="p-4 font-bold">العميل</th>
                <th className="p-4 font-bold">الإجمالي</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <SkeletonRows colSpan={6} />
              ) : orders.length ? (
                orders.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-brand-50/40">
                    <td className="p-4 font-mono font-bold text-brand-700">{o.reference}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{o.customer_name || o.user?.name || "—"}</p>
                      <p className="text-xs text-slate-400">{o.phone}</p>
                    </td>
                    <td className="whitespace-nowrap p-4 font-extrabold text-slate-800">
                      {formatPrice(o.total)} <span className="text-xs font-normal text-slate-400">ل.س</span>
                    </td>
                    <td className="p-4 text-slate-500">{o.created_at ? new Date(o.created_at).toLocaleDateString("ar") : "—"}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o, e.target.value)}
                        className={`cursor-pointer rounded-lg border-0 px-2 py-1 text-xs font-bold outline-none ring-1 ring-black/5 ${statusMeta(o.status).tone}`}
                      >
                        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setView(o)} className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-brand-100"><FiEye /></button>
                        <button onClick={() => setDel(o)} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={6} icon="🧾" text="لا توجد طلبات" />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {view && <OrderModal order={view} onClose={() => setView(null)} />}
        {del && (
          <ConfirmDialog
            title="حذف الطلب؟"
            message={`سيتم حذف الطلب «${del.reference}» نهائياً.`}
            onCancel={() => setDel(null)}
            onConfirm={() => remove(del)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderModal({ order, onClose }) {
  const [full, setFull] = useState(order);

  useEffect(() => {
    api.get(`/admin/orders/${order.id}`).then((r) => setFull(r.data.data)).catch(() => {});
  }, [order.id]);

  const m = statusMeta(full.status);

  return (
    <Modal title={`الطلب ${full.reference}`} onClose={onClose} wide>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${m.tone}`}>{m.label}</span>
          <span className="text-sm text-slate-400">
            {full.created_at ? new Date(full.created_at).toLocaleString("ar") : ""}
          </span>
        </div>

        <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-2 text-slate-700"><FiUser className="text-brand-500" /> {full.customer_name || full.user?.name || "—"}</p>
          <p className="flex items-center gap-2 text-slate-700"><FiPhone className="text-brand-500" /> {full.phone || "—"}</p>
          <p className="flex items-center gap-2 text-slate-700 sm:col-span-2"><FiMapPin className="text-brand-500" /> {full.address || "—"}</p>
          {full.notes && <p className="text-slate-500 sm:col-span-2">ملاحظات: {full.notes}</p>}
        </div>

        <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-3 font-bold">المنتج</th>
                <th className="p-3 font-bold">السعر</th>
                <th className="p-3 font-bold">الكمية</th>
                <th className="p-3 font-bold">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(full.items || []).map((it) => (
                <tr key={it.id}>
                  <td className="p-3 font-semibold text-slate-700">{it.product_name}</td>
                  <td className="p-3 text-slate-500">{formatPrice(it.price)}</td>
                  <td className="p-3 text-slate-500">×{it.quantity}</td>
                  <td className="p-3 font-bold text-slate-800">{formatPrice(it.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ms-auto w-full max-w-xs space-y-1 text-sm">
          <Row label="المجموع الفرعي" value={`${formatPrice(full.subtotal)} ل.س`} />
          <Row label="الشحن" value={`${formatPrice(full.shipping)} ل.س`} />
          {Number(full.discount) > 0 && <Row label={`خصم ${full.coupon_code || ""}`} value={`- ${formatPrice(full.discount)} ل.س`} accent />}
          <div className="flex justify-between border-t pt-2 text-base font-black text-brand-900">
            <span>الإجمالي</span>
            <span>{formatPrice(full.total)} ل.س</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between text-slate-500">
      <span>{label}</span>
      <span className={accent ? "font-bold text-emerald-600" : "font-semibold text-slate-700"}>{value}</span>
    </div>
  );
}
