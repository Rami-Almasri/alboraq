import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSend, FiUser, FiInbox } from "react-icons/fi";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

export default function Support() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [active, setActive] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadList = async () => {
    try {
      const { data } = await api.get("/admin/conversations");
      setConversations(data.data || []);
    } catch {
      /* ignore */
    }
  };

  const loadConversation = async (id) => {
    try {
      const { data } = await api.get(`/admin/conversations/${id}`);
      setActive(data.data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!user?.is_agent) return;
    loadList();
    const id = setInterval(loadList, 5000);
    return () => clearInterval(id);
  }, [user]);

  useEffect(() => {
    if (!activeId) return;
    loadConversation(activeId);
    const id = setInterval(() => loadConversation(activeId), 4000);
    return () => clearInterval(id);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active]);

  if (!user)
    return (
      <PageWrapper>
        <Denied msg="يرجى تسجيل الدخول بحساب الدعم" />
      </PageWrapper>
    );
  if (!user.is_agent)
    return (
      <PageWrapper>
        <Denied msg="هذه الصفحة مخصصة لفريق الدعم فقط" />
      </PageWrapper>
    );

  const reply = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    setSending(true);
    try {
      await api.post(`/admin/conversations/${activeId}/messages`, { body: text.trim() });
      setText("");
      await loadConversation(activeId);
      loadList();
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  return (
    <PageWrapper>
      <div className="bg-brand-900 py-8 text-white">
        <div className="container-app">
          <h1 className="text-2xl font-black">لوحة الدعم</h1>
          <p className="text-sm text-slate-300">إدارة محادثات العملاء — {user.name}</p>
        </div>
      </div>

      <div className="container-app grid gap-4 py-6 lg:grid-cols-[320px_1fr]">
        {/* Conversation list */}
        <aside className="card h-[70vh] overflow-y-auto p-2">
          {conversations.length === 0 && (
            <p className="p-6 text-center text-sm text-slate-400">لا توجد محادثات</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-right transition-colors ${
                activeId === c.id ? "bg-brand-50" : "hover:bg-slate-50"
              }`}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                <FiUser />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-800">{c.user?.name}</p>
                <p className="truncate text-xs text-slate-400">
                  {c.last_message?.body || "—"}
                </p>
              </div>
              {c.unread_count > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-white">
                  {c.unread_count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Chat panel */}
        <section className="card flex h-[70vh] flex-col">
          {!active ? (
            <div className="grid flex-1 place-items-center text-center text-slate-400">
              <div>
                <FiInbox className="mx-auto mb-2 text-4xl" />
                اختر محادثة لعرضها
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-black/5 p-4">
                <p className="font-bold text-slate-800">{active.user?.name}</p>
                <p className="text-xs text-slate-400">{active.user?.email}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                {(active.messages || []).map((m) => (
                  <div key={m.id} className={`flex ${m.is_agent ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                        m.is_agent
                          ? "rounded-tr-sm bg-brand-500 text-white"
                          : "rounded-tl-sm bg-white text-slate-700 ring-1 ring-black/5"
                      }`}
                    >
                      {m.body && <p className="whitespace-pre-wrap">{m.body}</p>}
                      {m.attachments?.map((a, i) => (
                        <a key={i} href={a.url} target="_blank" rel="noreferrer">
                          <img src={a.url} alt="" className="mt-1 max-h-40 rounded-lg" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={reply} className="flex items-center gap-2 border-t border-black/5 p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="اكتب ردك..."
                  className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm outline-none"
                />
                <button disabled={sending} className="btn-primary px-4 disabled:opacity-50">
                  <FiSend /> إرسال
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}

function Denied({ msg }) {
  return (
    <div className="container-app grid place-items-center py-28 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <span className="text-5xl">🔒</span>
        <h2 className="mt-4 text-2xl font-black">{msg}</h2>
        <Link to="/" className="btn-primary mt-6">العودة للرئيسية</Link>
      </motion.div>
    </div>
  );
}
