import { useEffect, useState } from "react";
import { useInView } from "./useInView";

type AnimatedCounterProps = {
  value: string;
  className?: string;
  duration?: number;
};

function parseCounterValue(raw: string) {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { numeric: null as number | null, suffix: raw, decimals: 0 };

  const numericPart = match[1];
  const suffix = match[2];
  const decimals = numericPart.includes(".") ? numericPart.split(".")[1].length : 0;
  return { numeric: parseFloat(numericPart), suffix, decimals };
}

export function AnimatedCounter({
  value,
  className = "",
  duration = 1600,
}: AnimatedCounterProps) {
  const { ref, inView } = useInView(0.3);
  const { numeric, suffix, decimals } = parseCounterValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || numeric === null) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numeric * eased;
      setDisplay(
        decimals > 0 ? `${current.toFixed(decimals)}${suffix}` : `${Math.round(current)}${suffix}`,
      );
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, numeric, suffix, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
