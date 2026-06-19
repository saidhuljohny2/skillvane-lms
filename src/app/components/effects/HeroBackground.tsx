export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="aurora-mesh absolute inset-0 opacity-80" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.85) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.85) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />
      <div className="noise-overlay absolute inset-0 opacity-[0.035]" />
      <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#07111f] to-transparent" />
    </div>
  );
}
