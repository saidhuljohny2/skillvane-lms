import { ArrowRight } from "lucide-react";
import { Reveal } from "@/app/components/effects/Reveal";

export function FinalCTA({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#060d17] py-16 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[1.75rem] border border-[#2dd4a6]/20 bg-[#0b1725] px-6 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,212,166,0.13),transparent_48%),radial-gradient(ellipse_at_90%_60%,rgba(234,185,110,0.07),transparent_38%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-black tracking-[-0.035em] text-white sm:text-5xl">
              Start your GCP journey today
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
              5 programs. Live batch, recordings, foundation & projects. Trusted
              by 2,500+ professionals across India.
            </p>
            <button
              type="button"
              onClick={() => scrollTo("courses")}
              className="magnetic-button group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2dd4a6] px-9 py-4 text-base font-black text-[#04110d] shadow-xl shadow-[#2dd4a6]/10 hover:bg-[#55dfb9]"
            >
              Browse All Courses
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
