import {
  Award,
  Briefcase,
  Database,
  MonitorPlay,
  Users,
  Video,
} from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/app/components/effects/Reveal";
import { SectionHeading } from "./SectionHeading";

const FEATURES = [
  {
    icon: MonitorPlay,
    title: "Live Morning Batch",
    desc: "Daily 7–8 AM IST sessions with real-time doubt clearing and instructor interaction.",
    span: "lg:col-span-2 lg:row-span-2",
    accent: "from-[#4361ee] to-[#3bc9db]",
  },
  {
    icon: Video,
    title: "Daily Recordings",
    desc: "Every session recorded and shared — never miss a topic.",
    span: "",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: Database,
    title: "Real GCP Projects",
    desc: "Healthcare & retail pipelines you can showcase in interviews.",
    span: "",
    accent: "from-red-500 to-orange-500",
  },
  {
    icon: Briefcase,
    title: "Career Support",
    desc: "Resume reviews, interview prep, and architecture walkthroughs.",
    span: "lg:col-span-2",
    accent: "from-[#18c29c] to-[#2f80ed]",
  },
  {
    icon: Users,
    title: "Private Community",
    desc: "WhatsApp & Telegram groups for peers and mentor access.",
    span: "",
    accent: "from-[#f2b84b] to-[#f59e0b]",
  },
  {
    icon: Award,
    title: "Certification Ready",
    desc: "Curriculum aligned with Google Professional Data Engineer exam.",
    span: "",
    accent: "from-cyan-500 to-blue-600",
  },
];

export function FeaturesBento({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section className="relative border-b border-white/8 bg-[#08111f] py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(24,194,156,0.1),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why SkillVane"
          title="Built for working professionals"
          description="Everything you need to go from cloud curious to production-ready data engineer — in one academy."
          align="center"
          accent="gold"
        />

        <RevealStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <RevealItem
                key={f.title}
                className={`bento-card group relative overflow-hidden rounded-2xl p-5 ${f.span}`}
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-35`}
                />
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${f.accent} p-2.5 shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-black text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </RevealItem>
            );
          })}
        </RevealStagger>

        <Reveal className="mt-8 text-center">
          <button
            type="button"
            onClick={() => scrollTo("courses")}
            className="magnetic-button inline-flex rounded-2xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-8 py-3.5 text-sm font-black text-[#9cf8dd] hover:bg-[#18c29c]/16"
          >
            See all programs →
          </button>
        </Reveal>
      </div>
    </section>
  );
}
