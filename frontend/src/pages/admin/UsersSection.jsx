import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiSearch, FiEdit2, FiTrash2, FiSave, FiShield, FiUser } from "react-icons/fi";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Modal, ConfirmDialog, SectionHeader, EmptyRow, SkeletonRows } from "./ui";

const ROLE_LABELS = { admin: "مدير", support: "دعم", customer: "عميل" };
const ROLE_TONE = {
  admin: "bg-brand-100 text-brand-700",
  support: "bg-cyan-100 text-cyan-700",
  customer: "bg-slate-100 text-slate-500",
};

export default function UsersSection() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users", { params: { search, per_page: 50 } });
      setUsers(data.data?.data || data.data || []);
    } catch {
      toast.error("تعذّر تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/admin/roles").then((r) => setRoles(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const remove = async (u) => {
    try {
      await api.delete(`/admin/users/${u.id}`);
      setUsers((list) => list.filter((x) => x.id !== u.id));
      toast.success("تم حذف المستخدم");
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر الحذف");
    } finally {
      setDel(null);
    }
  };

  return (
    <div>
      <SectionHeader title="المستخدمون" subtitle={`${users.length} مستخدم`} />

      <div className="card mb-5 flex items-center gap-2 p-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
          <FiSearch className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو البريد أو الهاتف..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4 font-bold">المستخدم</th>
                <th className="p-4 font-bold">الهاتف</th>
                <th className="p-4 font-bold">الأدوار</th>
                <th className="p-4 font-bold">الطلبات</th>
                <th className="p-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <SkeletonRows colSpan={5} />
              ) : users.length ? (
                users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-brand-50/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 font-bold text-brand-600">
                          {u.name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.name}{u.id === me?.id && <span className="mr-1 text-xs text-brand-400">(أنت)</span>}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{u.phone || "—"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles?.length ? u.roles : ["customer"]).map((r) => (
                          <span key={r} className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ROLE_TONE[r] || "bg-slate-100 text-slate-500"}`}>
                            {ROLE_LABELS[r] || r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{u.orders_count ?? 0}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEdit(u)} className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-brand-100" title="تعديل الأدوار"><FiEdit2 /></button>
                        <button
                          onClick={() => setDel(u)}
                          disabled={u.id === me?.id}
                          className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                          title="حذف"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={5} icon="👥" text="لا يوجد مستخدمون" />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {edit && (
          <RolesModal
            user={edit}
            roles={roles}
            onClose={() => setEdit(null)}
            onSaved={() => { setEdit(null); load(); }}
          />
        )}
        {del && (
          <ConfirmDialog
            title="حذف المستخدم؟"
            message={`سيتم حذف «${del.name}» وكل بياناته نهائياً.`}
            onCancel={() => setDel(null)}
            onConfirm={() => remove(del)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RolesModal({ user, roles, onClose, onSaved }) {
  const [selected, setSelected] = useState(new Set(user.roles || []));
  const [saving, setSaving] = useState(false);

  const toggle = (r) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(r) ? next.delete(r) : next.add(r);
      return next;
    });
  };

  const submit = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/users/${user.id}`, { roles: [...selected] });
      toast.success("تم تحديث الأدوار");
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={`أدوار ${user.name}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost flex-1">إلغاء</button>
          <button onClick={submit} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
            <FiSave /> {saving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        </>
      }
    >
      <div className="space-y-2">
        {roles.map((r) => {
          const on = selected.has(r);
          return (
            <button
              key={r}
              onClick={() => toggle(r)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right transition-colors ${
                on ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-2 font-bold text-slate-700">
                {r === "admin" ? <FiShield className="text-brand-500" /> : <FiUser className="text-slate-400" />}
                {ROLE_LABELS[r] || r}
              </span>
              <span className={`grid h-5 w-5 place-items-center rounded-md text-xs text-white ${on ? "bg-brand-500" : "bg-slate-200"}`}>
                {on ? "✓" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
