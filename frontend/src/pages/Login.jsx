import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(form);
    if (ok) navigate("/");
  };

  return (
    <PageWrapper>
      <div className="container-app grid min-h-[70vh] place-items-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card w-full max-w-md p-8"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-2xl font-black text-white">
              ب
            </div>
            <h1 className="text-2xl font-black">مرحباً بعودتك</h1>
            <p className="text-sm text-slate-500">سجّل الدخول لمتابعة التسوق</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field icon={<FiMail />} type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field icon={<FiLock />} type="password" placeholder="كلمة المرور" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="font-bold text-brand-500 hover:underline">أنشئ حساباً</Link>
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
      <input
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
        required
        className="w-full bg-transparent py-3 text-sm outline-none"
      />
    </div>
  );
}
