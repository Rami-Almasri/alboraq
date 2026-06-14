import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await register(form);
    if (ok) navigate("/");
  };

  const set = (k) => (v) => setForm({ ...form, [k]: v });

  return (
    <PageWrapper>
      <div className="container-app grid min-h-[70vh] place-items-center py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-2xl font-black text-white">ب</div>
            <h1 className="text-2xl font-black">إنشاء حساب جديد</h1>
            <p className="text-sm text-slate-500">انضم إلى عائلة البراق</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field icon={<FiUser />} placeholder="الاسم الكامل" value={form.name} onChange={set("name")} />
            <Field icon={<FiMail />} type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={set("email")} />
            <Field icon={<FiPhone />} placeholder="رقم الهاتف" value={form.phone} onChange={set("phone")} />
            <Field icon={<FiLock />} type="password" placeholder="كلمة المرور" value={form.password} onChange={set("password")} />
            <Field icon={<FiLock />} type="password" placeholder="تأكيد كلمة المرور" value={form.password_confirmation} onChange={set("password_confirmation")} />
            <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="font-bold text-brand-500 hover:underline">سجّل الدخول</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

function Field({ icon, ...props }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-brand-500">
      <span className="text-slate-400">{icon}</span>
      <input {...props} onChange={(e) => props.onChange(e.target.value)} required className="w-full bg-transparent py-3 text-sm outline-none" />
    </div>
  );
}
