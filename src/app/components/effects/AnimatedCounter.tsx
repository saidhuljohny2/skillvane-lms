import { useEffect, useState } from "react";
import { useInView } from "./useInView";

function parseStat(val: string) {
  const match = val.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: val, decimals: 0 };
  const num = parseFloat(match[1]);
  const suffix = match[2];
  const decimals = match[1].includes(".") ? 1 : 0;
  return { num, suffix, decimals };
}

export function AnimatedCounter({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const { ref, inView } = useInView();
  const { num, suffix, decimals } = parseStat(value);
  const [display, setDisplay] = useState(
    decimals > 0 ? `0.0${suffix}` : `0${suffix}`,
  );

  useEffect(() => {
    if (!inView) return;

    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = num * eased;
      setDisplay(
        decimals > 0
          ? current.toFixed(decimals) + suffix
          : Math.round(current) + suffix,
      );
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, num, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
