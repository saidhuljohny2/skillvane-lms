export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="floating-orb absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[#0abab5]/10 blur-3xl" />
      <div className="floating-orb-delayed absolute right-[6%] top-[32%] h-64 w-64 rounded-full bg-[#0abab5]/12 blur-3xl" />
      <div className="floating-orb-slow absolute bottom-[12%] left-[35%] h-80 w-80 rounded-full bg-[#3d3d3d]/8 blur-3xl" />
    </div>
  );
}
