import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiStar, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import SmartImage from "./SmartImage";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const fav = isFavorite(product.id);
  const discount =
    product.old_price && Number(product.old_price) > Number(product.price)
      ? Math.round(
          (1 - Number(product.price) / Number(product.old_price)) * 100
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      whileHover={{ y: -8 }}
      className="card group relative flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-glow"
    >
      {/* Badges */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded-lg bg-accent px-2 py-1 text-xs font-bold text-white shadow">
            خصم {discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="rounded-lg bg-brand-500 px-2 py-1 text-xs font-bold text-white shadow">
            مميز
          </span>
        )}
      </div>

      <button
        onClick={() => toggleFavorite(product.id)}
        className={`absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all duration-300 ${
          fav
            ? "scale-110 bg-red-500 text-white"
            : "bg-white/80 text-slate-500 hover:scale-110 hover:text-red-500"
        }`}
        aria-label="favorite"
      >
        <FiHeart fill={fav ? "currentColor" : "none"} />
      </button>

      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-gradient-to-b from-slate-50 to-white p-5"
      >
        <SmartImage
          src={product.image}
          alt={product.name}
          className="h-44"
          imgClassName="group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500"
        />
        {/* Quick view overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-4 justify-center pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-brand-900/90 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <FiEye /> عرض سريع
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-semibold text-brand-500">
          {product.category?.name || product.brand || "Samsung"}
        </p>
        <Link
          to={`/products/${product.slug}`}
          className="line-clamp-2 min-h-[2.8rem] text-sm font-bold text-slate-800 transition-colors hover:text-brand-500"
        >
          {product.name}
        </Link>

        <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
          <FiStar fill="currentColor" />
          <span className="text-slate-500">{product.rating || "4.5"}</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {discount > 0 && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(product.old_price)}
              </p>
            )}
            <p className="text-lg font-extrabold text-brand-900">
              {formatPrice(product.price)}
              <span className="mr-1 text-xs font-medium text-slate-400">ل.س</span>
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => addToCart(product.id)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-white transition-all duration-300 hover:bg-brand-600 hover:shadow-glow"
            aria-label="add to cart"
          >
            <FiShoppingCart />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
