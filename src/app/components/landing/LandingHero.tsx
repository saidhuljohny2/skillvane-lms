import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Cloud,
  Play,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { GcpCloudVisual } from "@/app/components/effects/GcpCloudVisual";
import { HeroBackground } from "@/app/components/effects/HeroBackground";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { Reveal, RevealStagger, RevealItem } from "@/app/components/effects/Reveal";

const STATS = [
  { icon: Users, val: "2500+", sub: "Learners" },
  { icon: Star, val: "4.9/5", sub: "Rating" },
  { icon: Award, val: "9+ yrs", sub: "Experience" },
  { icon: Cloud, val: "12+", sub: "GCP services" },
];

export function LandingHero({
  scrollTo,
}: {
  scrollTo: (id: string) => void;
}) {
  return (
    <section className="hero-solid relative overflow-hidden bg-[#060d17] lg:min-h-[100svh]">
      <HeroBackground />

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 48% 42% at 78% 35%, rgba(76,141,255,0.11), transparent 58%), radial-gradient(ellipse 38% 32% at 20% 62%, rgba(45,212,166,0.075), transparent 55%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:min-h-[100svh] lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pb-24 lg:pt-28">
        <div className="relative z-10 order-1 lg:order-1">
          <Reveal>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#2dd4a6]/20 bg-[#2dd4a6]/[0.07] px-3 py-2 sm:mb-7">
              <Sparkles className="h-3.5 w-3.5 text-[#65e5c1]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8bedd0] sm:text-xs">
                SkillVane IT Academy
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div>
              <h1 className="max-w-2xl text-[2.5rem] font-black leading-[1.02] tracking-[-0.045em] text-white min-[390px]:text-[2.8rem] sm:text-6xl lg:text-[4rem]">
                Master{" "}
                <span className="bg-gradient-to-r from-[#65e5c1] via-[#8bc8ff] to-[#eab96e] bg-clip-text text-transparent">
                  GCP Data Engineering
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                Learn BigQuery, Dataflow, Composer, Pub/Sub &amp; more - taught
                live by{" "}
                <span className="font-bold text-white">Shaik Saidhul</span>,
                with hands-on projects and career support.
              </p>

              <button
                type="button"
                onClick={() => scrollTo("courses")}
                className="mt-6 inline-flex max-w-full items-center gap-2 rounded-lg border border-[#eab96e]/20 bg-[#eab96e]/[0.07] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#f2d29f] sm:px-4 sm:text-xs sm:tracking-[0.14em]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c29c]" />
                </span>
                Live batch · August 26 · 9:30 PM IST
              </button>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollTo("courses")}
                  className="magnetic-button group inline-flex items-center justify-center gap-2 rounded-xl bg-[#2dd4a6] px-6 py-3.5 text-sm font-black text-[#04110d] shadow-xl shadow-[#2dd4a6]/10 hover:bg-[#55dfb9] sm:px-8 sm:py-4 sm:text-base"
                >
                  Explore Courses
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("free-learning")}
                  className="magnetic-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.035] px-6 py-3.5 text-sm font-bold text-white hover:border-white/20 hover:bg-white/[0.06] sm:px-8 sm:py-4 sm:text-base"
                >
                  <Play className="h-5 w-5 text-[#eab96e]" />
                  Free Lessons
                </button>
              </div>
            </div>
          </Reveal>

          <RevealStagger
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
            stagger={0.05}
          >
            {STATS.map(({ icon: Icon, val, sub }) => (
              <RevealItem key={sub}>
                <div className="glass-stat rounded-xl p-3.5 text-center sm:p-4 sm:text-left">
                  <Icon className="mx-auto mb-2 h-4 w-4 text-[#8bc8ff] sm:mx-0" />
                  <div className="text-xl font-black text-white sm:text-2xl">
                    <AnimatedCounter value={val} />
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400">
                    {sub}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>

        <Reveal delay={0.1} className="relative order-2 lg:order-2">
          <div className="glass-panel glass-panel-glow mx-auto w-full max-w-[460px] rounded-[1.5rem] p-4 sm:max-w-none sm:rounded-[1.75rem] sm:p-6">
            <p className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.24em] text-[#8bedd0]">
              Google Cloud data platform
            </p>
            <GcpCloudVisual />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:mt-5 sm:gap-2">
              {["BigQuery", "Dataflow", "Composer", "Pub/Sub", "DataProc"].map(
                (tag) => (
                  <span
                    key={tag}
                  className="glass-pill px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:px-3 sm:text-[10px]"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
            <div className="glass-pill mx-auto mt-3 flex max-w-sm items-center justify-center gap-2 px-3 py-2.5 sm:mt-4 sm:px-4">
              <Cloud className="h-4 w-4 text-[#4285F4]" />
              <span className="text-[11px] font-bold text-slate-300 sm:text-xs">
                Production-grade GCP training
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollTo("courses")}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        className="glass-pill absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white sm:flex"
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-[#18c29c]" />
        View programs
      </motion.button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07111d] to-transparent" />
    </section>
  );
}
