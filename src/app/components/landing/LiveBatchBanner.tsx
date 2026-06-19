import { ArrowRight } from "lucide-react";
import { LIVE_BATCH } from "@/app/data/marketing";

type LiveBatchBannerProps = {
  onClick?: () => void;
};

export function LiveBatchBanner({ onClick }: LiveBatchBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="attention-vibrate group mb-6 inline-flex w-full max-w-xl flex-col items-start gap-1 rounded-2xl border border-[#f2b84b]/40 bg-gradient-to-r from-[#f2b84b]/14 via-[#18c29c]/10 to-[#4285f4]/10 px-4 py-3 text-left shadow-lg shadow-[#f2b84b]/15 backdrop-blur-md transition-all hover:border-[#f2b84b]/65 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-3.5"
    >
      <span className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#18c29c]" />
        </span>
        <span className="rounded-full border border-[#18c29c]/30 bg-[#18c29c]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#9cf8dd]">
          New Batch Live
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-sm font-black text-transparent text-gradient-animate sm:text-base">
          {LIVE_BATCH.headline}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold text-slate-400 sm:text-xs">
          {LIVE_BATCH.subline} · {LIVE_BATCH.timing}
        </span>
      </span>

      <ArrowRight className="hidden h-4 w-4 flex-shrink-0 text-white transition-transform group-hover:translate-x-1 sm:block" />
    </button>
  );
}
