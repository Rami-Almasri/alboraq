import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";

const sorts = [
  { value: "", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل" },
  { value: "price_desc", label: "السعر: من الأعلى" },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "";

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { category, search, sort, per_page: 24 } })
      .then((r) => setProducts(r.data.data?.data || r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  return (
    <PageWrapper>
      <div className="bg-brand-900 py-10 text-white">
        <div className="container-app">
          <h1 className="text-3xl font-black">المنتجات</h1>
          <p className="mt-1 text-slate-300">
            {search ? `نتائج البحث عن: ${search}` : "تصفّح أحدث منتجات سامسونج"}
          </p>
        </div>
      </div>

      <div className="container-app grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit lg:sticky lg:top-20">
          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
              <FiFilter /> الفئات
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setParam("category", "")}
                  className={`w-full rounded-lg px-3 py-2 text-right text-sm font-semibold transition-colors ${
                    !category ? "bg-brand-500 text-white" : "text-slate-600 hover:bg-brand-50"
                  }`}
                >
                  جميع المنتجات
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setParam("category", c.slug)}
                    className={`w-full rounded-lg px-3 py-2 text-right text-sm font-semibold transition-colors ${
                      category === c.slug
                        ? "bg-brand-500 text-white"
                        : "text-slate-600 hover:bg-brand-50"
                    }`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">{products.length} منتج</p>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-brand-500"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array(9).fill(null).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card grid place-items-center py-20 text-center">
              <span className="text-5xl">🔍</span>
              <p className="mt-3 font-bold text-slate-700">لا توجد منتجات مطابقة</p>
              <p className="text-sm text-slate-400">جرّب تغيير الفلاتر أو البحث</p>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
