import type { ReactNode } from "react";

export function GradientText({
  from,
  to,
  children,
  className = "",
}: {
  from: string;
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}
