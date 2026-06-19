import { ArrowRight } from "lucide-react";

type EnrollmentTickerProps = {
  messages: string[];
  activeIndex: number;
  onEnrollClick?: () => void;
};

export function EnrollmentTicker({
  messages,
  activeIndex,
  onEnrollClick,
}: EnrollmentTickerProps) {
  return (
    <div className="enrollment-ticker sticky top-14 z-[65] border-b border-border bg-background/95 backdrop-blur-md sm:top-16">
      <div className="sv-page flex items-center gap-3 py-2 sm:gap-4">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          Live
        </span>

        <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
          {messages.map((msg, i) => (
            <p
              key={msg}
              className={`absolute inset-0 truncate text-sm text-muted-foreground transition-all duration-500 ${
                i === activeIndex
                  ? "translate-y-0 opacity-100"
                  : i === (activeIndex - 1 + messages.length) % messages.length
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
              }`}
            >
              {msg}
            </p>
          ))}
        </div>

        {onEnrollClick && (
          <button
            type="button"
            onClick={onEnrollClick}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-foreground"
          >
            Enroll
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
