import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiHeadphones,
} from "react-icons/fi";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { imgUrl } from "../utils/format";

const features = [
  { icon: <FiTruck />, title: "توصيل سريع", desc: "لكل المحافظات السورية" },
  { icon: <FiShield />, title: "ضمان رسمي", desc: "وكيل سامسونج المعتمد" },
  { icon: <FiCreditCard />, title: "دفع آمن", desc: "عند الاستلام أو إلكترونياً" },
  { icon: <FiHeadphones />, title: "دعم 24/7", desc: "خدمة عملاء على مدار الساعة" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, c] = await Promise.all([
          api.get("/products", { params: { featured: 1, per_page: 8 } }),
          api.get("/categories"),
        ]);
        setFeatured(p.data.data?.data || p.data.data || []);
        setCategories(c.data.data || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PageWrapper>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-brand-500 blur-3xl" />
        </div>
        <div className="container-app relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
              الوكيل المعتمد لـ Samsung في سوريا
            </span>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              تجربة تقنية
              <span className="bg-gradient-to-l from-accent to-white bg-clip-text text-transparent">
                {" "}
                لا تُضاهى
              </span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-slate-300">
              اكتشف أحدث هواتف Galaxy، تلفزيونات Neo QLED، والأجهزة المنزلية
              الذكية بأفضل الأسعار وضمان رسمي.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary bg-accent hover:bg-cyan-400">
                تسوّق الآن <FiArrowLeft />
              </Link>
              <Link to="/products?category=mobiles" className="btn bg-white/10 text-white hover:bg-white/20">
                هواتف Galaxy
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative grid place-items-center"
          >
            <div className="animate-float">
              <img
                src="https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-s928bzkcmea/gallery/levant-ar-galaxy-s24-ultra-s928-sm-s928bzkcmea-thumb-539573043"
                onError={(e) => (e.currentTarget.style.display = "none")}
                alt="Samsung Galaxy"
                className="max-h-[420px] drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-app -mt-10 relative z-10">
        <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-brand-50"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-xl text-brand-500">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-slate-800">{f.title}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-app py-16">
        <SectionHeader title="تسوّق حسب الفئة" subtitle="اختر ما يناسبك" link="/products" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {(categories.length ? categories : Array(4).fill(null)).map((c, i) => (
            <motion.div
              key={c?.id || i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={c ? `/products?category=${c.slug}` : "/products"}
                className="card group flex flex-col items-center gap-3 p-6 text-center transition-all hover:shadow-glow"
              >
                <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-brand-50">
                  {c?.image ? (
                    <img src={imgUrl(c.image)} alt={c.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <span className="text-3xl">📱</span>
                  )}
                </div>
                <p className="font-bold text-slate-800 group-hover:text-brand-500">
                  {c?.name || "فئة"}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-app pb-16">
        <SectionHeader title="منتجات مميزة" subtitle="الأكثر مبيعاً" link="/products" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array(8).fill(null).map((_, i) => <ProductSkeleton key={i} />)
            : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="container-app pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-500 to-brand-700 p-10 text-center text-white md:p-16">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <h3 className="text-2xl font-black md:text-4xl">انضم إلى عائلة البراق</h3>
          <p className="mx-auto mt-3 max-w-lg text-slate-200">
            سجّل الآن واحصل على عروض حصرية وخصومات على أحدث منتجات سامسونج.
          </p>
          <Link to="/register" className="btn mt-6 bg-white text-brand-600 hover:bg-slate-100">
            أنشئ حسابك المجاني
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}

function SectionHeader({ title, subtitle, link }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <p className="text-sm font-semibold text-accent">{subtitle}</p>
        <h2 className="text-2xl font-black text-slate-900 md:text-3xl">{title}</h2>
      </div>
      <Link to={link} className="flex items-center gap-1 text-sm font-semibold text-brand-500 hover:gap-2 transition-all">
        عرض الكل <FiArrowLeft />
      </Link>
    </div>
  );
}
