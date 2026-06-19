import { useState, useEffect } from "react";
import { Check, ChevronDown, Clock, Download, MonitorPlay, X } from "lucide-react";
import gcpDataEngineeringCurriculum from "@/imports/gcp-data-engineering-curriculum.pdf";
import { getDemoAccess } from "@/app/lib/courseAccess";
import { formatINR } from "@/app/lib/format";
import type { Course } from "@/app/types";

export function CourseModal({
  course,
  onClose,
  onEnroll,
}: {
  course: Course;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}) {
  const [openModule, setOpenModule] = useState<number | null>(
    0,
  );
  const Icon = course.icon;
  const demoAccess = getDemoAccess(course);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () =>
      document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="sv-modal-root" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sv-modal-backdrop" onClick={onClose} />

      <div className="sv-modal sv-modal-lg flex max-h-[92dvh] sm:max-h-[85vh]">
        <div
          className="sv-modal-header items-start"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}18, transparent)`,
            borderBottom: `1px solid ${course.accentFrom}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
              }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p
                className="text-xs font-mono uppercase tracking-widest mb-0.5"
                style={{ color: course.accentFrom }}
              >
                {course.badge}
              </p>
              <h2
                className="text-base sm:text-lg font-bold leading-tight text-white"
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                {course.title}
              </h2>
              <p className="text-xs text-white/50">
                {course.subtitle}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="sv-close-btn flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="sv-modal-body lms-dashboard-scroll flex-1 overflow-y-auto space-y-6 !py-5">
          {/* Price + meta */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl font-extrabold text-white"
                  style={{
                    fontFamily:
                      "'Outfit', system-ui, sans-serif",
                  }}
                >
                  {formatINR(course.price)}
                </span>
                {course.originalPrice && (
                  <span className="text-white/40 line-through text-base">
                    {formatINR(course.originalPrice)}
                  </span>
                )}
              </div>
              {course.originalPrice && (
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  Save{" "}
                  {formatINR(
                    course.originalPrice - course.price,
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-white/50">
              {course.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {course.duration}
                </span>
              )}
              {course.timings && (
                <span className="flex items-center gap-1.5">
                  <MonitorPlay className="w-3.5 h-3.5" />
                  {course.timings}
                </span>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3
              className="text-sm font-bold text-white mb-3"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              What&apos;s Included
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-sm text-white/70"
                >
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div>
            <h3
              className="text-sm font-bold text-white mb-3"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Curriculum
            </h3>
            <div className="space-y-1.5">
              {course.curriculum.map((mod, i) => (
                <div
                  key={i}
                  className="border border-white/8 rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
                    onClick={() =>
                      setOpenModule(openModule === i ? null : i)
                    }
                  >
                    <span className="text-sm font-semibold text-white/90">
                      {mod.module}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200 ${
                        openModule === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openModule === i && (
                    <ul className="px-4 pb-3 border-t border-white/5 space-y-2 pt-3">
                      {mod.topics.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2.5 text-sm text-white/55"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="sv-modal-footer space-y-3">
          {course.curriculumDownload && (
            <a
              href={course.curriculumDownload}
              download
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#f2b84b]/12 border border-[#f2b84b]/35 text-[#ffe4a3] hover:bg-[#f2b84b]/18 hover:border-[#f2b84b]/60 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Curriculum
            </a>
          )}
          {/* Access Link - Zoom for Live, Drive for Recordings */}
          {demoAccess && (
            <a
              href={demoAccess.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-[#18c29c]/15 to-[#2f80ed]/15 border border-[#18c29c]/35 text-[#8df5d7] hover:from-[#18c29c]/25 hover:to-[#2f80ed]/25 hover:border-[#18c29c]/60 transition-all"
            >
              <demoAccess.icon className="w-4 h-4" />
              {demoAccess.longLabel}
            </a>
          )}

          <button
            onClick={() => onEnroll(course)}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 active:scale-[0.99] transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
              boxShadow: `0 8px 30px ${course.accentFrom}40`,
            }}
          >
            Enroll Now - {formatINR(course.price)}
          </button>
          <p className="text-center text-xs text-white/30 mt-2.5">
            Secure payment via Razorpay - UPI - Net Banking -
            Cards - EMI
          </p>
        </div>
      </div>
    </div>
  );
}
