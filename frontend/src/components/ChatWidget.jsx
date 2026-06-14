import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiImage, FiHeadphones } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const isAgent = user?.is_agent;
  const enabled = user && !isAgent; // customers only

  const load = async () => {
    try {
      const { data } = await api.get("/chat");
      const msgs = data.data?.messages || [];
      setMessages(msgs);
      if (!open) {
        setUnread(msgs.filter((m) => m.is_agent && !m.is_read).length);
      }
    } catch {
      /* ignore */
    }
  };

  // Poll while logged in
  useEffect(() => {
    if (!enabled) return;
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, open]);

  // Scroll to newest + clear unread when open
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnread(0);
      api.post("/chat/read").catch(() => {});
    }
  }, [messages, open]);

  if (!enabled) return null;

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      const form = new FormData();
      if (text.trim()) form.append("body", text.trim());
      if (file) form.append("attachment", file);
      await api.post("/chat/messages", form, {
        headers: { "Content-Type": undefined },
      });
      setText("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-white shadow-glow"
        aria-label="chat"
      >
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold">
            {unread}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[460px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-brand-900 p-4 text-white">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
                <FiHeadphones />
              </div>
              <div>
                <p className="font-bold">دعم البراق</p>
                <p className="flex items-center gap-1 text-xs text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> متصل الآن
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
              {messages.length === 0 && (
                <p className="mt-10 text-center text-sm text-slate-400">
                  ابدأ المحادثة — فريقنا هنا لمساعدتك 👋
                </p>
              )}
              {messages.map((m) => (
                <Bubble key={m.id} m={m} mine={!m.is_agent} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <form onSubmit={send} className="flex items-center gap-2 border-t border-black/5 p-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  file ? "bg-brand-500 text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
                title="إرفاق صورة"
              >
                <FiImage />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={file ? `📎 ${file.name}` : "اكتب رسالتك..."}
                className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm outline-none"
              />
              <button
                disabled={sending}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500 text-white disabled:opacity-50"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ m, mine }) {
  return (
    <div className={`flex ${mine ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
          mine
            ? "rounded-tr-sm bg-brand-500 text-white"
            : "rounded-tl-sm bg-white text-slate-700 ring-1 ring-black/5"
        }`}
      >
        {!mine && <p className="mb-0.5 text-[10px] font-bold text-brand-500">{m.sender_name}</p>}
        {m.body && <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>}
        {m.attachments?.map((a, i) => (
          <a key={i} href={a.url} target="_blank" rel="noreferrer">
            <img src={a.url} alt="attachment" className="mt-1 max-h-40 rounded-lg" />
          </a>
        ))}
      </div>
    </div>
  );
}
