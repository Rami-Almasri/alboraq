import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiStar, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import SmartImage from "./SmartImage";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const fav = isFavorite(product.id);
  const ref = useRef(null);
  const discount =
    product.old_price && Number(product.old_price) > Number(product.price)
      ? Math.round(
          (1 - Number(product.price) / Number(product.old_price)) * 100
        )
      : 0;
  // `stock` is undefined on some endpoints — only treat an explicit 0 as out of stock.
  const outOfStock = product.stock !== undefined && Number(product.stock) === 0;
  const lowStock = !outOfStock && product.stock !== undefined && Number(product.stock) <= 5;

  // Track the pointer so a radial spotlight follows it across the card.
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:ring-brand-500/40 hover:shadow-glow"
    >
      {/* Pointer spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(124,108,255,0.16), transparent 60%)",
        }}
      />

      {/* Badges */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded-lg bg-gradient-to-l from-fuchsia to-brand-500 px-2 py-1 text-xs font-bold text-white shadow-glow">
            خصم {discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="rounded-lg bg-accent/15 px-2 py-1 text-xs font-bold text-accent ring-1 ring-accent/30">
            مميز
          </span>
        )}
        {outOfStock ? (
          <span className="rounded-lg bg-slate-700/80 px-2 py-1 text-xs font-bold text-white shadow">
            نفد المخزون
          </span>
        ) : lowStock ? (
          <span className="rounded-lg bg-amber-500/90 px-2 py-1 text-xs font-bold text-ink-900 shadow">
            كمية محدودة
          </span>
        ) : null}
      </div>

      <button
        onClick={() => toggleFavorite(product.id)}
        className={`absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all duration-300 ${
          fav
            ? "scale-110 bg-red-500 text-white shadow-glow"
            : "bg-white/10 text-slate-300 ring-1 ring-white/15 hover:scale-110 hover:text-red-400"
        }`}
        aria-label="favorite"
      >
        <FiHeart fill={fav ? "currentColor" : "none"} />
      </button>

      <Link
        to={`/products/${product.slug}`}
        className="relative z-[1] block overflow-hidden p-5"
      >
        <SmartImage
          src={product.image}
          alt={product.name}
          className="h-44 drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
          imgClassName="group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500"
        />
        {/* Quick view overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-4 justify-center pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-md">
            <FiEye /> عرض سريع
          </span>
        </div>
      </Link>

      <div className="relative z-[1] flex flex-1 flex-col p-4 pt-0">
        <p className="mb-1 text-xs font-semibold text-accent">
          {product.category?.name || product.brand || "Samsung"}
        </p>
        <Link
          to={`/products/${product.slug}`}
          className="line-clamp-2 min-h-[2.8rem] text-sm font-bold text-white transition-colors hover:text-brand-500"
        >
          {product.name}
        </Link>

        <div className="mt-1 flex items-center gap-1 text-xs text-amber-400">
          <FiStar fill="currentColor" />
          <span className="text-slate-400">{product.rating || "4.5"}</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {discount > 0 && (
              <p className="text-xs text-slate-500 line-through">
                {formatPrice(product.old_price)}
              </p>
            )}
            <p className="text-lg font-extrabold text-white">
              {formatPrice(product.price)}
              <span className="mr-1 text-xs font-medium text-slate-400">ل.س</span>
            </p>
          </div>
          <motion.button
            whileTap={{ scale: outOfStock ? 1 : 0.85 }}
            onClick={() => !outOfStock && addToCart(product.id)}
            disabled={outOfStock}
            className={`grid h-10 w-10 place-items-center rounded-xl text-white transition-all duration-300 ${
              outOfStock
                ? "cursor-not-allowed bg-white/10 text-slate-500"
                : "bg-gradient-to-br from-brand-500 to-violet hover:shadow-glow"
            }`}
            aria-label="add to cart"
          >
            <FiShoppingCart />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
