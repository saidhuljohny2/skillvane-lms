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
    teal: "border-[#3b82f6]/20 bg-[#3b82f6]/[0.07] text-[#93c5fd]",
    gold: "border-[#eab96e]/20 bg-[#eab96e]/[0.07] text-[#f2d29f]",
    red: "border-red-400/20 bg-red-500/[0.07] text-red-200",
  };

  return (
    <Reveal
      className={`mb-8 sm:mb-10 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}
    >
      <span
        className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${accentStyles[accent]}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {eyebrow}
      </span>
      <h2 className="text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
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
