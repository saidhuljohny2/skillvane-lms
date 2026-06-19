export function CertificateStamp({
  size = 88,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="wax-preview" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="45%" stopColor="#f2b84b" />
          <stop offset="100%" stopColor="#b8860b" />
        </radialGradient>
        <filter id="stampShadow-preview">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#07111f" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#stampShadow-preview)">
        <circle cx="60" cy="60" r="54" fill="url(#wax-preview)" stroke="#8b6914" strokeWidth="2" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={60 + Math.cos(a) * 48}
              y1={60 + Math.sin(a) * 48}
              x2={60 + Math.cos(a) * 56}
              y2={60 + Math.sin(a) * 56}
              stroke="#8b6914"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="60" cy="60" r="38" fill="none" stroke="#7a5f10" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="60" y="48" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#3d2e06" letterSpacing="2">
          SKILLVANE
        </text>
        <text x="60" y="66" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontWeight="900" fill="#1a1404">
          VERIFIED
        </text>
        <text x="60" y="80" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="800" fill="#4a3a0a" letterSpacing="1.5">
          GCP DE · 2026
        </text>
      </g>
    </svg>
  );
}
