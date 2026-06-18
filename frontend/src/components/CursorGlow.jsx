import { useEffect, useRef } from "react";

/**
 * A soft spotlight that trails the pointer, easing toward it each frame for a
 * liquid feel. Disabled on touch / fine-pointer-less devices and for users who
 * prefer reduced motion. Uses screen blend so it lifts the aurora beneath it.
 */
export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const el = ref.current;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      if (el) el.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-30 h-[500px] w-[500px] rounded-full opacity-60 mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(124,108,255,0.18) 0%, rgba(34,211,238,0.08) 35%, transparent 65%)",
      }}
    />
  );
}
