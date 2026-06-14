import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import PageWrapper from "../components/PageWrapper";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Favorites() {
  const { favorites } = useCart();
  const { user } = useAuth();

  if (!user)
    return (
      <PageWrapper>
        <Empty
          title="سجّل الدخول لعرض المفضلة"
          desc="احفظ منتجاتك المفضلة وتابعها بسهولة"
          to="/login"
          cta="تسجيل الدخول"
        />
      </PageWrapper>
    );

  const products = favorites.map((f) => f.product).filter(Boolean);

  if (!products.length)
    return (
      <PageWrapper>
        <Empty title="قائمة المفضلة فارغة" desc="أضف منتجات تحبها لتظهر هنا" to="/products" cta="تصفّح المنتجات" />
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <div className="container-app py-10">
        <h1 className="mb-8 text-3xl font-black">المفضلة ({products.length})</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </PageWrapper>
  );
}

function Empty({ title, desc, to, cta }) {
  return (
    <div className="container-app grid place-items-center py-28 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-red-50 text-4xl text-red-500">
          <FiHeart />
        </div>
        <h2 className="mt-5 text-2xl font-black">{title}</h2>
        <p className="mt-2 text-slate-500">{desc}</p>
        <Link to={to} className="btn-primary mt-6">{cta}</Link>
      </motion.div>
    </div>
  );
}
