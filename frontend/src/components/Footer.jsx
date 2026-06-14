import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-20 bg-brand-900 text-slate-300">
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
            <a className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-white/20"><FiFacebook /></a>
            <a className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-white/20"><FiInstagram /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} البراق للاتصالات — جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
