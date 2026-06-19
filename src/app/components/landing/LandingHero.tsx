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

      <div className="sv-page relative">
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
              <p
                className="mt-3 text-xl font-semibold text-white sm:text-2xl"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                with{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-[#7cc7ff] to-[#18c29c] bg-clip-text text-transparent">
                  Shaik Saidhul
                </span>
              </p>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
                Master <CyclingTechWords /> through live morning batches, hands-on
                pipelines, and career support for working professionals.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onExploreCourses}
                  className="sv-btn-primary"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={FREE_LEARNING_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sv-btn-ghost"
                >
                  <Play className="h-4 w-4 text-red-400" />
                  Free Lessons
                </a>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="sv-panel mt-10 flex flex-wrap gap-6 sm:gap-8">
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
