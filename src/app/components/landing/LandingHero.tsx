import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Play,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { GcpInstructorVisual } from "@/app/components/effects/GcpInstructorVisual";
import { HeroBackground } from "@/app/components/effects/HeroBackground";
import { FloatingOrbs } from "@/app/components/effects/FloatingOrbs";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { Reveal, RevealStagger, RevealItem } from "@/app/components/effects/Reveal";

const STATS = [
  { icon: Users, val: "2500+", sub: "Learners" },
  { icon: Star, val: "4.9/5", sub: "Rating" },
  { icon: Award, val: "9+ yrs", sub: "Experience" },
  { icon: Sparkles, val: "12+", sub: "GCP services" },
];

export function LandingHero({
  instructorPhoto,
  scrollTo,
}: {
  instructorPhoto: string;
  scrollTo: (id: string) => void;
}) {
  return (
    <section className="hero-glass relative min-h-[100svh] overflow-hidden bg-[#050c16]">
      <HeroBackground />
      <FloatingOrbs />

      {/* Soft color washes for glass depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 75% 35%, rgba(66,133,244,0.12), transparent 55%), radial-gradient(ellipse 40% 35% at 20% 70%, rgba(24,194,156,0.1), transparent 50%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-28">
        {/* Copy — glass panel */}
        <div className="relative z-10 order-2 lg:order-1">
          <Reveal>
            <div className="glass-pill mb-6 inline-flex items-center gap-2 px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 text-[#8df5d7]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#9cf8dd]">
                SkillVane IT Academy
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <h1 className="text-[2.2rem] font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3rem]">
                Master{" "}
                <span className="text-shimmer bg-gradient-to-r from-[#4285F4] via-[#18c29c] to-[#f2b84b] bg-clip-text text-transparent">
                  GCP Data Engineering
                </span>
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
                Learn BigQuery, Dataflow, Composer, Pub/Sub &amp; more — taught
                live by{" "}
                <span className="font-bold text-white">Shaik Saidhul</span>,
                with hands-on projects and career support.
              </p>

              <button
                type="button"
                onClick={() => scrollTo("courses")}
                className="glass-pill attention-vibrate mt-5 inline-flex items-center gap-2 border-[#f2b84b]/25 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#ffe4a3]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c29c]" />
                </span>
                Live batch · July 1 · 7 AM IST
              </button>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollTo("courses")}
                  className="magnetic-button group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4285F4]/90 via-[#18c29c] to-[#2f80ed] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#18c29c]/25 backdrop-blur-sm sm:text-base sm:px-8 sm:py-4"
                >
                  Explore Courses
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("free-learning")}
                  className="glass-btn magnetic-button inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white sm:text-base sm:px-8 sm:py-4"
                >
                  <Play className="h-5 w-5 text-[#f2b84b]" />
                  Free Lessons
                </button>
              </div>
            </div>
          </Reveal>

          <RevealStagger
            className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
            stagger={0.05}
          >
            {STATS.map(({ icon: Icon, val, sub }) => (
              <RevealItem key={sub}>
                <div className="glass-stat rounded-2xl p-3.5 text-center sm:p-4 sm:text-left">
                  <Icon className="mx-auto mb-2 h-4 w-4 text-[#7cc7ff] sm:mx-0" />
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

        {/* Instructor + GCP orbit visual */}
        <Reveal delay={0.1} className="relative order-1 lg:order-2">
          <div className="glass-panel glass-panel-glow rounded-[2rem] p-4 sm:p-6">
            <p className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.24em] text-[#8df5d7]">
              Your trainer at the center of the GCP stack
            </p>
            <GcpInstructorVisual instructorPhoto={instructorPhoto} />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {["BigQuery", "Dataflow", "Composer", "Pub/Sub", "DataProc"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="glass-pill px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
            <div className="glass-pill mx-auto mt-4 flex max-w-sm items-center justify-center gap-2 px-4 py-2.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-[#f2b84b] text-[#f2b84b]"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-300">
                4.9 · Google Certified Trainer
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08111f] to-transparent" />
    </section>
  );
}
