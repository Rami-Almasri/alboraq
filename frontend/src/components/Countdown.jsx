import { useEffect, useState } from "react";

function parts(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

/**
 * Live ticking countdown to `target` (a Date or timestamp).
 * Rendered as four glassy time boxes.
 */
export default function Countdown({ target }) {
  const targetMs = target instanceof Date ? target.getTime() : target;
  const [left, setLeft] = useState(() => targetMs - Date.now());

  useEffect(() => {
    const id = setInterval(() => setLeft(targetMs - Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const { days, hours, minutes, seconds } = parts(left);
  const boxes = [
    { v: days, l: "يوم" },
    { v: hours, l: "ساعة" },
    { v: minutes, l: "دقيقة" },
    { v: seconds, l: "ثانية" },
  ];

  return (
    <div className="flex gap-2 sm:gap-3" dir="ltr">
      {boxes.map((b, i) => (
        <div
          key={i}
          className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/20 sm:h-20 sm:w-20"
        >
          <span className="text-2xl font-black tabular-nums text-white sm:text-3xl">
            {pad(b.v)}
          </span>
          <span className="text-[10px] font-semibold text-white/70">{b.l}</span>
        </div>
      ))}
    </div>
  );
}
