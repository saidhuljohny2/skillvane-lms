type FloatingBadge = {
  label: string;
  left?: string;
  right?: string;
  top: string;
  delay: string;
  duration: string;
  color: string;
};

const BADGES: FloatingBadge[] = [
  { label: "BigQuery", left: "6%", top: "14%", delay: "0s", duration: "7s", color: "#0abab5" },
  { label: "Dataflow", right: "8%", top: "20%", delay: "1.2s", duration: "8s", color: "#3d3d3d" },
  { label: "Pub/Sub", left: "4%", top: "58%", delay: "0.6s", duration: "9s", color: "#81d8d0" },
  { label: "Composer", right: "5%", top: "52%", delay: "1.8s", duration: "7.5s", color: "#ea4335" },
  { label: "GCS", left: "12%", top: "78%", delay: "2.4s", duration: "8.5s", color: "#0abab5" },
  { label: "Beam", right: "14%", top: "72%", delay: "0.9s", duration: "6.5s", color: "#81d8d0" },
];

type FloatingBadgesProps = {
  variant?: "hero" | "section";
};

export function FloatingBadges({ variant = "hero" }: FloatingBadgesProps) {
  const opacity = variant === "hero" ? "opacity-70" : "opacity-50";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${opacity}`} aria-hidden>
      {BADGES.map((badge) => (
        <span
          key={badge.label}
          className="float-badge absolute rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] backdrop-blur-md"
          style={{
            left: badge.left,
            right: badge.right,
            top: badge.top,
            animationDelay: badge.delay,
            animationDuration: badge.duration,
            color: badge.color,
            borderColor: `${badge.color}44`,
            background: `${badge.color}18`,
            boxShadow: `0 8px 24px ${badge.color}22`,
          }}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
