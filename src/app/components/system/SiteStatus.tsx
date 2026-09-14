import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import skillVaneLogo from "@/imports/logo1.png";

type OpeningState = { message: string; detail: string } | null;

export function setSiteStatus(status: OpeningState, duration = 0) {
  window.dispatchEvent(new CustomEvent("skillvane:status", { detail: { status, duration } }));
}

function LoadingMark() {
  return <div className="relative mx-auto h-20 w-20"><div className="absolute inset-0 rounded-3xl bg-[#3b82f6]/20 blur-xl" /><div className="absolute inset-0 animate-[spin_1.8s_linear_infinite] rounded-3xl border border-[#60a5fa]/30 border-t-[#f2b84b]" /><div className="absolute inset-2 flex items-center justify-center rounded-2xl bg-white p-2 shadow-2xl"><img src={skillVaneLogo} alt="" className="h-full w-full object-contain" /></div></div>;
}

export function SiteStatus() {
  const [starting, setStarting] = useState(true);
  const [online, setOnline] = useState(() => navigator.onLine);
  const [opening, setOpening] = useState<OpeningState>(null);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const readyTimer = window.setTimeout(() => setStarting(false), 850);
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; addEventListener?: (name: string, listener: () => void) => void; removeEventListener?: (name: string, listener: () => void) => void } }).connection;
    const updateConnection = () => {
      setOnline(navigator.onLine);
      setSlow(Boolean(navigator.onLine && (connection?.effectiveType === "2g" || (connection?.downlink ?? 10) < 1)));
    };
    const showOpening = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-opening-message],a[target='_blank']");
      if (!trigger) return;
      setOpening({ message: trigger.dataset.openingMessage || "Opening securely…", detail: trigger.dataset.openingDetail || "Please wait while we prepare the next page." });
      window.setTimeout(() => setOpening(null), 1100);
    };
    let statusTimer = 0;
    const updateStatus = (event: Event) => {
      const { status, duration } = (event as CustomEvent<{ status: OpeningState; duration: number }>).detail;
      window.clearTimeout(statusTimer);
      setOpening(status);
      if (status && duration > 0) statusTimer = window.setTimeout(() => setOpening(null), duration);
    };
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    connection?.addEventListener?.("change", updateConnection);
    document.addEventListener("click", showOpening, true);
    window.addEventListener("skillvane:status", updateStatus);
    updateConnection();
    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
      connection?.removeEventListener?.("change", updateConnection);
      document.removeEventListener("click", showOpening, true);
      window.removeEventListener("skillvane:status", updateStatus);
      window.clearTimeout(statusTimer);
    };
  }, []);

  if (!online) return <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#050b13] p-5 text-white"><div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0b1522] p-7 text-center shadow-2xl shadow-black/40 sm:p-9"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300"><WifiOff className="h-7 w-7" /></div><p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#f2b84b]">Connection interrupted</p><h1 className="mt-2 text-2xl font-black">You’re offline</h1><p className="mt-3 text-sm leading-6 text-slate-400">Check your internet connection. This page will recover automatically when you’re back online.</p><button type="button" onClick={() => window.location.reload()} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] px-5 py-3 font-black text-white hover:bg-[#60a5fa]"><RefreshCw className="h-4 w-4" /> Try again</button></div></div>;

  return <>{(starting || opening) && <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#050b13]/96 p-5 text-white backdrop-blur-xl" role="status" aria-live="polite"><div className="text-center"><LoadingMark /><p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-[#71d6ff]">SkillVane IT Academy</p><h1 className="mt-2 text-xl font-black sm:text-2xl">{opening?.message || "Preparing your learning space…"}</h1><div className="mx-auto mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/2 animate-[status-slide_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#3b82f6] to-[#f2b84b]" /></div></div></div>}{slow && !starting && !opening && <div className="fixed inset-x-3 bottom-3 z-[250] mx-auto max-w-lg rounded-xl border border-amber-300/20 bg-[#17130b]/95 px-4 py-3 text-center text-xs font-semibold text-amber-100 shadow-xl backdrop-blur-lg">Your connection is slow. Content may take a little longer to appear.</div>}</>;
}
