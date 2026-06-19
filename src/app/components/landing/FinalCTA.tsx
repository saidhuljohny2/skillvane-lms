import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "@/app/components/effects/Reveal";

type FinalCTAProps = {
  onExploreCourses: () => void;
};

export function FinalCTA({ onExploreCourses }: FinalCTAProps) {
  return (
    <section className="landing-section landing-section-alt">
      <div className="sv-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#18c29c]/12 via-[#050b14] to-[#4285f4]/12 p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#18c29c]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#4285f4]/12 blur-3xl" />

            <div className="relative">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f2b84b]/30 bg-[#f2b84b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#ffe4a3]">
                <Sparkles className="h-3.5 w-3.5" />
                New batch enrolling now
              </span>
              <h2
                className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Start your GCP Data Engineering journey with Shaik Saidhul
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-slate-400">
                Join 2,500+ learners. Live classes, hands-on projects, and career
                support — all in one academy.
              </p>
              <button
                type="button"
                onClick={onExploreCourses}
                className="sv-btn-primary mt-8"
              >
                Browse courses & enroll
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
