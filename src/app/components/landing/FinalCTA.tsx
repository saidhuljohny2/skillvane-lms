import { ArrowRight } from "lucide-react";
import { Reveal } from "@/app/components/effects/Reveal";

export function FinalCTA({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(24,194,156,0.2),transparent_45%),radial-gradient(ellipse_at_80%_30%,rgba(242,184,75,0.12),transparent_35%)]" />
      <div className="aurora-mesh absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-black text-white sm:text-5xl">
            Start your GCP journey today
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            5 programs. Live batch, recordings, foundation & projects. Trusted
            by 2,500+ professionals across India.
          </p>
          <button
            type="button"
            onClick={() => scrollTo("courses")}
            className="magnetic-button group mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-10 py-4 text-base font-black text-white shadow-2xl shadow-[#18c29c]/30"
          >
            Browse All Courses
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
