export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-aurora hero-aurora-a opacity-40" />
      <div className="hero-aurora hero-aurora-b opacity-35" />
      <div className="hero-grid absolute inset-0 opacity-[0.08]" />
    </div>
  );
}
