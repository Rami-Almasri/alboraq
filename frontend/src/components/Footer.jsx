import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiSend } from "react-icons/fi";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("تم اشتراكك في النشرة البريدية 🎉");
    setEmail("");
  };

  return (
    <footer className="mt-20 bg-brand-900 text-slate-300">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-5 py-10 md:flex-row">
          <div className="text-center md:text-right">
            <h3 className="text-xl font-black text-white">اشترك في نشرتنا البريدية</h3>
            <p className="mt-1 text-sm text-slate-400">كن أول من يعرف عن العروض والمنتجات الجديدة</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-accent"
            />
            <button type="submit" className="btn shrink-0 bg-accent text-white hover:bg-cyan-400">
              <FiSend /> اشترك
            </button>
          </form>
        </div>
      </div>

      <div className="container-app grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-white">
              <span className="text-lg font-black">ب</span>
            </div>
            <p className="text-lg font-extrabold text-white">البراق للاتصالات</p>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            الوكيل المعتمد لمنتجات سامسونج في سوريا. هواتف، تلفزيونات، وأجهزة
            منزلية بأفضل الأسعار وضمان رسمي.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">جميع المنتجات</Link></li>
            <li><Link to="/products?category=mobiles" className="hover:text-white">الهواتف الذكية</Link></li>
            <li><Link to="/products?category=tv" className="hover:text-white">التلفزيونات</Link></li>
            <li><Link to="/products?category=appliances" className="hover:text-white">الأجهزة المنزلية</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">خدمة العملاء</h4>
          <ul className="space-y-2 text-sm">
            <li>الضمان والصيانة</li>
            <li>سياسة التوصيل</li>
            <li>فروعنا</li>
            <li>الأسئلة الشائعة</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">تواصل معنا</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><FiPhone /> 963 11 123 4567+</li>
            <li className="flex items-center gap-2"><FiMail /> info@alboraq-syr.com</li>
            <li className="flex items-center gap-2"><FiMapPin /> دمشق - سوريا</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="#" className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-white/10 transition-colors hover:bg-accent hover:text-white"><FiFacebook /></a>
            <a href="#" className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-white/10 transition-colors hover:bg-accent hover:text-white"><FiInstagram /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} البراق للاتصالات — جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
