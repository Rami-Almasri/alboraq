import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../api/axios";
import { Modal, Field, Toggle, ConfirmDialog, SectionHeader, EmptyRow, SkeletonRows } from "./ui";

const EMPTY = { name: "", description: "", image: "", parent_id: "", sort_order: 0, is_active: true };

export default function CategoriesSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/categories");
      setItems(data.data || []);
    } catch {
      toast.error("تعذّر تحميل الفئات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (c) => {
    try {
      await api.delete(`/admin/categories/${c.id}`);
      toast.success("تم حذف الفئة");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر الحذف");
    } finally {
      setDel(null);
    }
  };

  const parents = items.filter((c) => !c.parent_id);

  return (
    <div>
      <SectionHeader
        title="الفئات"
        subtitle={`${items.length} فئة`}
        action={<button onClick={() => setModal("create")} className="btn-primary"><FiPlus /> أضف فئة</button>}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4 font-bold">الاسم</th>
                <th className="p-4 font-bold">الرابط</th>
                <th className="p-4 font-bold">عدد المنتجات</th>
                <th className="p-4 font-bold">الترتيب</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <SkeletonRows colSpan={6} />
              ) : items.length ? (
                items.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-brand-50/40">
                    <td className="p-4 font-bold text-slate-800">{c.name}</td>
                    <td className="p-4 font-mono text-xs text-slate-400">{c.slug}</td>
                    <td className="p-4 text-slate-600">{c.products_count ?? 0}</td>
                    <td className="p-4 text-slate-600">{c.sort_order}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${c.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                        {c.is_active ? <FiEye /> : <FiEyeOff />} {c.is_active ? "ظاهرة" : "مخفية"}
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
                <EmptyRow colSpan={6} icon="🗂️" text="لا توجد فئات" />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <CategoryModal
            initial={modal === "create" ? null : modal}
            parents={parents}
            onClose={() => setModal(null)}
            onSaved={() => { setModal(null); load(); }}
          />
        )}
        {del && (
          <ConfirmDialog
            title="حذف الفئة؟"
            message={`سيتم حذف «${del.name}». الفئات التي تحتوي على منتجات لا يمكن حذفها.`}
            onCancel={() => setDel(null)}
            onConfirm={() => remove(del)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryModal({ initial, parents, onClose, onSaved }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial, parent_id: initial.parent_id ?? "" } : EMPTY);
  const [saving, setSaving] = useState(false);
  const editing = Boolean(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("الاسم مطلوب");
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      image: form.image?.trim() || null,
      parent_id: form.parent_id === "" ? null : Number(form.parent_id),
      sort_order: Number(form.sort_order) || 0,
      is_active: Boolean(form.is_active),
    };
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/categories/${initial.id}`, payload);
      else await api.post("/admin/categories", payload);
      toast.success(editing ? "تم تحديث الفئة" : "تمت إضافة الفئة");
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  // A category cannot be its own parent.
  const availableParents = parents.filter((p) => !initial || p.id !== initial.id);

  return (
    <Modal
      title={editing ? "تعديل الفئة" : "إضافة فئة جديدة"}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-ghost flex-1">إلغاء</button>
          <button type="submit" form="cat-form" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
            <FiSave /> {saving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        </>
      }
    >
      <form id="cat-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="اسم الفئة" className="sm:col-span-2">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className="inp" placeholder="مثال: الهواتف" />
        </Field>
        <Field label="الفئة الأم (اختياري)">
          <select value={form.parent_id} onChange={(e) => set("parent_id", e.target.value)} className="inp">
            <option value="">— فئة رئيسية —</option>
            {availableParents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="الترتيب">
          <input type="number" min="0" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} className="inp" />
        </Field>
        <Field label="رابط الصورة (اختياري)" className="sm:col-span-2">
          <input value={form.image || ""} onChange={(e) => set("image", e.target.value)} className="inp" placeholder="https://..." />
        </Field>
        <Field label="الوصف" className="sm:col-span-2">
          <textarea rows={2} value={form.description || ""} onChange={(e) => set("description", e.target.value)} className="inp resize-none" />
        </Field>
        <div className="sm:col-span-2">
          <Toggle label="ظاهرة في المتجر" checked={form.is_active} onChange={(v) => set("is_active", v)} icon={<FiEye />} />
        </div>
      </form>
    </Modal>
  );
}
