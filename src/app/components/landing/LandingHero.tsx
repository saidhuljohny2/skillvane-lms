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
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { HeroBackground } from "@/app/components/effects/HeroBackground";
import { FloatingOrbs } from "@/app/components/effects/FloatingOrbs";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { Reveal, RevealStagger, RevealItem } from "@/app/components/effects/Reveal";

const STATS = [
  { icon: Users, val: "2500+", sub: "Learners trained" },
  { icon: Star, val: "4.9/5", sub: "Student rating" },
  { icon: Award, val: "9+ yrs", sub: "GCP experience" },
  { icon: Cloud, val: "5", sub: "Live programs" },
];

const FLOATING_TAGS = [
  "BigQuery",
  "Dataflow",
  "Composer",
  "Certified Trainer",
];

export function LandingHero({
  instructorPhoto,
  scrollTo,
}: {
  instructorPhoto: string;
  scrollTo: (id: string) => void;
}) {
  return (
    <section className="hero-cinematic relative min-h-[100svh] overflow-hidden bg-[#040a14]">
      <HeroBackground />
      <FloatingOrbs />

      {/* Ambient portrait glow — large blurred duplicate */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="hero-portrait-glow absolute -right-[10%] top-[8%] h-[min(90vh,820px)] w-[min(70vw,640px)] opacity-50"
          style={{
            backgroundImage: `url(${instructorPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040a14] via-[#040a14]/92 to-[#040a14]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040a14] via-transparent to-[#040a14]/40" />
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-4 pb-16 pt-24 sm:px-6 lg:grid-cols-2 lg:gap-4 lg:pb-20 lg:pt-28">
        {/* Copy column */}
        <div className="relative z-10 order-2 lg:order-1">
          <Reveal>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#18c29c]/25 bg-[#18c29c]/8 px-4 py-2 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#8df5d7]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#9cf8dd]">
                SkillVane IT Academy
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="max-w-xl text-[2.35rem] font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[3.35rem] xl:text-6xl">
              Learn GCP Data Engineering from a{" "}
              <span className="text-shimmer bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] bg-clip-text text-transparent">
                working professional
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Train directly with{" "}
              <span className="font-bold text-white">Shaik Saidhul</span> — daily
              live sessions, real projects, recordings, and career guidance designed
              for busy professionals across India.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <button
              type="button"
              onClick={() => scrollTo("courses")}
              className="attention-vibrate mt-5 inline-flex items-center gap-2 rounded-full border border-[#f2b84b]/35 bg-[#f2b84b]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#ffe4a3]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c29c]" />
              </span>
              New batch · July 1 · 7:00 AM IST
            </button>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo("courses")}
                className="magnetic-button group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-8 py-4 text-base font-extrabold text-white shadow-2xl shadow-[#18c29c]/30"
              >
                Explore Courses
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("free-learning")}
                className="magnetic-button inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-8 py-4 text-base font-bold text-white backdrop-blur-sm hover:border-[#f2b84b]/45"
              >
                <Play className="h-5 w-5 text-[#f2b84b]" />
                Free Lessons
              </button>
            </div>
          </Reveal>

          <RevealStagger
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
            stagger={0.06}
          >
            {STATS.map(({ icon: Icon, val, sub }) => (
              <RevealItem key={sub}>
                <div className="hero-stat-pill rounded-2xl p-3.5 sm:p-4">
                  <Icon className="mb-2 h-4 w-4 text-[#f2b84b]" />
                  <div className="text-xl font-black text-white sm:text-2xl">
                    <AnimatedCounter value={val} />
                  </div>
                  <div className="mt-0.5 text-[10px] font-semibold leading-tight text-slate-500">
                    {sub}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>

        {/* Portrait column — hero visual */}
        <Reveal
          delay={0.08}
          className="relative order-1 mx-auto w-full max-w-[420px] lg:order-2 lg:mx-0 lg:max-w-none lg:justify-self-end"
        >
          <div className="hero-portrait-stage relative">
            {/* Decorative rings */}
            <motion.div
              className="pointer-events-none absolute -inset-6 rounded-[2.5rem] border border-[#18c29c]/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="pointer-events-none absolute -inset-10 rounded-[3rem] border border-dashed border-[#f2b84b]/15"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />

            {/* Gradient halo */}
            <div className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-[#18c29c]/35 via-[#2f80ed]/20 to-[#f2b84b]/30 blur-3xl" />

            <motion.div
              className="hero-portrait-card relative overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl shadow-black/50"
              whileHover={{ scale: 1.015, y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Top shine */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-white/10 to-transparent" />

              <ImageWithFallback
                src={instructorPhoto}
                alt="Shaik Saidhul — GCP Data Engineering Instructor at SkillVane"
                className="aspect-[3/4] w-full object-cover object-[center_12%] sm:aspect-[4/5]"
              />

              {/* Side vignette for depth */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#040a14]/30 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/50 to-transparent" />

              {/* Floating skill tags */}
              <div className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
                {FLOATING_TAGS.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="rounded-full border border-white/15 bg-[#07111f]/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-200 backdrop-blur-md"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              {/* Instructor info overlay */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8df5d7]">
                      Your instructor
                    </p>
                    <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
                      Shaik Saidhul
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-300">
                      Solution Architect · Google Certified
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-center rounded-2xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 px-3 py-2 backdrop-blur-md">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-[#f2b84b] text-[#f2b84b]"
                        />
                      ))}
                    </div>
                    <span className="mt-1 text-[10px] font-black text-[#ffe4a3]">
                      4.9 / 5
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Live classes", "Daily recordings", "Career support"].map(
                    (item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-sm"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[#18c29c]" />
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </motion.div>

            {/* Accent corner mark */}
            <div className="absolute -bottom-3 -right-3 z-30 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#18c29c]/30 bg-[#07111f]/90 shadow-xl backdrop-blur-md">
              <span className="text-center text-[9px] font-black uppercase leading-tight tracking-wider text-[#9cf8dd]">
                GCP
                <br />
                Expert
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollTo("courses")}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-[#8df5d7] sm:flex"
      >
        <span>Discover courses</span>
        <div className="h-9 w-5 rounded-full border border-white/20 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-[#18c29c]" />
        </div>
      </motion.button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08111f] to-transparent" />
    </section>
  );
}
