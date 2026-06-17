import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid, FiBox, FiLayers, FiTag, FiShoppingBag, FiUsers, FiHome,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import { Denied } from "./admin/ui";
import DashboardSection from "./admin/DashboardSection";
import ProductsSection from "./admin/ProductsSection";
import CategoriesSection from "./admin/CategoriesSection";
import CouponsSection from "./admin/CouponsSection";
import OrdersSection from "./admin/OrdersSection";
import UsersSection from "./admin/UsersSection";

const TABS = [
  { key: "dashboard", label: "الرئيسية", icon: <FiGrid />, render: () => <DashboardSection /> },
  { key: "products", label: "المنتجات", icon: <FiBox />, render: () => <ProductsSection /> },
  { key: "categories", label: "الفئات", icon: <FiLayers />, render: () => <CategoriesSection /> },
  { key: "coupons", label: "الكوبونات", icon: <FiTag />, render: () => <CouponsSection /> },
  { key: "orders", label: "الطلبات", icon: <FiShoppingBag />, render: () => <OrdersSection /> },
  { key: "users", label: "المستخدمون", icon: <FiUsers />, render: () => <UsersSection /> },
];

export default function Admin() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const active = params.get("tab") || "dashboard";
  const current = TABS.find((t) => t.key === active) || TABS[0];

  const go = (key) => setParams(key === "dashboard" ? {} : { tab: key });

  if (!user)
    return <PageWrapper><Denied msg="يرجى تسجيل الدخول بحساب المدير" /></PageWrapper>;
  if (!user.roles?.includes("admin"))
    return <PageWrapper><Denied msg="هذه الصفحة مخصّصة للمدير فقط" /></PageWrapper>;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="bg-gradient-to-l from-brand-900 via-brand-700 to-brand-500 py-8 text-white">
        <div className="container-app flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">لوحة التحكم</h1>
            <p className="mt-1 text-sm text-slate-200">مرحباً {user.name} — أدر متجر البراق من مكان واحد</p>
          </div>
          <Link to="/" className="hidden items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-white/25 sm:flex">
            <FiHome /> المتجر
          </Link>
        </div>
      </div>

      <div className="container-app grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar (desktop) / Tab bar (mobile) */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <nav className="card flex gap-1 overflow-x-auto p-2 lg:flex-col">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => go(t.key)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors lg:w-full ${
                  active === t.key
                    ? "bg-brand-500 text-white shadow-glow"
                    : "text-slate-600 hover:bg-brand-50"
                }`}
              >
                <span className="text-lg">{t.icon}</span> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Active section */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {current.render()}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
