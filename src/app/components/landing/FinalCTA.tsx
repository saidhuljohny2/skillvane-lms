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
          <div className="sv-panel-lg relative overflow-hidden p-6 text-center sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                New batch enrolling now
              </span>
              <h2
                className="mx-auto max-w-2xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Start your GCP Data Engineering journey with Shaik Saidhul
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
                Join 2,500+ learners. Live classes, hands-on projects, and career
                support — all in one academy.
              </p>
              <button type="button" onClick={onExploreCourses} className="sv-btn-primary mt-6 sm:mt-8">
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
