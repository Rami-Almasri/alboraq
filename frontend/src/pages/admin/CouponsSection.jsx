import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiTag } from "react-icons/fi";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";
import { Modal, Field, Toggle, ConfirmDialog, SectionHeader, EmptyRow, SkeletonRows } from "./ui";

const EMPTY = {
  code: "", type: "percent", value: "", min_total: 0,
  usage_limit: "", expires_at: "", is_active: true,
};

export default function CouponsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/coupons");
      setItems(data.data || []);
    } catch {
      toast.error("تعذّر تحميل الكوبونات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (c) => {
    try {
      await api.delete(`/admin/coupons/${c.id}`);
      toast.success("تم حذف الكوبون");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر الحذف");
    } finally {
      setDel(null);
    }
  };

  return (
    <div>
      <SectionHeader
        title="كوبونات الخصم"
        subtitle={`${items.length} كوبون`}
        action={<button onClick={() => setModal("create")} className="btn-primary"><FiPlus /> أضف كوبون</button>}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4 font-bold">الكود</th>
                <th className="p-4 font-bold">الخصم</th>
                <th className="p-4 font-bold">حد أدنى</th>
                <th className="p-4 font-bold">الاستخدام</th>
                <th className="p-4 font-bold">ينتهي</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <SkeletonRows colSpan={7} />
              ) : items.length ? (
                items.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-brand-50/40">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 font-mono font-bold text-brand-600">
                        <FiTag size={13} /> {c.code}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {c.type === "percent" ? `${Number(c.value)}%` : `${formatPrice(c.value)} ل.س`}
                    </td>
                    <td className="p-4 text-slate-600">{Number(c.min_total) ? formatPrice(c.min_total) : "—"}</td>
                    <td className="p-4 text-slate-600">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}</td>
                    <td className="p-4 text-slate-600">{c.expires_at ? new Date(c.expires_at).toLocaleDateString("ar") : "—"}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${c.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                        {c.is_active ? "مفعّل" : "متوقف"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal(c)} className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-brand-100"><FiEdit2 /></button>
                        <button onClick={() => setDel(c)} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={7} icon="🎟️" text="لا توجد كوبونات" />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <CouponModal
            initial={modal === "create" ? null : modal}
            onClose={() => setModal(null)}
            onSaved={() => { setModal(null); load(); }}
          />
        )}
        {del && (
          <ConfirmDialog
            title="حذف الكوبون؟"
            message={`سيتم حذف الكوبون «${del.code}» نهائياً.`}
            onCancel={() => setDel(null)}
            onConfirm={() => remove(del)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CouponModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(
    initial
      ? { ...EMPTY, ...initial, usage_limit: initial.usage_limit ?? "", expires_at: initial.expires_at ? initial.expires_at.slice(0, 10) : "" }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const editing = Boolean(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) return toast.error("الكود مطلوب");
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      min_total: Number(form.min_total) || 0,
      usage_limit: form.usage_limit === "" ? null : Number(form.usage_limit),
      expires_at: form.expires_at || null,
      is_active: Boolean(form.is_active),
    };
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/coupons/${initial.id}`, payload);
      else await api.post("/admin/coupons", payload);
      toast.success(editing ? "تم تحديث الكوبون" : "تمت إضافة الكوبون");
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editing ? "تعديل الكوبون" : "إضافة كوبون جديد"}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-ghost flex-1">إلغاء</button>
          <button type="submit" form="coupon-form" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
            <FiSave /> {saving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        </>
      }
    >
      <form id="coupon-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="كود الكوبون" className="sm:col-span-2">
          <input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className="inp font-mono" placeholder="SUMMER25" />
        </Field>
        <Field label="نوع الخصم">
          <select value={form.type} onChange={(e) => set("type", e.target.value)} className="inp">
            <option value="percent">نسبة مئوية %</option>
            <option value="fixed">مبلغ ثابت (ل.س)</option>
          </select>
        </Field>
        <Field label={form.type === "percent" ? "القيمة (%)" : "القيمة (ل.س)"}>
          <input type="number" min="0" value={form.value} onChange={(e) => set("value", e.target.value)} className="inp" />
        </Field>
        <Field label="حد أدنى للطلب (ل.س)">
          <input type="number" min="0" value={form.min_total} onChange={(e) => set("min_total", e.target.value)} className="inp" />
        </Field>
        <Field label="حد الاستخدام (اختياري)">
          <input type="number" min="0" value={form.usage_limit} onChange={(e) => set("usage_limit", e.target.value)} className="inp" placeholder="غير محدود" />
        </Field>
        <Field label="تاريخ الانتهاء (اختياري)" className="sm:col-span-2">
          <input type="date" value={form.expires_at} onChange={(e) => set("expires_at", e.target.value)} className="inp" />
        </Field>
        <div className="sm:col-span-2">
          <Toggle label="مفعّل" checked={form.is_active} onChange={(v) => set("is_active", v)} icon={<FiTag />} />
        </div>
      </form>
    </Modal>
  );
}
