import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiX, FiTrash2 } from "react-icons/fi";

/* Full-screen dimmed overlay used by all admin modals. */
export function Overlay({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
        {children}
      </div>
    </motion.div>
  );
}

export function Modal({ title, onClose, children, footer, wide = false }) {
  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className={`card max-h-[90vh] w-full overflow-y-auto p-6 ${wide ? "max-w-3xl" : "max-w-xl"}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <FiX />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex gap-3">{footer}</div>}
      </motion.div>
    </Overlay>
  );
}

export function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-bold text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export function Toggle({ label, checked, onChange, icon }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ring-1 transition-colors ${
        checked ? "bg-brand-500 text-white ring-brand-500" : "bg-white text-slate-500 ring-slate-200"
      }`}
    >
      {icon} {label}
    </button>
  );
}

export function ConfirmDialog({ title, message, confirmText = "نعم، احذف", onCancel, onConfirm }) {
  return (
    <Overlay onClose={onCancel}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="card mx-auto w-full max-w-sm p-6 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
          <FiTrash2 size={24} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1">إلغاء</button>
          <button onClick={onConfirm} className="btn flex-1 bg-red-500 text-white hover:bg-red-600">
            {confirmText}
          </button>
        </div>
      </motion.div>
    </Overlay>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-black text-slate-800">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyRow({ colSpan, icon = "📭", text = "لا توجد بيانات" }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-12 text-center">
        <p className="text-4xl">{icon}</p>
        <p className="mt-2 font-bold text-slate-600">{text}</p>
      </td>
    </tr>
  );
}

export function SkeletonRows({ rows = 6, colSpan }) {
  return Array(rows)
    .fill(null)
    .map((_, i) => (
      <tr key={i}>
        <td colSpan={colSpan} className="p-4">
          <div className="skeleton h-10 w-full" />
        </td>
      </tr>
    ));
}

export function Denied({ msg }) {
  return (
    <div className="container-app grid place-items-center py-24 text-center">
      <span className="text-5xl">🔒</span>
      <p className="mt-4 text-lg font-bold text-slate-700">{msg}</p>
      <Link to="/login" className="btn-primary mt-4">تسجيل الدخول</Link>
    </div>
  );
}
