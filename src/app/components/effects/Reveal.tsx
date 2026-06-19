import type { ReactNode } from "react";
import { useInView } from "./useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
};

const directionClass: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "reveal-from-up",
  down: "reveal-from-down",
  left: "reveal-from-left",
  right: "reveal-from-right",
  none: "reveal-from-none",
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
}: RevealProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${directionClass[direction]} ${inView ? "reveal-visible" : ""} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
