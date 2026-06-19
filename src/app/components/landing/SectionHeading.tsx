import type { ReactNode } from "react";
import { Reveal } from "@/app/components/effects/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  accent = "teal",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  accent?: "teal" | "gold" | "red";
}) {
  const accentStyles = {
    teal: "border-[#18c29c]/25 bg-[#18c29c]/10 text-[#8df5d7]",
    gold: "border-[#f2b84b]/25 bg-[#f2b84b]/10 text-[#ffe4a3]",
    red: "border-red-400/25 bg-red-500/10 text-red-200",
  };

  return (
    <Reveal
      className={`mb-8 sm:mb-10 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}
    >
      <span
        className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] ${accentStyles[accent]}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
        {eyebrow}
      </span>
      <h2 className="text-3xl font-black text-white sm:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}

export function SectionShell({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`section-shell relative overflow-hidden py-14 sm:py-20 ${className}`}
    >
      <div className="section-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
