import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiBox, FiStar, FiMinus, FiSave,
} from "react-icons/fi";
import api from "../../api/axios";
import SmartImage from "../../components/SmartImage";
import { formatPrice } from "../../utils/format";
import {
  Modal, Field, Toggle, ConfirmDialog, SectionHeader, EmptyRow, SkeletonRows,
} from "./ui";

const ILLUSTRATIONS = [
  "smartphone", "foldable", "tablet", "watch", "buds", "tv", "soundbar",
  "projector", "fridge", "washer", "dishwasher", "microwave", "vacuum", "ac", "charger",
];

const EMPTY = {
  name: "", category_id: "", brand: "Samsung", description: "",
  price: "", old_price: "", stock: 0, rating: 4.5,
  image: "/products/smartphone.svg", is_featured: false, is_active: true,
};

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // "create" | product
  const [del, setDel] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/products", { params: { search, per_page: 100 } });
      setProducts(data.data?.data || data.data || []);
    } catch {
      toast.error("تعذّر تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const adjustStock = async (p, delta) => {
    const next = Math.max(0, Number(p.stock || 0) + delta);
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: next } : x)));
    try {
      await api.put(`/admin/products/${p.id}`, { stock: next });
    } catch {
      toast.error("فشل تحديث المخزون");
      load();
    }
  };

  const remove = async (p) => {
    try {
      await api.delete(`/admin/products/${p.id}`);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("تم حذف المنتج");
    } catch {
      toast.error("تعذّر حذف المنتج");
    } finally {
      setDel(null);
    }
  };

  return (
    <div>
      <SectionHeader
        title="المنتجات"
        subtitle={`${products.length} منتج`}
        action={
          <button onClick={() => setModal("create")} className="btn-primary">
            <FiPlus /> أضف منتج
          </button>
        }
      />

      <div className="card mb-5 flex items-center gap-2 p-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
          <FiSearch className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الماركة..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4 font-bold">المنتج</th>
                <th className="p-4 font-bold">الفئة</th>
                <th className="p-4 font-bold">السعر</th>
                <th className="p-4 font-bold">المخزون</th>
                <th className="p-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <SkeletonRows colSpan={5} />
              ) : products.length ? (
                products.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-brand-50/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-50 p-1 ring-1 ring-black/5">
                          <SmartImage src={p.image} alt={p.name} className="h-full" />
                        </div>
                        <div className="max-w-[220px]">
                          <p className="line-clamp-1 font-bold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{p.category?.name || "—"}</td>
                    <td className="whitespace-nowrap p-4 font-extrabold text-brand-900">
                      {formatPrice(p.price)} <span className="text-xs font-normal text-slate-400">ل.س</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => adjustStock(p, -1)} className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">
                          <FiMinus size={14} />
                        </button>
                        <span className={`min-w-[2.5rem] rounded-lg px-2 py-1 text-center text-sm font-bold ${stockTone(p.stock)}`}>
                          {p.stock}
                        </span>
                        <button onClick={() => adjustStock(p, 1)} className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500 text-white hover:bg-brand-600" title="إضافة للمخزون">
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal(p)} className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-brand-100" title="تعديل">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => setDel(p)} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50" title="حذف">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={5} icon="📦" text="لا توجد منتجات" />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <ProductModal
            initial={modal === "create" ? null : modal}
            categories={categories}
            onClose={() => setModal(null)}
            onSaved={() => { setModal(null); load(); }}
          />
        )}
        {del && (
          <ConfirmDialog
            title="حذف المنتج؟"
            message={`سيتم حذف «${del.name}» نهائياً.`}
            onCancel={() => setDel(null)}
            onConfirm={() => remove(del)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductModal({ initial, categories, onClose, onSaved }) {
  const [form, setForm] = useState(
    initial
      ? { ...EMPTY, ...initial, category_id: initial.category?.id || initial.category_id || "", old_price: initial.old_price ?? "" }
      : { ...EMPTY, category_id: categories[0]?.id || "" }
  );
  const [saving, setSaving] = useState(false);
  const editing = Boolean(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const knownIllustration = ILLUSTRATIONS.includes(form.image?.replace("/products/", "").replace(".svg", ""));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("الاسم مطلوب");
    if (!form.category_id) return toast.error("اختر الفئة");

    const payload = {
      name: form.name.trim(),
      category_id: Number(form.category_id),
      brand: form.brand?.trim() || "Samsung",
      description: form.description?.trim() || null,
      price: Number(form.price) || 0,
      old_price: form.old_price === "" ? null : Number(form.old_price),
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 4.5,
      image: form.image,
      is_featured: Boolean(form.is_featured),
      is_active: Boolean(form.is_active),
    };
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/products/${initial.id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success(editing ? "تم تحديث المنتج" : "تمت إضافة المنتج");
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editing ? "تعديل المنتج" : "إضافة منتج جديد"}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-ghost flex-1">إلغاء</button>
          <button type="submit" form="product-form" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
            <FiSave /> {saving ? "جارٍ الحفظ..." : editing ? "حفظ" : "إضافة"}
          </button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="اسم المنتج" className="sm:col-span-2">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className="inp" placeholder="مثال: Samsung Galaxy S24" />
        </Field>
        <Field label="الفئة">
          <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className="inp">
            <option value="">اختر الفئة</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="الماركة">
          <input value={form.brand} onChange={(e) => set("brand", e.target.value)} className="inp" />
        </Field>
        <Field label="السعر (ل.س)">
          <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className="inp" />
        </Field>
        <Field label="السعر قبل الخصم (اختياري)">
          <input type="number" min="0" value={form.old_price} onChange={(e) => set("old_price", e.target.value)} className="inp" />
        </Field>
        <Field label="المخزون">
          <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} className="inp" />
        </Field>
        <Field label="التقييم (0 - 5)">
          <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} className="inp" />
        </Field>
        <Field label="الصورة" className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-50 p-1 ring-1 ring-black/5">
              <SmartImage src={form.image} alt="" className="h-full" />
            </div>
            <select value={knownIllustration ? form.image : "custom"} onChange={(e) => set("image", e.target.value)} className="inp">
              {ILLUSTRATIONS.map((k) => <option key={k} value={`/products/${k}.svg`}>{k}</option>)}
              <option value="custom">رابط مخصّص…</option>
            </select>
          </div>
          <input value={form.image} onChange={(e) => set("image", e.target.value)} className="inp mt-2" placeholder="/products/smartphone.svg أو https://..." />
        </Field>
        <Field label="الوصف" className="sm:col-span-2">
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="inp resize-none" />
        </Field>
        <div className="flex flex-wrap gap-4 sm:col-span-2">
          <Toggle label="منتج مميز" checked={form.is_featured} onChange={(v) => set("is_featured", v)} icon={<FiStar />} />
          <Toggle label="مفعّل (ظاهر في المتجر)" checked={form.is_active} onChange={(v) => set("is_active", v)} icon={<FiBox />} />
        </div>
      </form>
    </Modal>
  );
}

function stockTone(stock) {
  const n = Number(stock);
  if (n === 0) return "bg-red-100 text-red-600";
  if (n <= 5) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}
