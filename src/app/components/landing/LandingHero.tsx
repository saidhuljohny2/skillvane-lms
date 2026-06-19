import { Reveal } from "@/app/components/effects/Reveal";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { CyclingTechWords } from "@/app/components/effects/CyclingTechWords";
import { DataPipelineVisual } from "@/app/components/effects/DataPipelineVisual";
import { HeroBackground } from "@/app/components/effects/HeroBackground";
import { LiveBatchBanner } from "@/app/components/landing/LiveBatchBanner";
import { SOCIAL_LINKS } from "@/app/data/social";
import { FREE_LEARNING_PLAYLIST_URL } from "@/app/data/marketing";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Play,
  Star,
  Users,
} from "lucide-react";

type LandingHeroProps = {
  onExploreCourses: () => void;
  onMeetInstructor?: () => void;
};

const STATS = [
  { icon: Users, val: "2500+", label: "Learners" },
  { icon: Star, val: "4.9/5", label: "Rating" },
  { icon: Award, val: "9+", label: "Years" },
  { icon: BookOpen, val: "5", label: "Programs" },
];

const HERO_PERKS = [
  "Daily live sessions",
  "Recordings shared",
  "Portfolio projects",
  "Resume guidance",
];

const HERO_SOCIAL = SOCIAL_LINKS.filter((l) =>
  ["whatsapp", "telegram", "youtube", "call"].includes(l.id),
);

export function LandingHero({ onExploreCourses, onMeetInstructor }: LandingHeroProps) {
  return (
    <section className="landing-hero relative overflow-hidden">
      <HeroBackground />
      <div className="landing-hero-fade pointer-events-none absolute inset-x-0 bottom-0 h-40" />

      <div className="sv-page relative flex min-h-[calc(88svh-5.5rem)] flex-col justify-center py-8 sm:py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="max-w-2xl lg:max-w-none">
            <Reveal delay={0}>
              <LiveBatchBanner onClick={onExploreCourses} />
            </Reveal>

            <Reveal delay={50}>
              <h1
                className="mt-5 max-w-xl text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                <span className="block">Master</span>
                <span className="block">
                  <CyclingTechWords />
                </span>
                <span className="mt-1 block">
                  with{" "}
                  <span className="bg-gradient-to-r from-accent via-primary to-[#089691] bg-clip-text text-transparent">
                    Shaik Saidhul
                  </span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p className="sv-prose mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                Industry-focused Google Cloud Data Engineering — live classes, hands-on
                pipelines, real case studies, and career support to make you job-ready.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={onExploreCourses} className="sv-btn-primary !px-6 !py-3.5">
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </button>
                {onMeetInstructor ? (
                  <button
                    type="button"
                    onClick={onMeetInstructor}
                    className="sv-btn-ghost !px-6 !py-3.5"
                  >
                    <Play className="h-4 w-4 text-primary" />
                    Meet Instructor
                  </button>
                ) : (
                  <a
                    href={FREE_LEARNING_PLAYLIST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sv-btn-ghost !px-6 !py-3.5"
                  >
                    <Play className="h-4 w-4 text-red-500" />
                    Free Lessons
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-5 flex flex-wrap gap-2">
                {HERO_PERKS.map((item) => (
                  <span key={item} className="sv-chip !py-1.5 !text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal direction="right" delay={80} className="hidden lg:block">
            <div className="pipeline-hero-glow mx-auto w-full max-w-md">
              <DataPipelineVisual />
            </div>
          </Reveal>
        </div>

        <Reveal delay={250}>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map(({ icon: Icon, val, label }) => (
                <div key={label} className="sv-panel !p-4 text-center sm:text-left">
                  <Icon className="mb-2 h-4 w-4 text-primary sm:mb-3 sm:h-5 sm:w-5" />
                  <div
                    className="text-xl font-bold text-foreground sm:text-2xl"
                    style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                  >
                    <AnimatedCounter value={val} />
                  </div>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="sv-panel">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Connect with SkillVane
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                Join the community or speak with us.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {HERO_SOCIAL.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      target={link.href.startsWith("tel:") ? undefined : "_blank"}
                      rel={link.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors ${link.border} ${link.bg} ${link.text} ${link.hoverBorder} ${link.hoverBg}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 lg:hidden">
          <DataPipelineVisual />
        </div>
      </div>
    </section>
  );
}
