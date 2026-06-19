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
    <div className={`mb-8 max-w-2xl sm:mb-10 ${alignClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2
        className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:mt-3 sm:text-3xl lg:text-4xl"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
