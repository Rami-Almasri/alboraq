import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  FiArrowLeft,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiHeadphones,
  FiZap,
  FiStar,
} from "react-icons/fi";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import SmartImage from "../components/SmartImage";
import AnimatedCounter from "../components/AnimatedCounter";
import Countdown from "../components/Countdown";
import Magnetic from "../components/Magnetic";

const features = [
  { icon: <FiTruck />, title: "توصيل سريع", desc: "لكل المحافظات السورية" },
  { icon: <FiShield />, title: "ضمان رسمي", desc: "وكيل سامسونج المعتمد" },
  { icon: <FiCreditCard />, title: "دفع آمن", desc: "عند الاستلام أو إلكترونياً" },
  { icon: <FiHeadphones />, title: "دعم 24/7", desc: "خدمة عملاء على مدار الساعة" },
];

const stats = [
  { to: 15, suffix: "+", label: "سنة خبرة" },
  { to: 50000, suffix: "+", label: "عميل سعيد" },
  { to: 1200, suffix: "+", label: "منتج أصلي" },
  { to: 12, suffix: "", label: "فرع في سوريا" },
];

const brands = [
  "Galaxy S24 Ultra", "Neo QLED 8K", "Galaxy Z Fold6", "Bespoke AI",
  "Galaxy Watch7", "Galaxy Buds3", "Galaxy Tab S9", "QLED 4K", "Galaxy Z Flip6",
];

