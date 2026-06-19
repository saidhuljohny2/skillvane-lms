import { Reveal } from "@/app/components/effects/Reveal";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { CyclingTechWords } from "@/app/components/effects/CyclingTechWords";
import { DataPipelineVisual } from "@/app/components/effects/DataPipelineVisual";
import { HeroBackground } from "@/app/components/effects/HeroBackground";
import { LiveBatchBanner } from "@/app/components/landing/LiveBatchBanner";
import { SocialStrip } from "@/app/components/landing/SocialStrip";
import { FREE_LEARNING_PLAYLIST_URL } from "@/app/data/marketing";
import { ArrowRight, Award, BookOpen, Play, Star, Users } from "lucide-react";

type LandingHeroProps = {
  onExploreCourses: () => void;
};

const STATS = [
  { icon: Users, val: "2500+", label: "Learners" },
  { icon: Star, val: "4.9/5", label: "Rating" },
  { icon: Award, val: "9+", label: "Years" },
  { icon: BookOpen, val: "5", label: "Programs" },
];

export function LandingHero({ onExploreCourses }: LandingHeroProps) {
  return (
    <section className="landing-hero relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      <HeroBackground />
      <div className="landing-hero-fade pointer-events-none absolute inset-x-0 bottom-0 h-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal delay={0}>
              <LiveBatchBanner onClick={onExploreCourses} />
            </Reveal>

            <Reveal delay={50}>
              <h1
                className="mt-6 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Become a{" "}
                <span className="bg-gradient-to-r from-[#7cc7ff] via-[#4285f4] to-[#34a853] bg-clip-text text-transparent">
                  GCP Data Engineer
                </span>
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-4 text-lg text-slate-400">
                Master <CyclingTechWords /> with live training built for working
                professionals.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onExploreCourses}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#050b14] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={FREE_LEARNING_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <Play className="h-4 w-4 text-red-400" />
                  Free Lessons
                </a>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="stats-bar mt-10 flex flex-wrap gap-6 sm:gap-8">
                {STATS.map(({ icon: Icon, val, label }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5 text-[#18c29c]" />
                      <span
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                      >
                        <AnimatedCounter value={val} />
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-8 border-t border-white/[0.06] pt-6">
                <SocialStrip />
              </div>
            </Reveal>
          </div>

          <Reveal direction="right" delay={80}>
            <div className="pipeline-hero-glow mx-auto w-full max-w-md lg:max-w-none">
              <DataPipelineVisual />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
