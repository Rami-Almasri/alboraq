import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="container-app grid min-h-[70vh] place-items-center text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h1 className="text-8xl font-black text-brand-500">404</h1>
          <p className="mt-2 text-xl font-bold text-slate-700">الصفحة غير موجودة</p>
          <Link to="/" className="btn-primary mt-6">العودة للرئيسية</Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
