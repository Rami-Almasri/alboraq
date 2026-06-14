import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProductReviews({ slug, reviews = [], count = 0, avg = 0, onChange }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/products/${slug}/reviews`, { rating, comment });
      toast.success("شكراً لتقييمك!");
      setComment("");
      onChange?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذر حفظ التقييم");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="mb-6 text-2xl font-black text-slate-900">التقييمات والمراجعات</h2>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Summary */}
        <div className="card h-fit p-6 text-center">
          <p className="text-5xl font-black text-brand-900">{avg || 0}</p>
          <div className="mt-2 flex justify-center text-amber-500">
            {Array(5).fill(0).map((_, i) => (
              <FiStar key={i} fill={i < Math.round(avg) ? "currentColor" : "none"} />
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-400">{count} تقييم</p>
        </div>

        {/* List + form */}
        <div>
          {/* Add review */}
          {user ? (
            <form onSubmit={submit} className="card mb-6 p-5">
              <p className="mb-3 font-bold text-slate-800">أضف تقييمك</p>
              <div className="mb-3 flex gap-1">
                {Array(5).fill(0).map((_, i) => {
                  const val = i + 1;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setRating(val)}
                      onMouseEnter={() => setHover(val)}
                      onMouseLeave={() => setHover(0)}
                      className="text-2xl text-amber-500"
                    >
                      <FiStar fill={(hover || rating) >= val ? "currentColor" : "none"} />
                    </button>
                  );
                })}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="شاركنا رأيك في المنتج..."
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500"
              />
              <button disabled={saving} className="btn-primary mt-3 disabled:opacity-50">
                {saving ? "جارٍ الإرسال..." : "إرسال التقييم"}
              </button>
            </form>
          ) : (
            <div className="card mb-6 p-5 text-center text-sm text-slate-500">
              <Link to="/login" className="font-bold text-brand-500 hover:underline">
                سجّل الدخول
              </Link>{" "}
              لإضافة تقييم
            </div>
          )}

          {/* Reviews */}
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-400">لا توجد تقييمات بعد — كن أول من يقيّم!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">
                        {r.user_name?.[0] || "؟"}
                      </div>
                      <p className="font-bold text-slate-800">{r.user_name}</p>
                    </div>
                    <div className="flex text-amber-500">
                      {Array(5).fill(0).map((_, k) => (
                        <FiStar key={k} size={14} fill={k < r.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.comment}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
