import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Counts up from 0 to `to` the first time it scrolls into view.
 * Uses an eased requestAnimationFrame loop for a smooth ramp.
 */
export default function AnimatedCounter({ to, duration = 1600, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
