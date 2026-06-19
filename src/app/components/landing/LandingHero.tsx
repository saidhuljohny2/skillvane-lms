import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  Play,
  Send,
  Star,
  Users,
  Youtube,
} from "lucide-react";
import { HeroBackground } from "@/app/components/effects/HeroBackground";
import { FloatingOrbs } from "@/app/components/effects/FloatingOrbs";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { Reveal, RevealStagger, RevealItem } from "@/app/components/effects/Reveal";

const STATS = [
  { icon: Users, val: "2500+", sub: "Learners" },
  { icon: Star, val: "4.9/5", sub: "Rating" },
  { icon: CheckCircle2, val: "9+ yrs", sub: "Experience" },
  { icon: Play, val: "5", sub: "Programs" },
];

export function LandingHero({
  instructorPhoto,
  scrollTo,
}: {
  instructorPhoto: string;
  scrollTo: (id: string) => void;
}) {
  return (
    <section className="hero-signature relative min-h-[92svh] overflow-hidden bg-[#050d18] pt-20 sm:pt-24">
      <HeroBackground />
      <FloatingOrbs />

      {/* Diagonal brand accent */}
      <div
        className="pointer-events-none absolute -right-32 top-20 hidden h-[520px] w-[520px] rotate-12 rounded-[3rem] border border-[#18c29c]/15 bg-gradient-to-br from-[#18c29c]/8 to-transparent lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-8 top-32 font-black text-[12rem] leading-none text-white/[0.02] select-none"
        aria-hidden
      >
        SV
      </div>

      <div className="relative mx-auto grid min-h-[calc(92svh-5rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        {/* Copy */}
        <div>
          <Reveal>
            <button
              type="button"
              onClick={() => scrollTo("courses")}
              className="attention-vibrate group mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#f2b84b]/35 bg-[#f2b84b]/8 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#18c29c]" />
              </span>
              <span className="bg-gradient-to-r from-amber-200 via-[#f2b84b] to-amber-400 bg-clip-text text-transparent">
                Live batch · July 1 · 7 AM IST
              </span>
              <ArrowRight className="h-4 w-4 text-white/80 transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#7cc7ff]/80">
              SkillVane IT Academy
            </p>
            <h1 className="text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Become a{" "}
              <span className="relative inline-block">
                <span className="text-shimmer bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] bg-clip-text text-transparent">
                  GCP Data Engineer
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-[#18c29c] to-[#f2b84b]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Train with <span className="font-bold text-white">Shaik Saidhul</span> —
              live morning batches, portfolio projects, and career support built for
              working professionals in India.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollTo("courses")}
                className="magnetic-button group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-8 py-4 text-base font-extrabold text-white shadow-2xl shadow-[#18c29c]/25"
              >
                View Programs
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("free-learning")}
                className="magnetic-button inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-8 py-4 text-base font-bold text-white backdrop-blur-sm hover:border-[#f2b84b]/40"
              >
                <Play className="h-5 w-5 text-[#f2b84b]" />
                Free Lessons
              </button>
            </div>
          </Reveal>

          <RevealStagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.05}>
            {STATS.map(({ icon: Icon, val, sub }) => (
              <RevealItem key={sub}>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 backdrop-blur-sm">
                  <Icon className="mb-2 h-4 w-4 text-[#f2b84b]" />
                  <div className="text-xl font-black text-white sm:text-2xl">
                    <AnimatedCounter value={val} />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {sub}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>

        {/* Instructor frame */}
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="hero-photo-frame relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#18c29c]/40 via-transparent to-[#f2b84b]/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0b1423] shadow-2xl shadow-black/40">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 py-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9cf8dd]">
                  Lead Instructor
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#ffe4a3]">
                  <Star className="h-3 w-3 fill-[#f2b84b] text-[#f2b84b]" />
                  4.9 rated
                </span>
              </div>
              <img
                src={instructorPhoto}
                alt="Shaik Saidhul — GCP Data Engineering Instructor"
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/90 to-transparent p-5 pt-16">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8df5d7]">
                  Shaik Saidhul
                </p>
                <p className="text-lg font-black text-white">
                  Solution Architect &amp; Trainer
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  9+ years · 2,500+ learners · Google Certified
                </p>
              </div>
            </div>
          </div>

          {/* Community chip */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { href: "https://chat.whatsapp.com/J7vV8uKF8hSE5Zsx6ltoD1", label: "WhatsApp", icon: MessageCircle },
              { href: "https://t.me/gcpdataengineering", label: "Telegram", icon: Send },
              { href: "https://www.youtube.com/@SkillVane1711", label: "YouTube", icon: Youtube },
              { href: "tel:+917305101711", label: "Call", icon: Phone },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("tel") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-bold text-slate-300 transition-colors hover:border-[#18c29c]/30 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500"
        >
          <span>Scroll</span>
          <div className="h-8 w-5 rounded-full border border-white/20 p-1">
            <div className="mx-auto h-1.5 w-1 rounded-full bg-[#18c29c]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
