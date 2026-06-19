import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Download,
  MonitorPlay,
  Zap,
} from "lucide-react";
import gcpDataEngineeringCurriculum from "@/imports/gcp-data-engineering-curriculum.pdf";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/app/data/labels";
import { getDemoAccess } from "@/app/lib/courseAccess";
import { formatINR } from "@/app/lib/format";
import type { Course, CourseCategory } from "@/app/types";

const HIGHLIGHT_PREVIEW = 3;

export function CourseCard({
  course,
  onEnroll,
  onViewDetails,
  isEnrolling = false,
}: {
  course: Course;
  onEnroll: (c: Course) => void;
  onViewDetails?: (c: Course) => void;
  isEnrolling?: boolean;
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const Icon = course.icon;
  const demoAccess = getDemoAccess(course);
  const category: CourseCategory = course.type === "live" ? "live-batch" : "self-paced";
  const isLive = category === "live-batch";
  const curriculumHref = course.curriculumDownload || gcpDataEngineeringCurriculum;
  const highlights = open ? course.highlights : course.highlights.slice(0, HIGHLIGHT_PREVIEW);
  const more = course.highlights.length - HIGHLIGHT_PREVIEW;

  return (
    <article className="sv-card flex h-full flex-col">
      <div
        className="h-1 rounded-t-[inherit]"
        style={{ background: `linear-gradient(90deg, ${course.accentFrom}, ${course.accentTo})` }}
      />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border"
              style={{ background: `${course.accentFrom}18` }}
            >
              <Icon className="h-5 w-5" style={{ color: course.accentFrom }} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {course.badge}
              </p>
              {course.tag && (
                <span className="mt-0.5 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                  {course.tag}
                </span>
              )}
            </div>
          </div>
          <span className="shrink-0 rounded-md border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-muted-foreground">
            {CATEGORY_LABELS[category]}
          </span>
        </div>

        <h3 className="text-lg font-bold leading-snug text-foreground sm:text-xl">{course.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{course.subtitle}</p>

        {isLive && course.id === "gcp-live" && (
          <div className="sv-panel mt-4 grid grid-cols-3 gap-2 !p-3 text-center">
            {[
              { l: "Duration", v: "3 months" },
              { l: "Time", v: "7–8 AM" },
              { l: "Demo", v: "Jul 1–3" },
            ].map((r) => (
              <div key={r.l}>
                <p className="text-[10px] text-muted-foreground">{r.l}</p>
                <p className="text-xs font-semibold text-foreground">{r.v}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="sv-chip">
            <Zap className="h-3 w-3" />
            {isLive ? "Live + demo" : "Self-paced"}
          </span>
          {course.duration && (
            <span className="sv-chip">
              <Clock className="h-3 w-3" />
              {course.duration}
            </span>
          )}
          <span className="sv-chip">
            <BookOpen className="h-3 w-3" />
            {course.curriculum.length} modules
          </span>
        </div>

        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {highlights.map((h) => (
            <li key={h} className="flex gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {h}
            </li>
          ))}
        </ul>
        {more > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-primary"
          >
            {open ? "Show less" : `+${more} more`}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        )}

        <div className="mt-auto border-t border-border pt-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{formatINR(course.price)}</span>
            {course.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatINR(course.originalPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{TYPE_LABELS[course.type]} · 0% EMI available</p>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => onEnroll(course)}
              disabled={isEnrolling}
              className="sv-btn-primary w-full disabled:opacity-60"
            >
              {isEnrolling ? "Processing…" : "Enroll now"}
              {!isEnrolling && <ArrowRight className="h-4 w-4" />}
            </button>
            <div className="grid grid-cols-2 gap-2">
              {onViewDetails && (
                <button type="button" onClick={() => onViewDetails(course)} className="sv-btn-ghost w-full text-xs">
                  Details
                </button>
              )}
              <a
                href={curriculumHref}
                download
                className={`sv-btn-ghost w-full text-xs ${onViewDetails ? "" : "col-span-2"}`}
              >
                <Download className="h-3.5 w-3.5" />
                PDF
              </a>
              {demoAccess && (
                <a
                  href={demoAccess.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sv-btn-ghost col-span-2 w-full text-xs"
                >
                  <MonitorPlay className="h-3.5 w-3.5" />
                  {demoAccess.longLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