const testimonials = [
  { name: "أحمد العلي", city: "دمشق", rating: 5, text: "خدمة ممتازة وتوصيل سريع. اشتريت Galaxy S24 Ultra ووصلني خلال يومين بضمان رسمي. أنصح الجميع بالتعامل معهم." },
  { name: "ليلى حسن", city: "حلب", rating: 5, text: "أسعار منافسة جداً ومنتجات أصلية 100%. فريق الدعم رد على كل أسئلتي بصبر. تجربة شراء رائعة." },
  { name: "محمد خالد", city: "اللاذقية", rating: 4, text: "تشكيلة واسعة من الأجهزة وكل شي مرتب على الموقع. التلفزيون Neo QLED وصل بحالة ممتازة ومغلّف بعناية." },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Flash-deal window ends ~47h from first render (stable across re-renders).
  const dealEnds = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 47), []);

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

  const deals = useMemo(() => {
    const discounted = featured.filter(
      (p) => p.old_price && Number(p.old_price) > Number(p.price)
    );
    return (discounted.length ? discounted : featured).slice(0, 4);
  }, [featured]);

  return (
    <PageWrapper>
      <Hero />

      {/* FEATURES */}
      <section className="container-app relative z-10 -mt-10">
        <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-xl text-brand-500 ring-1 ring-brand-500/25">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-white">{f.title}</p>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="container-app pt-16">
        <div className="frame-glow grid grid-cols-2 gap-4 overflow-hidden rounded-3xl bg-white/[0.03] p-8 text-center text-white ring-1 ring-white/10 backdrop-blur-xl sm:grid-cols-4 md:p-10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl font-black md:text-4xl">
                <AnimatedCounter to={s.to} suffix={s.suffix} className="aurora-text" />
              </p>
              <p className="mt-1 text-sm text-slate-400">{s.label}</p>
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
                className="card group flex flex-col items-center gap-3 p-6 text-center transition-all hover:-translate-y-1 hover:ring-brand-500/40 hover:shadow-glow"
              >
                <div className="h-24 w-24 overflow-hidden rounded-2xl bg-white/5 p-1 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110">
                  {c?.image ? (
                    <SmartImage src={c.image} alt={c.name} className="h-full w-full" />
                  ) : (
                    <span className="grid h-full place-items-center text-3xl">📱</span>
                  )}
                </div>
                <p className="font-bold text-white group-hover:text-brand-500">
                  {c?.name || "فئة"}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FLASH DEALS */}
      {!loading && deals.length > 0 && (
        <section className="container-app pb-16">
          <div className="frame-glow relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-700/40 via-brand-900/60 to-ink-800 p-6 ring-1 ring-white/10 md:p-10">
            <div className="absolute -left-10 -top-10 h-48 w-48 animate-aurora rounded-full bg-fuchsia/20 blur-2xl" />
            <div className="absolute -right-10 bottom-0 h-48 w-48 animate-aurora-slow rounded-full bg-accent/20 blur-2xl" />
            <div className="relative flex flex-col items-center justify-between gap-5 text-white md:flex-row">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/20">
                  <FiZap className="text-amber-300" /> عروض محدودة
                </span>
                <h2 className="mt-3 text-2xl font-black md:text-3xl">عروض الفلاش تنتهي قريباً ⚡</h2>
                <p className="mt-1 text-sm text-white/70">سارع بالطلب قبل انتهاء الوقت</p>
              </div>
              <Countdown target={dealEnds} />
            </div>
            <div className="relative mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {deals.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="container-app pb-16">
        <SectionHeader title="منتجات مميزة" subtitle="الأكثر مبيعاً" link="/products" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array(8).fill(null).map((_, i) => <ProductSkeleton key={i} />)
            : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-16">
        <div className="container-app">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold text-accent">آراء عملائنا</p>
            <h2 className="text-2xl font-black text-white md:text-3xl">يثقون بنا ويوصون بنا</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card flex flex-col p-6 transition-all hover:ring-brand-500/30"
              >
                <div className="mb-3 flex gap-0.5 text-amber-400">
                  {Array(5).fill(null).map((_, s) => (
                    <FiStar key={s} fill={s < t.rating ? "currentColor" : "none"} className={s < t.rating ? "" : "text-slate-600"} />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-slate-300">“{t.text}”</p>
                <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="container-app py-20">
        <div className="frame-glow relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-700/50 via-brand-900/70 to-ink-800 p-10 text-center text-white ring-1 ring-white/10 md:p-16">
          <div className="absolute -left-10 -top-10 h-40 w-40 animate-aurora rounded-full bg-brand-500/30 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 animate-aurora-slow rounded-full bg-accent/30 blur-2xl" />
          <h3 className="relative text-2xl font-black md:text-4xl">
            انضم إلى عائلة <span className="aurora-text">البراق</span>
          </h3>
          <p className="relative mx-auto mt-3 max-w-lg text-slate-300">
            سجّل الآن واحصل على عروض حصرية وخصومات على أحدث منتجات سامسونج.
          </p>
          <Magnetic className="relative mt-6 inline-block">
            <Link to="/register" className="btn-primary">
              أنشئ حسابك المجاني <FiArrowLeft />
            </Link>
          </Magnetic>
        </div>
      </section>
    </PageWrapper>
  );
}

/* --------------------------------------------------------------------------
   Hero — a 3D-tilt product showcase over a living aurora, with magnetic CTAs.
-------------------------------------------------------------------------- */
function Hero() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 120, damping: 14 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="container-app relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-sm font-semibold text-slate-200 ring-1 ring-white/15 backdrop-blur">
            <span className="h-2 w-2 animate-ticker rounded-full bg-accent shadow-glow-cyan" />
            الوكيل المعتمد لـ Samsung في سوريا
          </span>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            تجربة تقنية
            <br />
            <span className="aurora-text">لا تُضاهى</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-300">
            اكتشف أحدث هواتف Galaxy، تلفزيونات Neo QLED، والأجهزة المنزلية
            الذكية بأفضل الأسعار وضمان رسمي.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link to="/products" className="btn-primary">
                تسوّق الآن <FiArrowLeft />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/products?category=mobiles" className="btn-ghost">
                هواتف Galaxy
              </Link>
            </Magnetic>
          </div>
          {/* trust row */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><FiShield className="text-accent" /> ضمان رسمي</span>
            <span className="flex items-center gap-1.5"><FiTruck className="text-accent" /> شحن لكل سوريا</span>
            <span className="flex items-center gap-1.5"><FiCreditCard className="text-accent" /> دفع عند الاستلام</span>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ perspective: 1000 }}
          className="relative grid place-items-center"
        >
          <div className="absolute h-72 w-72 animate-glowpulse rounded-full bg-brand-500/30 blur-3xl" />
          <motion.div
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
            className="frame-glow relative animate-float rounded-[2rem] bg-white/[0.04] p-4 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <img
              src="/products/smartphone.svg"
              alt="Samsung Galaxy"
              className="h-[360px] w-auto drop-shadow-2xl"
              style={{ transform: "translateZ(60px)" }}
            />
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              style={{ transform: "translateZ(90px)" }}
              className="absolute -bottom-2 right-2 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-white ring-1 ring-white/20 backdrop-blur-md"
            >
              <span className="text-amber-400">★</span>
              <span className="text-sm font-bold">4.9 تقييم العملاء</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              style={{ transform: "translateZ(110px)" }}
              className="absolute left-2 top-4 rounded-2xl bg-gradient-to-l from-fuchsia to-brand-500 px-4 py-2 text-sm font-extrabold text-white shadow-glow"
            >
              خصم حتى 20%
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* brand marquee */}
      <div className="relative border-y border-white/10 bg-white/[0.03] py-4 backdrop-blur-sm">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-5">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-bold tracking-wide text-white/40">
              {b} <span className="text-accent">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, link }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <p className="text-sm font-semibold text-accent">{subtitle}</p>
        <h2 className="text-2xl font-black text-white md:text-3xl">{title}</h2>
      </div>
      <Link to={link} className="group flex items-center gap-1 text-sm font-semibold text-brand-500 transition-all hover:gap-2 hover:text-accent">
        عرض الكل <FiArrowLeft />
      </Link>
    </div>
  );
}
