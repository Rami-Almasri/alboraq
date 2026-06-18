/**
 * A fixed, living backdrop for the whole app: drifting aurora blobs over a
 * deep-space void, a slow-panning tech grid, and a soft vignette. Purely
 * decorative — sits behind everything and ignores pointer events.
 */
export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-900">
      {/* Aurora blobs */}
      <div className="absolute -top-40 right-[-10%] h-[60vh] w-[60vh] animate-aurora rounded-full bg-brand-500/30 blur-[120px]" />
      <div className="absolute top-[20%] left-[-15%] h-[55vh] w-[55vh] animate-aurora-slow rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[20%] h-[55vh] w-[55vh] animate-aurora rounded-full bg-fuchsia/20 blur-[130px]" />

      {/* Panning grid */}
      <div
        className="absolute inset-0 animate-gridpan opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,108,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(124,108,255,0.25) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 0%, transparent 75%)",
        }}
      />

      {/* Fine starfield speckle */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.35), transparent), radial-gradient(1px 1px at 85% 15%, rgba(255,255,255,0.4), transparent)",
          backgroundSize: "100% 100%",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,4,15,0.85)_100%)]" />
    </div>
  );
}
