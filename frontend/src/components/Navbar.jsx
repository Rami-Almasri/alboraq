import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiTruck,
  FiPhone,
  FiPackage,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/products", label: "المنتجات" },
  { to: "/products?category=mobiles", label: "الهواتف" },
  { to: "/products?category=tv", label: "التلفزيونات" },
  { to: "/products?category=appliances", label: "الأجهزة المنزلية" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, favorites } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="relative overflow-hidden bg-brand-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-l from-brand-500/20 via-transparent to-accent/20" />
        <div className="container-app relative flex h-9 items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <FiTruck className="text-accent" /> توصيل مجاني للطلبات فوق 5,000,000 ل.س
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <FiPhone className="text-accent" /> 963 11 123 4567+
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-ink-900/70 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            : "border-transparent bg-ink-900/30 backdrop-blur-xl"
        }`}
      >
        <div className="container-app flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet text-white shadow-glow"
          >
            <span className="text-lg font-black">ب</span>
            <span className="absolute inset-0 rounded-xl ring-1 ring-white/30" />
          </motion.div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-white">البراق</p>
            <p className="-mt-1 text-[10px] tracking-[0.25em] text-accent/70">
              AL BORAQ
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="mx-2 hidden flex-1 items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-gradient-to-l after:from-accent after:to-brand-500 after:transition-transform hover:after:scale-x-100 ${
                  isActive
                    ? "text-white after:scale-x-100"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={search} className="hidden flex-1 md:block lg:max-w-xs">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 transition-colors focus-within:border-brand-500/60 focus-within:bg-white/[0.07]">
            <FiSearch className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </form>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <IconBtn to="/favorites" badge={favorites.length}>
            <FiHeart />
          </IconBtn>
          <IconBtn to="/cart" badge={count}>
            <FiShoppingCart />
          </IconBtn>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {user.roles?.includes("admin") && (
                <Link
                  to="/admin"
                  className="rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-bold text-accent hover:bg-accent/20"
                  title="لوحة الإدارة"
                >
                  الإدارة
                </Link>
              )}
              {user.is_agent && (
                <Link
                  to="/support"
                  className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-600 hover:bg-brand-100"
                  title="لوحة الدعم"
                >
                  لوحة الدعم
                </Link>
              )}
              <Link
                to="/orders"
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-brand-50 hover:text-brand-500"
                title="طلباتي"
              >
                <FiPackage />
              </Link>
              <span className="max-w-[90px] truncate text-sm font-semibold text-slate-700">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500"
                title="خروج"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden h-9 px-4 text-sm sm:inline-flex">
              <FiUser /> دخول
            </Link>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 lg:hidden"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-ink-800/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-app flex flex-col gap-1 py-3">
              <form onSubmit={search} className="mb-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                  <FiSearch className="text-slate-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </form>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50"
                >
                  {l.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  {user.roles?.includes("admin") && (
                    <NavLink
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10"
                    >
                      <FiPackage /> لوحة الإدارة
                    </NavLink>
                  )}
                  <NavLink
                    to="/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50"
                  >
                    <FiPackage /> طلباتي
                  </NavLink>
                  <button onClick={logout} className="btn-ghost mt-2 justify-start">
                    <FiLogOut /> تسجيل الخروج ({user.name})
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-primary mt-2">
                  <FiUser /> تسجيل الدخول
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  );
}

function IconBtn({ to, badge, children }) {
  return (
    <Link
      to={to}
      className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      <span className="text-lg">{children}</span>
      {badge > 0 && (
        <span className="absolute -top-1 -left-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink-900 shadow-glow-cyan">
          {badge}
        </span>
      )}
    </Link>
  );
}
