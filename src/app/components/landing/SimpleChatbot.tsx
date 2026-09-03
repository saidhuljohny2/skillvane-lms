import { useState } from "react";
import { ArrowRight, Bot, MessageCircle, Send, X } from "lucide-react";

const CHAT_OPTIONS = [
  {
    label: "Course fees",
    answer:
      "The main GCP Data Engineering live batch is ₹12,000. Other self-paced and project courses are listed in the Courses section with their current prices. Enroll in 2 or more courses in one checkout to get an extra 10% off.",
  },
  {
    label: "Live batch timing",
    answer:
      "The next GCP Data Engineering live batch starts on August 26 at 9:30 PM IST and runs for 3 months.",
  },
  {
    label: "Free demo",
    answer:
      "Free demo classes are planned for August 26, 27, and 28 at 9:30 PM IST. You can join the demo from the live batch course card.",
  },
  {
    label: "Curriculum",
    answer:
      "You can download the curriculum from each course card. The live batch card includes Download Curriculum and Join Demo actions side by side.",
  },
  {
    label: "Drive access",
    answer:
      "After enrollment, request Google Drive access from your student dashboard. Access is usually provided to your registered email inbox within 24 hours.",
  },
  {
    label: "How to enroll",
    answer:
      "Choose a course, click Enroll, complete payment, and then open My Dashboard to access your enrolled course details.",
  },
] as const;

export function SimpleChatbot({
  whatsappLink,
}: {
  whatsappLink: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<(typeof CHAT_OPTIONS)[number]>(
    CHAT_OPTIONS[0],
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-[#2dd4a6]/20 bg-[#0b1522]/95 px-3 py-3 text-left shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
        aria-label="Open SkillVane chatbot"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2dd4a6] shadow-lg shadow-[#2dd4a6]/10">
          <Bot className="h-5 w-5 text-[#04110d]" />
        </span>
        <span className="hidden sm:block">
          <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#8bedd0]">
            Ask SkillVane
          </span>
          <span className="mt-0.5 block text-sm font-bold text-white">
            Course help
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-3 z-50 w-[min(calc(100vw-1.5rem),360px)] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#08121f] shadow-[0_24px_65px_rgba(0,0,0,0.42)] sm:bottom-5 sm:right-5">
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0c1827] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#2dd4a6]">
            <Bot className="h-5 w-5 text-[#04110d]" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8bedd0]">
              SkillVane Assistant
            </p>
            <p className="truncate text-sm font-bold text-white">
              Quick answers for visitors
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          aria-label="Close chatbot"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0b1522] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#eab96e]">
            <MessageCircle className="h-3.5 w-3.5" />
            {active.label}
          </div>
          <p className="text-sm leading-6 text-slate-200">{active.answer}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {CHAT_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setActive(option)}
              className={`rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                active.label === option.label
                  ? "border-[#2dd4a6]/35 bg-[#2dd4a6]/10 text-[#8bedd0]"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-[#7cc7ff]/30 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#25D366]/15"
        >
          <Send className="h-4 w-4" />
          Chat on WhatsApp
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
