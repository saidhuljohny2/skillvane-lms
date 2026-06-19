import { useEffect, useState } from "react";

const SECTIONS = [
  "courses",
  "free-learning",
  "instructor",
  "testimonials",
  "faq",
] as const;

export type ActiveSection = (typeof SECTIONS)[number] | "";

export function useActiveSection() {
  const [active, setActive] = useState<ActiveSection>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}
