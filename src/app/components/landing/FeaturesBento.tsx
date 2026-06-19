import {
  Award,
  BookOpen,
  Briefcase,
  Clock,
  Layers,
  Video,
} from "lucide-react";
import { Reveal } from "@/app/components/effects/Reveal";
import { SectionHeading } from "@/app/components/landing/SectionHeading";

const FEATURES = [
  {
    icon: Clock,
    title: "Live morning batch",
    desc: "7–8 AM IST sessions designed for working professionals across India.",
    className: "sm:col-span-2",
    accent: "#18c29c",
  },
  {
    icon: Layers,
    title: "Real pipelines",
    desc: "Pub/Sub, Dataflow, BigQuery, and Composer — not slide-only theory.",
    className: "",
    accent: "#4285f4",
  },
  {
    icon: Video,
    title: "Daily recordings",
    desc: "Miss a class? Full recordings shared the same day.",
    className: "",
    accent: "#7cc7ff",
  },
  {
    icon: Briefcase,
    title: "Career support",
    desc: "Resume reviews, interview prep, and portfolio project guidance.",
    className: "sm:col-span-2",
    accent: "#f2b84b",
  },
  {
    icon: Award,
    title: "Certificate",
    desc: "Earn a SkillVane completion certificate for your LinkedIn profile.",
    className: "",
    accent: "#34a853",
  },
  {
    icon: BookOpen,
    title: "Exam-ready",
    desc: "Curriculum aligned with the Google Professional Data Engineer path.",
    className: "",
    accent: "#ea4335",
  },
];

export function FeaturesBento() {
  return (
    <section id="why-skillvane" className="landing-section landing-section-base">
      <div className="sv-page">
        <Reveal>
          <SectionHeading
            eyebrow="Why SkillVane"
            title={
              <>
                Everything you need to go{" "}
                <span className="bg-gradient-to-r from-[#7cc7ff] to-[#18c29c] bg-clip-text text-transparent">
                  job-ready on GCP
                </span>
              </>
            }
            description="Structured like top bootcamps — live instruction, projects, and support in one place."
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 60} className={feature.className}>
                <div className="sv-panel group h-full transition-colors hover:border-[#18c29c]/25">
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08]"
                    style={{ backgroundColor: `${feature.accent}18` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: feature.accent }} />
                  </div>
                  <h3 className="text-base font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
