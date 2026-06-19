import { LIVE_BATCH } from "@/app/data/marketing";

type LiveBatchBannerProps = {
  onClick?: () => void;
};

export function LiveBatchBanner({ onClick }: LiveBatchBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-left transition-colors hover:border-primary/50 hover:bg-primary/15 sm:gap-2.5 sm:px-4 sm:py-2"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="truncate text-xs font-semibold text-primary">
        {LIVE_BATCH.headline}
      </span>
      <span className="hidden text-xs text-muted-foreground sm:inline">·</span>
      <span className="hidden text-xs text-muted-foreground sm:inline">
        {LIVE_BATCH.subline}
      </span>
    </button>
  );
}
