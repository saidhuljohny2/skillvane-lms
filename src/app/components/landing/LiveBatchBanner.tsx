import { LIVE_BATCH } from "@/app/data/marketing";

type LiveBatchBannerProps = {
  onClick?: () => void;
};

export function LiveBatchBanner({ onClick }: LiveBatchBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2.5 rounded-full border border-[#18c29c]/25 bg-[#18c29c]/8 px-4 py-2 text-left transition-colors hover:border-[#18c29c]/45 hover:bg-[#18c29c]/12"
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c29c]" />
      </span>
      <span className="text-xs font-semibold text-[#9cf8dd]">
        {LIVE_BATCH.headline}
      </span>
      <span className="hidden text-xs text-slate-500 sm:inline">·</span>
      <span className="hidden text-xs text-slate-500 sm:inline">
        {LIVE_BATCH.subline}
      </span>
    </button>
  );
}
