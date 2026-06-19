import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[], offset = 140) {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const onScroll = () => {
      let current = sectionIds[0] ?? "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds, offset]);

  return active;
}
