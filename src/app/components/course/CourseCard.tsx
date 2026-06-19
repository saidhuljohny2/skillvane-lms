import {
  BookOpen, Check, Clock, Download, Layers, MonitorPlay, Play, Zap, CheckCircle2,
} from "lucide-react";
import gcpDataEngineeringCurriculum from "@/imports/gcp-data-engineering-curriculum.pdf";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/app/data/labels";
import { getDemoAccess } from "@/app/lib/courseAccess";
import { formatINR } from "@/app/lib/format";
import type { Course, CourseCategory } from "@/app/types";

export function CourseCard({
  course,
  onEnroll,
}: {
  course: Course;
  onEnroll: (c: Course) => void;
}) {
  const Icon = course.icon;
  const demoAccess = getDemoAccess(course);
  const category: CourseCategory =
    course.type === "live" ? "live-batch" : "self-paced";
  const isLiveBatch = category === "live-batch";
  const isFeaturedLiveBatch = course.id === "gcp-live";
  const moduleCount = course.curriculum.length;
  const curriculumHref =
    course.curriculumDownload || gcpDataEngineeringCurriculum;

  return (
    <div
      className={`tilt-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0b1423] shadow-xl shadow-black/20 transition-all duration-300 hover:border-[#18c29c]/35 hover:shadow-2xl hover:shadow-[#18c29c]/10 ${
        isFeaturedLiveBatch
          ? "border-[#f2b84b]/40 bg-[#0c1626] shadow-2xl shadow-[#f2b84b]/10"
          : ""
      }`}
    >
      {/* Accent top bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
        }}
      />

      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${course.accentFrom}10, transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.035), transparent 28%)`,
        }}
      />

      <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80 backdrop-blur-xl">
        {CATEGORY_LABELS[category]}
      </div>

      {/* Tag */}
      {course.tag && (
        <div
            className="absolute top-12 right-4 text-[10px] font-black px-3 py-1.5 rounded-full text-white shadow-lg z-10 ring-1 ring-white/20"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
          }}
        >
          {course.tag}
        </div>
      )}

      <div
        className={`flex flex-1 flex-col ${
          isFeaturedLiveBatch ? "p-4 sm:p-6" : "p-4 sm:p-5"
        }`}
      >
        {/* Icon + badge */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}25 0%, ${course.accentTo}15 100%)`,
              border: `1.5px solid ${course.accentFrom}50`,
            }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: course.accentFrom }}
            />
          </div>
          <span
            className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full border uppercase"
            style={{
              color: course.accentFrom,
              borderColor: `${course.accentFrom}50`,
              background: `${course.accentFrom}15`,
            }}
          >
            {course.badge}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`relative z-10 mb-1 font-black leading-tight text-white group-hover:text-[#fff8dd] ${
            isFeaturedLiveBatch ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
          style={{
            fontFamily:
              "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          {course.title}
        </h3>
        <p className="text-sm text-slate-400 mb-5 relative z-10">
          {course.subtitle}
        </p>

        {isFeaturedLiveBatch && (
          <div className="relative z-10 mb-4 grid gap-2 rounded-xl border border-[#f2b84b]/25 bg-gradient-to-r from-[#f2b84b]/12 to-white/[0.04] p-3 sm:grid-cols-3">
            {[
              { label: "Duration", value: "3 months" },
              { label: "Timings", value: "7:00 AM - 8:00 AM" },
              { label: "Demo", value: "July 1, 2, 3" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f2b84b]">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-black text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 text-xs text-[#ffe4a3] bg-[#f2b84b]/10 border border-[#f2b84b]/24 px-2.5 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            {isLiveBatch ? "Free demo available" : "On-demand access"}
          </span>
          {course.duration && (
            <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          )}
          {course.timings && (
            <span className="flex items-center gap-1 text-xs text-[#b8fff0] bg-[#18c29c]/12 border border-[#18c29c]/28 px-2.5 py-1 rounded-full shadow-sm shadow-[#18c29c]/10">
              <MonitorPlay className="w-3 h-3" />
              {course.timings}
            </span>
          )}
          {isFeaturedLiveBatch && (
            <span className="flex items-center gap-1 text-xs text-[#ffe4a3] bg-[#f2b84b]/10 border border-[#f2b84b]/24 px-2.5 py-1 rounded-full">
              <Play className="w-3 h-3" />
              3 free demos
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full">
            <BookOpen className="w-3 h-3" />
            {TYPE_LABELS[course.type]}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full">
            <Layers className="w-3 h-3" />
            {moduleCount} modules
          </span>
        </div>

        <div className="relative z-10 mb-4 rounded-xl border border-white/10 bg-[#07111f]/72 p-3">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8df5d7]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            What's included
          </div>
          <ul className={`grid gap-2 ${isFeaturedLiveBatch ? "sm:grid-cols-2" : ""}`}>
            {course.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2.5 rounded-lg bg-white/[0.035] px-3 py-2 text-xs leading-relaxed text-slate-200"
              >
                <Check className="w-3.5 h-3.5 text-emerald-300 mt-0.5 flex-shrink-0 drop-shadow-[0_0_8px_rgba(110,231,183,0.35)]" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-2 mb-4 relative z-10 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 shadow-inner shadow-white/5">
          <span
            className="text-3xl font-black text-white"
            style={{
              fontFamily:
                "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            {formatINR(course.price)}
          </span>
          {course.originalPrice && (
            <span className="text-slate-500 line-through text-base">
              {formatINR(course.originalPrice)}
            </span>
          )}
          {course.originalPrice && (
            <span className="text-xs text-emerald-400 font-bold px-2 py-1 bg-emerald-400/10 rounded-md">
              {Math.round(
                ((course.originalPrice - course.price) /
                  course.originalPrice) *
                  100,
              )}
              % off
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="relative z-10 space-y-3">
          {isFeaturedLiveBatch ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={curriculumHref}
                download
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2b84b]/35 bg-[#f2b84b]/12 px-4 py-3 text-sm font-black text-[#ffe4a3] transition-all hover:border-[#f2b84b]/60 hover:bg-[#f2b84b]/18"
              >
                <Download className="h-4 w-4" />
                Download Curriculum
              </a>
              {demoAccess && (
                <a
                  href={demoAccess.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16 transition-all"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16 transition-all"
            >
              <demoAccess.icon className="h-4 w-4" />
              {demoAccess.longLabel}
            </a>
          )}
          <button
            onClick={() => onEnroll(course)}
            className="magnetic-button w-full py-3.5 rounded-xl text-sm font-black text-white hover:shadow-xl active:scale-[0.99] transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
            }}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}

