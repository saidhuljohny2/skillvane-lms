export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-aurora hero-aurora-a" />
      <div className="hero-aurora hero-aurora-b" />
      <div className="hero-aurora hero-aurora-c" />
      <div className="hero-grid absolute inset-0 opacity-[0.14]" />
      <div className="hero-scan-line absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7cc7ff]/60 to-transparent" />
      <div className="hero-beam absolute left-1/2 top-0 h-[55%] w-px -translate-x-1/2 bg-gradient-to-b from-[#7cc7ff]/50 via-[#18c29c]/20 to-transparent" />
      {[
        { left: "12%", top: "22%", delay: "0s" },
        { left: "78%", top: "18%", delay: "1.2s" },
        { left: "68%", top: "62%", delay: "2.1s" },
        { left: "24%", top: "70%", delay: "0.8s" },
        { left: "88%", top: "48%", delay: "1.6s" },
        { left: "42%", top: "38%", delay: "2.8s" },
      ].map((dot) => (
        <span
          key={`${dot.left}-${dot.top}`}
          className="hero-particle absolute h-1.5 w-1.5 rounded-full bg-[#7cc7ff]"
          style={{ left: dot.left, top: dot.top, animationDelay: dot.delay }}
        />
      ))}
    </div>
  );
}
