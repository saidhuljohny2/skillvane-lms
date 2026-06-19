import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  Play,
  Send,
  Users,
  Youtube,
} from "lucide-react";
import { HeroBackground } from "@/app/components/effects/HeroBackground";
import { FloatingOrbs } from "@/app/components/effects/FloatingOrbs";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { Reveal, RevealStagger, RevealItem } from "@/app/components/effects/Reveal";

const STATS = [
  { icon: Users, val: "2500+", sub: "Learners" },
  { icon: Play, val: "4.9/5", sub: "Rating" },
  { icon: CheckCircle2, val: "9+ yrs", sub: "Experience" },
  { icon: ArrowRight, val: "5", sub: "Programs" },
];

const PERKS = [
  "Daily live sessions",
  "Recordings shared",
  "Portfolio projects",
  "Resume guidance",
];

export function LandingHero({
  instructorPhoto,
  scrollTo,
}: {
  instructorPhoto: string;
  scrollTo: (id: string) => void;
}) {
  return (
    <section className="relative min-h-[88svh] overflow-hidden bg-[#07111f] pt-20 sm:pt-24">
      <HeroBackground />
      <FloatingOrbs />

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(105deg, rgba(7,17,31,0.98) 42%, rgba(7,17,31,0.55) 58%, rgba(7,17,31,0.2) 100%), url(${instructorPhoto})`,
          backgroundPosition: "center, right 12% top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover, min(44rem, 52vw) auto",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(88svh-5rem)] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
        <Reveal>
          <button
            type="button"
            onClick={() => scrollTo("courses")}
            className="attention-vibrate group mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#f2b84b]/40 bg-[#f2b84b]/10 px-4 py-2 text-left text-xs font-black uppercase tracking-[0.18em] shadow-lg shadow-[#f2b84b]/15 backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#18c29c]" />
            </span>
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              New live batch · July 1st · 7:00 AM IST
            </span>
            <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block">Master GCP Data</span>
            <span className="block">
              Engineering with{" "}
              <span className="text-shimmer bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] bg-clip-text text-transparent">
                Shaik Saidhul
              </span>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Industry-focused Google Cloud training — live classes, hands-on
            projects, real case studies, and career support to make you
            job-ready.
          </p>
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
              onClick={() => scrollTo("instructor")}
              className="magnetic-button inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-md hover:border-[#f2b84b]/50"
            >
              <Play className="h-5 w-5 text-[#f2b84b]" />
              Meet Instructor
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-6 flex flex-wrap gap-2">
            {PERKS.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-slate-300 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-[#18c29c]" />
                {item}
              </span>
            ))}
          </div>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" stagger={0.06}>
          <RevealItem className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map(({ icon: Icon, val, sub }) => (
              <div key={sub} className="bento-card rounded-2xl p-4">
                <Icon className="mb-3 h-5 w-5 text-[#f2b84b]" />
                <div className="text-2xl font-black text-white">
                  <AnimatedCounter value={val} />
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {sub}
                </div>
              </div>
            ))}
          </RevealItem>

          <RevealItem>
            <div className="bento-card h-full rounded-2xl p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f2b84b]">
                Join the community
              </p>
              <h2 className="mt-2 text-lg font-black text-white">
                Connect with SkillVane learners
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  {
                    href: "https://chat.whatsapp.com/J7vV8uKF8hSE5Zsx6ltoD1",
                    label: "WhatsApp",
                    icon: MessageCircle,
                    cls: "border-[#25D366]/25 bg-[#25D366]/12 text-[#b8ffd0]",
                  },
                  {
                    href: "https://t.me/gcpdataengineering",
                    label: "Telegram",
                    icon: Send,
                    cls: "border-[#2f80ed]/25 bg-[#2f80ed]/12 text-[#bfe3ff]",
                  },
                  {
                    href: "https://www.youtube.com/@SkillVane1711",
                    label: "YouTube",
                    icon: Youtube,
                    cls: "border-red-400/25 bg-red-500/12 text-red-200",
                  },
                  {
                    href: "tel:+917305101711",
                    label: "Call",
                    icon: Phone,
                    cls: "border-[#18c29c]/25 bg-[#18c29c]/12 text-[#9cf8dd]",
                  },
                ].map(({ href, label, icon: Icon, cls }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("tel") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-black transition-transform hover:-translate-y-0.5 ${cls}`}
                  >
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </RevealItem>
        </RevealStagger>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-10 w-6 rounded-full border-2 border-white/20 p-1"
        >
          <div className="mx-auto h-2 w-1 rounded-full bg-white/50" />
        </motion.div>
      </div>
    </section>
  );
}
