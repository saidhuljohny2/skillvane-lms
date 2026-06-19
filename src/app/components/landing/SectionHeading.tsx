import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-10 max-w-2xl ${alignClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18c29c]">
        {eyebrow}
      </p>
      <h2
        className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-400">{description}</p>
      )}
    </div>
  );
}
