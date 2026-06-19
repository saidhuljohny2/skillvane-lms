type EnrollmentTickerProps = {
  messages: string[];
  activeIndex: number;
};

export function EnrollmentTicker({ messages, activeIndex }: EnrollmentTickerProps) {
  return (
    <div className="enrollment-ticker sticky top-16 z-[65] border-y border-white/8 bg-[#0a1528]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 overflow-hidden">
        <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#18c29c]/30 bg-[#18c29c]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#9cf8dd]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c29c]" />
          </span>
          Live
        </span>
        <div className="relative flex-1 h-5 overflow-hidden">
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
      </div>
    </div>
  );
}
