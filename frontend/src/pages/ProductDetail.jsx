import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiStar, FiCheck, FiTruck, FiShield } from "react-icons/fi";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { formatPrice, imgUrl } from "../utils/format";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api
      .get(`/products/${slug}`)
      .then((r) => {
        setProduct(r.data.data);
        return api.get("/products", {
          params: { category: r.data.data?.category?.slug, per_page: 4 },
        });
      })
      .then((r) => setRelated((r.data.data?.data || r.data.data || []).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="container-app grid gap-8 py-12 md:grid-cols-2">
        <div className="skeleton h-[420px] w-full" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-40" />
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="container-app grid place-items-center py-32 text-center">
        <p className="text-xl font-bold">المنتج غير موجود</p>
        <Link to="/products" className="btn-primary mt-4">العودة للمنتجات</Link>
      </div>
    );

  const gallery = product.images?.length ? product.images : [product.image];
  const fav = isFavorite(product.id);
  const discount =
    product.old_price && Number(product.old_price) > Number(product.price)
      ? Math.round((1 - Number(product.price) / Number(product.old_price)) * 100)
      : 0;

  return (
    <PageWrapper>
      <div className="container-app py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-500">الرئيسية</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-500">المنتجات</Link>
          <span>/</span>
          <span className="text-slate-800">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Gallery */}
          <div>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card grid place-items-center bg-slate-50 p-10"
            >
              <img src={imgUrl(gallery[active])} alt={product.name} className="max-h-[380px] object-contain" />
            </motion.div>
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`grid h-20 w-20 place-items-center rounded-xl bg-slate-50 p-2 ring-2 transition-all ${
                      active === i ? "ring-brand-500" : "ring-transparent hover:ring-brand-100"
                    }`}
                  >
                    <img src={imgUrl(g)} alt="" className="max-h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="font-semibold text-brand-500">
              {product.category?.name || product.brand}
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex text-amber-500">
                {Array(5).fill(0).map((_, i) => (
                  <FiStar key={i} fill={i < Math.round(product.rating || 4) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-slate-500">({product.rating || "4.5"})</span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-4xl font-black text-brand-900">
                {formatPrice(product.price)}
                <span className="mr-1 text-base font-medium text-slate-400">ل.س</span>
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">{formatPrice(product.old_price)}</span>
                  <span className="rounded-lg bg-accent px-2 py-1 text-sm font-bold text-white">-{discount}%</span>
                </>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-slate-600">{product.description}</p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <FiCheck />
              {product.stock > 0 ? `متوفر في المخزون (${product.stock})` : "غير متوفر حالياً"}
            </div>

            {/* Qty + actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border border-slate-200">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg font-bold text-slate-600">−</button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-lg font-bold text-slate-600">+</button>
              </div>
              <button
                onClick={() => addToCart(product.id, qty)}
                disabled={product.stock <= 0}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiShoppingCart /> أضف إلى السلة
              </button>
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`grid h-11 w-11 place-items-center rounded-xl ring-1 transition-all ${
                  fav ? "bg-red-500 text-white ring-red-500" : "ring-slate-200 text-slate-500 hover:text-red-500"
                }`}
              >
                <FiHeart fill={fav ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Perks */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-brand-50 p-3">
                <FiTruck className="text-xl text-brand-500" />
                <div className="text-sm"><p className="font-bold">توصيل سريع</p><p className="text-slate-500">لكل المحافظات</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-brand-50 p-3">
                <FiShield className="text-xl text-brand-500" />
                <div className="text-sm"><p className="font-bold">ضمان رسمي</p><p className="text-slate-500">وكيل معتمد</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-black text-slate-900">منتجات مشابهة</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.filter((r) => r.id !== product.id).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
