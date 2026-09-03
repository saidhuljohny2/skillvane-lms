import { useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Check,
  ChevronRight,
  Cloud,
  CodeXml,
  Database,
  Github,
  GraduationCap,
  Linkedin,
  Menu,
  MessageCircle,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/app/auth/AuthProvider";
import { faqs, formatPrice, programs, testimonials } from "@/app/data/site";
import skillVaneLogo from "@/imports/logo1.png";
import instructorPhoto from "@/imports/IMG_20260518_113243.jpg.jpeg";

const navigation = [
  ["Programs", "programs"],
  ["How it works", "path"],
  ["About", "about"],
  ["Reviews", "reviews"],
] as const;

const whatsappUrl =
  "https://wa.me/917305101711?text=Hi%20SkillVane%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20programs.";

function Brand() {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="SkillVane home">
      <span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-white p-1 shadow-lg shadow-emerald-400/10 transition-transform group-hover:-rotate-3">
        <img src={skillVaneLogo} alt="" className="size-full object-contain" />
      </span>
      <span>
        <strong className="block text-sm font-bold leading-none text-white">SkillVane</strong>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          IT Academy
        </span>
      </span>
    </a>
  );
}

function Header({ onSignIn }: { onSignIn: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, signOut } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07111f]/85 backdrop-blur-xl">
      <div className="site-container flex h-18 items-center justify-between">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navigation.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="nav-link">
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <button type="button" onClick={() => void signOut()} className="secondary-button">
              Sign out
            </button>
          ) : (
            <button type="button" onClick={onSignIn} className="secondary-button">
              Student login
            </button>
          )}
          <a href="#programs" className="primary-button">
            Explore programs
            <ArrowRight className="size-4" />
          </a>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="rounded-xl border border-white/10 p-2.5 text-white md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {menuOpen && (
        <nav className="site-container grid gap-2 border-t border-white/[0.06] py-4 md:hidden">
          {navigation.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
            >
              {label}
            </a>
          ))}
          <button type="button" onClick={onSignIn} className="secondary-button mt-2 w-full">
            Student login
          </button>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="hero-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="hero-glow absolute left-1/2 top-0 size-[45rem] -translate-x-1/2 rounded-full" aria-hidden="true" />
      <div className="site-container relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="eyebrow">
            <Sparkles className="size-3.5" />
            New live GCP cohort
          </div>
          <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Build the skills behind{" "}
            <span className="text-gradient">modern data teams.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Learn cloud data engineering by building real systems—not by collecting
            tutorials. Live mentorship, practical labs, and career-ready projects.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#programs" className="primary-button px-6 py-3.5">
              Find your program
              <ArrowRight className="size-4" />
            </a>
            <a
              href="https://www.youtube.com/playlist?list=PLk8wwChOsCPzoZHuQEiJqWVvhHFdFa6sy"
              target="_blank"
              rel="noreferrer"
              className="secondary-button px-6 py-3.5"
            >
              <Play className="size-4 fill-current" />
              Watch a free lesson
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
            {["Live mentorship", "Hands-on labs", "Career support"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="code-card">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-rose-400/80" />
                <span className="size-2.5 rounded-full bg-amber-300/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="font-mono text-[11px] text-slate-500">pipeline.py</span>
            </div>
            <div className="space-y-3 p-5 font-mono text-xs leading-6 sm:p-7 sm:text-sm">
              <p><span className="text-violet-300">from</span> apache_beam <span className="text-violet-300">import</span> Pipeline</p>
              <p><span className="text-violet-300">from</span> skillvane <span className="text-violet-300">import</span> Learn, Build, Deploy</p>
              <p className="pt-2 text-slate-500"># Turn knowledge into production skills</p>
              <p><span className="text-sky-300">with</span> Pipeline() <span className="text-sky-300">as</span> data:</p>
              <p className="pl-5">data | Learn(<span className="text-amber-200">"GCP"</span>)</p>
              <p className="pl-10">| Build(<span className="text-amber-200">"real projects"</span>)</p>
              <p className="pl-10">| Deploy(<span className="text-amber-200">"with confidence"</span>)</p>
            </div>
            <div className="grid grid-cols-3 border-t border-white/[0.08]">
              {[
                ["2,500+", "learners"],
                ["4.9/5", "rating"],
                ["9+ yrs", "experience"],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-white/[0.08] px-3 py-5 text-center last:border-0">
                  <strong className="block text-lg text-white sm:text-xl">{value}</strong>
                  <span className="mt-1 block text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-[#101d2c] p-4 shadow-xl lg:block">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <Zap className="size-5" />
              </span>
              <div>
                <strong className="block text-sm text-white">Project-first learning</strong>
                <span className="text-xs text-slate-500">Build while you learn</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LogoStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015]">
      <div className="site-container flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
          Tools you will work with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-slate-400 sm:gap-x-10">
          {["Google Cloud", "BigQuery", "Dataflow", "Python", "Apache Beam", "Airflow"].map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Programs() {
  return (
    <section id="programs" className="section-block">
      <div className="site-container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Choose your path</span>
            <h2>Programs built around outcomes.</h2>
          </div>
          <p>Start with a complete cohort, sharpen one skill, or prove your ability with a focused project lab.</p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <article key={program.id} className={`program-card ${program.featured ? "featured-card" : ""}`}>
                {program.featured && <span className="featured-label">Most popular</span>}
                <div className="flex items-start justify-between gap-4">
                  <span className="icon-tile"><Icon className="size-5" /></span>
                  <span className="format-chip">{program.format}</span>
                </div>
                <h3 className="mt-7 text-2xl font-bold text-white">{program.title}</h3>
                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-400">{program.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {program.skills.map((skill) => <span key={skill} className="skill-chip">{skill}</span>)}
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-white/[0.08] pt-6">
                  <div>
                    <span className="block text-xs text-slate-500">{program.duration}</span>
                    <strong className="mt-1 block text-xl text-white">{formatPrice(program.price)}</strong>
                  </div>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="circle-button" aria-label={`Ask about ${program.title}`}>
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LearningPath() {
  const steps = [
    { number: "01", icon: BookOpenCheck, title: "Learn the foundations", text: "Clear mental models, live explanations, and concise reference material." },
    { number: "02", icon: CodeXml, title: "Build real systems", text: "Guided labs evolve into independent, production-shaped data projects." },
    { number: "03", icon: ShieldCheck, title: "Review and improve", text: "Get direct feedback on code, architecture, reliability, and trade-offs." },
    { number: "04", icon: GraduationCap, title: "Show your work", text: "Document your projects, prepare for interviews, and communicate with confidence." },
  ];

  return (
    <section id="path" className="section-block border-y border-white/[0.06] bg-white/[0.015]">
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">The SkillVane method</span>
          <h2 className="mt-5 text-4xl font-bold text-white sm:text-5xl">From concept to capability.</h2>
          <p className="mt-5 leading-7 text-slate-400">A structured loop that turns technical knowledge into practical judgment.</p>
        </div>
        <div className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, text }) => (
            <article key={number} className="path-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-emerald-400">{number}</span>
                <Icon className="size-5 text-slate-500" />
              </div>
              <h3 className="mt-10 text-lg font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instructor() {
  return (
    <section id="about" className="section-block">
      <div className="site-container grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-400/20 via-sky-400/10 to-transparent p-1">
          <img
            src={instructorPhoto}
            alt="Shaik Saidhul, cloud data engineer and SkillVane mentor"
            className="h-full w-full rounded-[1.8rem] object-cover object-top"
          />
          <div className="absolute inset-x-1 bottom-1 rounded-b-[1.8rem] bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent px-6 pb-6 pt-20">
            <strong className="block text-xl text-white">Shaik Saidhul</strong>
            <span className="mt-1 block text-sm text-slate-300">Cloud Data Engineer & Mentor</span>
          </div>
        </div>
        <div>
          <span className="eyebrow">Learn from experience</span>
          <h2 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Practical guidance from someone who builds data systems.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Shaik turns years of cloud data engineering experience into a clear learning
            path—covering not only how services work, but why architecture decisions matter.
          </p>
          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              [Award, "9+ years", "Industry experience"],
              [Users, "2,500+", "Learners guided"],
              [Star, "4.9/5", "Learner rating"],
            ].map(([Icon, value, label]) => {
              const StatIcon = Icon as typeof Award;
              return (
                <div key={String(label)} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                  <StatIcon className="size-4 text-emerald-400" />
                  <strong className="mt-4 block text-lg text-white">{String(value)}</strong>
                  <span className="text-xs text-slate-500">{String(label)}</span>
                </div>
              );
            })}
          </div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="secondary-button mt-8">
            <MessageCircle className="size-4" />
            Talk to the trainer
          </a>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="section-block border-y border-white/[0.06] bg-white/[0.015]">
      <div className="site-container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Learner stories</span>
            <h2>Confidence built through practice.</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="flex text-amber-300" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-4 fill-current" />)}
            </div>
            4.9 average rating
          </div>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="review-card">
              <Quote className="size-7 text-emerald-400/50" />
              <blockquote className="mt-6 text-base leading-7 text-slate-300">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-8 border-t border-white/[0.08] pt-5">
                <strong className="block text-sm text-white">{testimonial.name}</strong>
                <span className="text-xs text-slate-500">{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section-block">
      <div className="site-container grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <span className="eyebrow">Questions, answered</span>
          <h2 className="mt-5 text-4xl font-bold text-white">Everything you need to start.</h2>
          <p className="mt-5 leading-7 text-slate-400">Still deciding? Talk directly with the trainer about your background and goals.</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="secondary-button mt-7">
            Ask a question <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="faq-item" open={index === 0}>
              <summary>
                {faq.question}
                <ChevronRight className="size-5 shrink-0" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-24">
      <div className="site-container">
        <div className="cta-panel">
          <div className="relative z-10 max-w-2xl">
            <span className="eyebrow">Your next chapter</span>
            <h2 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Build skills that stand up in the real world.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              Join a focused community of engineers learning to design, build, and explain better data systems.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#programs" className="primary-button px-6 py-3.5">Explore programs <ArrowRight className="size-4" /></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="secondary-button px-6 py-3.5">Talk to the trainer</a>
            </div>
          </div>
          <Database className="absolute -bottom-16 -right-10 size-72 rotate-[-8deg] text-white/[0.035]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="site-container flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
        <Brand />
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} SkillVane IT Academy. Built for serious learners.</p>
        <div className="flex gap-2">
          {[
            [Linkedin, "LinkedIn", "#"],
            [Github, "GitHub", "#"],
          ].map(([Icon, label, href]) => {
            const SocialIcon = Icon as typeof Linkedin;
            return (
              <a key={String(label)} href={String(href)} className="circle-button" aria-label={String(label)}>
                <SocialIcon className="size-4" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

export function HomePage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <>
      <Header onSignIn={onSignIn} />
      <main>
        <Hero />
        <LogoStrip />
        <Programs />
        <LearningPath />
        <Instructor />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
