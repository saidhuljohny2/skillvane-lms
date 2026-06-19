import { LIVE_BATCH } from "@/app/data/marketing";
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
    <div className="enrollment-ticker sticky top-16 z-[65] border-y border-white/8 bg-[#0a1528]/92 backdrop-blur-xl">
      <div className="ticker-shimmer pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-2.5 sm:px-6">
        <span className="hidden flex-shrink-0 items-center gap-1.5 rounded-full border border-[#f2b84b]/35 bg-[#f2b84b]/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffe4a3] sm:inline-flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f2b84b] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f2b84b]" />
          </span>
          New Batch
        </span>

        <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#18c29c]/30 bg-[#18c29c]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#9cf8dd]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c29c]" />
          </span>
          Live
        </span>

        <div className="relative hidden h-5 min-w-0 flex-1 overflow-hidden sm:block">
          <p className="truncate text-xs font-semibold text-[#9cf8dd]/90">
            {LIVE_BATCH.headline}
          </p>
        </div>

        <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
          {messages.map((msg, i) => (
            <p
              key={msg}
              className={`absolute inset-0 truncate text-sm font-semibold text-slate-300 transition-all duration-500 ${
                i === activeIndex
                  ? "translate-y-0 opacity-100"
                  : i === (activeIndex - 1 + messages.length) % messages.length
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
              }`}
            >
              <span className="text-[#f2b84b]">●</span> {msg}
            </p>
          ))}
        </div>

        {onEnrollClick && (
          <button
            type="button"
            onClick={onEnrollClick}
            className="flex-shrink-0 inline-flex items-center gap-1 rounded-full border border-[#18c29c]/30 bg-[#18c29c]/15 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#9cf8dd] transition-colors hover:border-[#18c29c]/50 hover:bg-[#18c29c]/25"
          >
            Enroll
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
