import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Download,
  Layers,
  MonitorPlay,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";
import gcpDataEngineeringCurriculum from "@/imports/gcp-data-engineering-curriculum.pdf";
import { useCardTilt } from "@/app/components/effects/useCardTilt";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/app/data/labels";
import { getDemoAccess } from "@/app/lib/courseAccess";
import { formatINR } from "@/app/lib/format";
import type { Course, CourseCategory } from "@/app/types";

const HIGHLIGHT_PREVIEW = 3;

export function CourseCard({
  course,
  onEnroll,
  index = 0,
}: {
  course: Course;
  onEnroll: (c: Course) => void;
  index?: number;
}) {
  const [highlightsOpen, setHighlightsOpen] = useState(false);
  const { ref, onMove, onLeave } = useCardTilt(9);
  const Icon = course.icon;
  const demoAccess = getDemoAccess(course);
  const category: CourseCategory =
    course.type === "live" ? "live-batch" : "self-paced";
  const isLiveBatch = category === "live-batch";
  const isFeaturedLiveBatch = course.id === "gcp-live";
  const moduleCount = course.curriculum.length;
  const curriculumHref =
    course.curriculumDownload || gcpDataEngineeringCurriculum;
  const discountPct = course.originalPrice
    ? Math.round(
        ((course.originalPrice - course.price) / course.originalPrice) * 100,
      )
    : null;
  const visibleHighlights = highlightsOpen
    ? course.highlights
    : course.highlights.slice(0, HIGHLIGHT_PREVIEW);
  const hiddenCount = course.highlights.length - HIGHLIGHT_PREVIEW;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`course-card-modern group relative flex flex-col overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-300 ease-out ${
        isFeaturedLiveBatch ? "course-card-featured" : ""
      }`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="course-card-border pointer-events-none absolute inset-0 rounded-2xl" aria-hidden />

      {isFeaturedLiveBatch && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#f2b84b]/20 blur-2xl" />
      )}

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1423]/95 shadow-xl shadow-black/25 backdrop-blur-sm">
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${course.accentFrom}, ${course.accentTo})`,
          }}
        />

        <div className="course-card-shine pointer-events-none absolute inset-0 z-[1]" aria-hidden />

        <div
          className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 20% 0%, ${course.accentFrom}22, transparent 50%), radial-gradient(ellipse at 80% 100%, ${course.accentTo}15, transparent 45%)`,
          }}
        />

        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          {isLiveBatch && (
            <span className="live-pulse-badge inline-flex items-center gap-1.5 rounded-full border border-[#18c29c]/35 bg-[#18c29c]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#9cf8dd]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18c29c] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#18c29c]" />
              </span>
              Live
            </span>
          )}
          <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/80 backdrop-blur-xl">
            {CATEGORY_LABELS[category]}
          </span>
        </div>

        {course.tag && (
          <div
            className="absolute right-4 top-14 z-10 rounded-full px-3 py-1.5 text-[10px] font-black text-white shadow-lg ring-1 ring-white/20"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
            }}
          >
            {course.tag}
          </div>
        )}

        <div
          className={`relative z-10 flex flex-1 flex-col ${
            isFeaturedLiveBatch ? "p-4 sm:p-6" : "p-4 sm:p-5"
          }`}
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="course-icon-float relative flex-shrink-0">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl shadow-md ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${course.accentFrom}30, ${course.accentTo}18)`,
                  border: `1.5px solid ${course.accentFrom}55`,
                }}
              >
                <Icon className="h-6 w-6" style={{ color: course.accentFrom }} />
              </div>
              {isFeaturedLiveBatch && (
                <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-[#f2b84b] animate-pulse" />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <span
                className="inline-block rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest"
                style={{
                  color: course.accentFrom,
                  borderColor: `${course.accentFrom}50`,
                  background: `${course.accentFrom}15`,
                }}
              >
                {course.badge}
              </span>
              <h3
                className={`mt-2 font-black leading-tight text-white transition-colors group-hover:text-[#fff8dd] ${
                  isFeaturedLiveBatch ? "text-2xl sm:text-3xl" : "text-xl"
                }`}
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-slate-400">{course.subtitle}</p>
            </div>
          </div>

          {isFeaturedLiveBatch && (
            <div className="mb-4 grid gap-2 rounded-xl border border-[#f2b84b]/25 bg-gradient-to-r from-[#f2b84b]/12 to-white/[0.04] p-3 sm:grid-cols-3">
              {[
                { label: "Duration", value: "3 months" },
                { label: "Timings", value: "7:00 AM - 8:00 AM" },
                { label: "Demo", value: "July 1, 2, 3" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f2b84b]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-black text-white">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <span>Curriculum depth</span>
              <span>{moduleCount} modules</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="course-depth-bar h-full rounded-full"
                style={{
                  width: `${Math.min(100, 18 + moduleCount * 10)}%`,
                  background: `linear-gradient(90deg, ${course.accentFrom}, ${course.accentTo})`,
                }}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full border border-[#f2b84b]/24 bg-[#f2b84b]/10 px-2.5 py-1 text-xs text-[#ffe4a3]">
              <Zap className="h-3 w-3" />
              {isLiveBatch ? "Free demo available" : "On-demand access"}
            </span>
            {course.duration && (
              <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-xs text-slate-300">
                <Clock className="h-3 w-3" />
                {course.duration}
              </span>
            )}
            {course.timings && (
              <span className="flex items-center gap-1 rounded-full border border-[#18c29c]/28 bg-[#18c29c]/12 px-2.5 py-1 text-xs text-[#b8fff0]">
                <MonitorPlay className="h-3 w-3" />
                {course.timings}
              </span>
            )}
            <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-xs text-slate-300">
              <BookOpen className="h-3 w-3" />
              {TYPE_LABELS[course.type]}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-xs text-slate-300">
              <Layers className="h-3 w-3" />
              {moduleCount} modules
            </span>
          </div>

          <div className="mb-4 rounded-xl border border-white/10 bg-[#07111f]/72 p-3">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8df5d7]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              What&apos;s included
            </div>
            <ul className={`grid gap-2 ${isFeaturedLiveBatch ? "sm:grid-cols-2" : ""}`}>
              {visibleHighlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 rounded-lg bg-white/[0.035] px-3 py-2 text-xs leading-relaxed text-slate-200 transition-colors hover:bg-white/[0.06]"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.35)]" />
                  {h}
                </li>
              ))}
            </ul>
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setHighlightsOpen((o) => !o)}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-white/8 bg-white/[0.03] py-2 text-xs font-bold text-slate-400 transition-colors hover:border-[#18c29c]/30 hover:text-[#9cf8dd]"
              >
                {highlightsOpen ? "Show less" : `+${hiddenCount} more highlights`}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${highlightsOpen ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>

          <div className="relative z-10 mb-4 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 shadow-inner shadow-white/5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className="text-3xl font-black text-white"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {formatINR(course.price)}
              </span>
              {course.originalPrice && (
                <span className="text-base text-slate-500 line-through">
                  {formatINR(course.originalPrice)}
                </span>
              )}
              {discountPct !== null && discountPct > 0 && (
                <span className="savings-badge rounded-md bg-emerald-400/15 px-2 py-1 text-xs font-bold text-emerald-400">
                  Save {discountPct}%
                </span>
              )}
            </div>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              0% EMI on credit cards at checkout
            </p>
          </div>

          <div className="relative z-10 mt-auto space-y-3">
            {isFeaturedLiveBatch ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={curriculumHref}
                  download
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2b84b]/35 bg-[#f2b84b]/12 px-4 py-3 text-sm font-black text-[#ffe4a3] transition-all hover:border-[#f2b84b]/60 hover:bg-[#f2b84b]/18"
                >
                  <Download className="h-4 w-4" />
                  Curriculum
                </a>
                {demoAccess && (
                  <a
                    href={demoAccess.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] transition-all hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16"
                  >
                    <demoAccess.icon className="h-4 w-4" />
                    Join Demo
                  </a>
                )}
              </div>
            ) : (
              <a
                href={curriculumHref}
                download
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2b84b]/35 bg-[#f2b84b]/12 px-4 py-3 text-sm font-black text-[#ffe4a3] transition-all hover:border-[#f2b84b]/60 hover:bg-[#f2b84b]/18"
              >
                <Download className="h-4 w-4" />
                Download Curriculum
              </a>
            )}
            {!isFeaturedLiveBatch && demoAccess && (
              <a
                href={demoAccess.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] transition-all hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16"
              >
                <demoAccess.icon className="h-4 w-4" />
                {demoAccess.longLabel}
              </a>
            )}
            <button
              type="button"
              onClick={() => onEnroll(course)}
              className="magnetic-button group/enroll flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.99]"
              style={{
                background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
              }}
            >
              Enroll Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover/enroll:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
