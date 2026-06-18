import { useRef } from "react";

/**
 * Wraps a child so it leans toward the pointer while hovered, then springs
 * back on leave. Subtle (strength ~0.35) so it feels alive, not jumpy.
 */
export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
