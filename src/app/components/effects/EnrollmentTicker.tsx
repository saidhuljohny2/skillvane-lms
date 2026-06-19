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
    <div className="enrollment-ticker sticky top-16 z-[65] border-b border-white/[0.06] bg-[#050b14]/80 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center gap-4 overflow-hidden px-4 py-2 sm:px-6">
        <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#18c29c]">
          Live
        </span>

        <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
          {messages.map((msg, i) => (
            <p
              key={msg}
              className={`absolute inset-0 truncate text-sm text-slate-400 transition-all duration-500 ${
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
            className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[#9cf8dd] transition-colors hover:text-white"
          >
            Enroll
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
