import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Play,
  ShoppingCart,
  Sparkles,
  X,
  Youtube,
} from "lucide-react";
import { CertificatePreview } from "@/app/components/certificate/CertificatePreview";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { TRAINER_WHATSAPP_LINK } from "@/app/config";
import { TYPE_LABELS } from "@/app/data/labels";
import { FREE_LEARNING_PLAYLIST_URL } from "@/app/data/marketing";
import {
  getDemoAccess,
  getDriveAccessRequestHref,
  getEnrolledCourseAccess,
} from "@/app/lib/courseAccess";
import {
  getStudentCertificate,
  openCertificatePrint as printCertificate,
} from "@/app/lib/certificate";
import { formatINR } from "@/app/lib/format";
import type { Course, LoggedInStudent } from "@/app/types";
import skillVaneLogo from "@/imports/logo1.png";

type DashboardTab = "overview" | "courses" | "certificate";

export function StudentDashboard({
  student,
  courses,
  onLogout,
  onClose,
  onEnroll,
}: {
  student: LoggedInStudent;
  courses: Course[];
  onLogout: () => void;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}) {
  const enrolledCourses = courses.filter((c) =>
    student.enrolledCourses.includes(c.id),
  );
  const availableCourses = courses.filter(
    (c) => !student.enrolledCourses.includes(c.id),
  );
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const issuedCertificate = getStudentCertificate(student.email);
  const progressPercent = courses.length
    ? Math.round((enrolledCourses.length / courses.length) * 100)
    : 0;

  const tabs = useMemo(
    () =>
      [
        { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
        { id: "courses" as const, label: "My Courses", icon: BookOpen },
        { id: "certificate" as const, label: "Certificate", icon: BadgeCheck },
      ] as const,
    [],
  );

  const downloadCertificate = () => {
    if (!issuedCertificate) return;
    printCertificate(
      {
        studentName: issuedCertificate.studentName,
        completionDate: issuedCertificate.completionDate,
        studentEmail: issuedCertificate.studentEmail,
      },
      skillVaneLogo,
      issuedCertificate.courseTitle,
    );
  };
  const [confirmedAccess, setConfirmedAccess] = useState<
    Record<string, boolean>
  >(() => {
    try {
      return JSON.parse(localStorage.getItem(accessStorageKey) || "{}");
    } catch {
      return {};
    }
  });

  const confirmAccessReceived = (courseId: string) => {
    const next = { ...confirmedAccess, [courseId]: true };
    setConfirmedAccess(next);
    localStorage.setItem(accessStorageKey, JSON.stringify(next));
  };

  return (
    <div className="sv-modal-root">
      <div className="sv-modal-backdrop" onClick={onClose} />
      <div className="premium-ring sv-modal sv-modal-xl flex h-[96dvh] max-h-[90vh] sm:h-auto">
        <div className="sv-modal-header">
          <div className="min-w-0 flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] flex items-center justify-center shadow-lg shadow-[#18c29c]/25 ring-1 ring-white/20 flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8df5d7]">
                SkillVane LMS
              </p>
              <h2
                className="truncate font-black text-white text-base sm:text-xl"
                style={{
                  fontFamily:
                    "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                Welcome back, {student.name}
              </h2>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/12 bg-white/[0.04] text-slate-300 hover:text-white hover:border-[#18c29c]/40 transition-all text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button type="button" onClick={onClose} className="sv-close-btn">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-white/[0.06] px-4 py-3 sm:px-6">
          <div className="grid grid-cols-3 gap-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-black transition-all sm:gap-2 sm:px-3 sm:text-xs ${
                  activeTab === id
                    ? "lms-tab-active-glow bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white"
                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">{label}</span>
                {id === "certificate" && issuedCertificate && (
                  <span className="h-2 w-2 rounded-full bg-[#f2b84b] animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="sv-modal-body lms-dashboard-scroll flex-1 overflow-y-auto space-y-5">
          {activeTab === "overview" && (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
            <div className="premium-surface rounded-2xl p-4">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#18c29c]/25 bg-[#18c29c]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#9cf8dd]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Access center
              </div>
              <h3
                className="text-2xl sm:text-3xl font-black text-white"
                style={{
                  fontFamily:
                    "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                Your learning command center
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Access enrolled courses, request Google Drive access for your registered email, and add the next program to your SkillVane roadmap.
              </p>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  <span>Learning journey</span>
                  <span className="text-[#9cf8dd]">{progressPercent}% complete</span>
                </div>
                <div className="lms-progress-track">
                  <div className="lms-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-[#f2b84b]/20 bg-[#f2b84b]/10 px-4 py-3 text-xs leading-5 text-[#ffe4a3]">
                Drive invitations are sent to{" "}
                <span className="font-black text-white">
                  {student.email}
                </span>
                . Please check your inbox after requesting access.
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("student-available-courses")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="magnetic-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#18c29c]/20"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Enroll New Course
                </button>
                <button
                  onClick={onClose}
                  className="magnetic-button inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-200 hover:border-[#f2b84b]/40"
                >
                  <ArrowRight className="w-4 h-4" />
                  Back to Website
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Owned", value: enrolledCourses.length, icon: Award },
                { label: "Available", value: availableCourses.length, icon: ShoppingCart },
                { label: "Total", value: courses.length, icon: BookOpen },
              ].map((item) => (
                <div
                  key={item.label}
                  className="premium-surface rounded-2xl p-3 sm:p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <item.icon className="mb-3 h-4 w-4 text-[#f2b84b]" />
                  <div
                    className="text-3xl font-black text-white"
                    style={{
                      fontFamily:
                        "'Space Grotesk', system-ui, sans-serif",
                    }}
                  >
                    <AnimatedCounter value={String(item.value)} />
                  </div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {issuedCertificate && (
            <div className="premium-surface rounded-2xl border border-[#f2b84b]/25 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2b84b]/15">
                    <BadgeCheck className="h-5 w-5 text-[#ffe4a3]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Certificate ready</p>
                    <p className="text-xs text-slate-400">Your GCP completion certificate has been issued.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("certificate")}
                  className="rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#fff0a8] px-4 py-2.5 text-sm font-black text-[#1d1602]"
                >
                  View Certificate
                </button>
              </div>
            </div>
          )}

          <section className="premium-surface rounded-2xl p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-red-400/25 bg-red-500/15 shadow-lg shadow-red-500/10">
                  <Youtube className="h-6 w-6 text-red-200" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-red-200">
                    Free Learning Library
                  </p>
                  <h3 className="mt-1 text-lg font-black text-white">
                    Free GCP Data Engineering Playlist
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Watch extra lessons anytime from your dashboard.
                  </p>
                </div>
              </div>
              <a
                href={FREE_LEARNING_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-button inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-400"
              >
                <Play className="h-4 w-4 fill-white" />
                Play Lessons
              </a>
            </div>
          </section>
          </>
          )}

          {activeTab === "courses" && (
          <>
          <section>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8df5d7]">
                  Course Access
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  Enrolled Courses
                </h3>
              </div>
              <span className="rounded-full border border-[#18c29c]/25 bg-[#18c29c]/10 px-3 py-1 text-xs font-black text-[#9cf8dd]">
                {enrolledCourses.length} active
              </span>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="premium-surface rounded-2xl border-dashed px-5 py-10 text-center">
                <BookOpen className="mx-auto mb-3 h-10 w-10 text-[#f2b84b]" />
                <p className="font-bold text-white">No enrolled courses yet</p>
                <p className="mt-1 text-sm text-slate-400">
                  Pick a program below and complete enrollment to unlock access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {enrolledCourses.map((course) => {
                  const Icon = course.icon;
                  const courseAccess =
                    getEnrolledCourseAccess(course);
                  const driveAccessRequestHref =
                    getDriveAccessRequestHref(student, course);
                  const hasConfirmedAccess =
                    Boolean(confirmedAccess[course.id]);
                  return (
                    <div
                      key={course.id}
                      className="tilt-card premium-surface relative overflow-hidden rounded-2xl p-4 pt-5"
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                        style={{
                          background: `linear-gradient(90deg, ${course.accentFrom}, ${course.accentTo})`,
                        }}
                      />
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ring-1 ring-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${course.accentFrom}25 0%, ${course.accentTo}15 100%)`,
                            border: `1px solid ${course.accentFrom}50`,
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: course.accentFrom }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span
                            className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border uppercase"
                            style={{
                              color: course.accentFrom,
                              borderColor: `${course.accentFrom}50`,
                              background: `${course.accentFrom}15`,
                            }}
                          >
                            {course.badge}
                          </span>
                          <h4 className="mt-2 text-lg font-black text-white leading-tight">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {course.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.duration && (
                          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-xs text-slate-300">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </span>
                        )}
                        <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-xs text-slate-300">
                          <BookOpen className="w-3 h-3" />
                          {TYPE_LABELS[course.type]}
                        </span>
                      </div>

                      {courseAccess ? (
                        <a
                          href={courseAccess.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="magnetic-button mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16 transition-all"
                        >
                          <courseAccess.icon className="h-4 w-4" />
                          {courseAccess.label}
                        </a>
                      ) : (
                        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm leading-6 text-slate-300">
                          Course materials and recordings are shared through
                          Google Drive after access is enabled for your email.
                        </div>
                      )}

                      {hasConfirmedAccess ? (
                        <div className="mt-3 rounded-xl border border-[#18c29c]/25 bg-[#18c29c]/10 px-4 py-3 text-xs font-bold leading-5 text-[#9cf8dd]">
                          <div className="flex items-center gap-2 font-black uppercase tracking-[0.12em]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Access confirmed
                          </div>
                        </div>
                      ) : (
                        <>
                          <a
                            href={driveAccessRequestHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="magnetic-button mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#18c29c]/20 transition-all"
                          >
                            <Mail className="h-4 w-4" />
                            Ask Admin for Drive Access
                          </a>

                          <button
                            type="button"
                            onClick={() => confirmAccessReceived(course.id)}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 px-4 py-3 text-sm font-black text-[#9cf8dd] transition-all hover:border-[#18c29c]/55 hover:bg-[#18c29c]/16"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            I Received Access
                          </button>

                          <div className="mt-3 rounded-xl border border-[#f2b84b]/25 bg-gradient-to-r from-[#f2b84b]/12 to-white/[0.035] px-4 py-2.5 text-xs leading-5 text-[#ffe1a3]">
                            <div className="mb-1 flex items-center gap-2 font-black uppercase tracking-[0.12em] text-[#f2b84b]">
                              <Clock className="h-3.5 w-3.5" />
                              24 hour access window
                            </div>
                            Access will be provided to{" "}
                            <span className="font-black text-white">
                              {student.email}
                            </span>{" "}
                            within 24 hours. Please check your mail inbox for the
                            Google Drive invitation.
                          </div>
                        </>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section id="student-available-courses">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f2b84b]">
                  Grow Next
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  Enroll New Courses
                </h3>
              </div>
              <span className="w-fit rounded-full border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-3 py-1 text-xs font-black text-[#ffe4a3]">
                {availableCourses.length} options
              </span>
            </div>

            {availableCourses.length === 0 ? (
              <div className="premium-surface rounded-2xl p-5 text-sm text-slate-300">
                You are enrolled in every available course.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {availableCourses.map((course) => {
                  const Icon = course.icon;
                  const demoAccess = getDemoAccess(course);
                  return (
                    <div
                      key={course.id}
                      className="tilt-card premium-surface rounded-2xl p-3.5 sm:p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-1 ring-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${course.accentFrom}25 0%, ${course.accentTo}15 100%)`,
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: course.accentFrom }}
                          />
                        </div>
                        <div className="min-w-0">
                          <span
                            className="mb-2 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em]"
                            style={{
                              color: course.accentFrom,
                              borderColor: `${course.accentFrom}45`,
                              background: `${course.accentFrom}12`,
                            }}
                          >
                            {course.badge}
                          </span>
                          <h4 className="font-black text-white leading-tight">
                            {course.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-400">
                            {course.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xl font-black text-white">
                            {formatINR(course.price)}
                          </div>
                          {course.originalPrice && (
                            <div className="text-xs text-slate-500 line-through">
                              {formatINR(course.originalPrice)}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => onEnroll(course)}
                          className="magnetic-button rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-4 py-2 text-sm font-black text-white shadow-lg shadow-[#18c29c]/20"
                        >
                          Enroll
                        </button>
                      </div>

                      {demoAccess && (
                        <a
                          href={demoAccess.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-bold text-slate-300 hover:border-[#18c29c]/30 hover:text-white"
                        >
                          <demoAccess.icon className="w-3.5 h-3.5" />
                          {demoAccess.longLabel}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          </>
          )}

          {activeTab === "certificate" && (
            <section className="space-y-4">
              <div className="premium-surface rounded-2xl p-4 sm:p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#f2b84b]">
                      <Sparkles className="h-4 w-4" />
                      Achievement
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">
                      Your completion certificate
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm text-slate-400">
                      Official GCP Data Engineering certificates are issued by your instructor after course completion.
                    </p>
                  </div>
                  {issuedCertificate && (
                    <button
                      onClick={downloadCertificate}
                      className="magnetic-button inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#fff0a8] px-5 py-3 text-sm font-black text-[#1d1602] shadow-lg shadow-[#f2b84b]/15"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                  )}
                </div>

                {issuedCertificate ? (
                  <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-3">
                      <div className="rounded-xl border border-[#18c29c]/25 bg-[#18c29c]/10 px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9cf8dd]">
                          Certificate issued
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          ID: <span className="font-mono text-white">{issuedCertificate.certificateId}</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Issued on{" "}
                          {new Date(issuedCertificate.issuedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <a
                        href={TRAINER_WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm font-bold text-slate-200 hover:border-[#18c29c]/35"
                      >
                        Questions? WhatsApp your trainer
                      </a>
                    </div>
                    <CertificatePreview
                      data={{
                        studentName: issuedCertificate.studentName,
                        completionDate: issuedCertificate.completionDate,
                      }}
                      courseTitle={issuedCertificate.courseTitle}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
                    <BadgeCheck className="mx-auto mb-4 h-12 w-12 text-[#f2b84b]" />
                    <p className="text-lg font-black text-white">Certificate pending</p>
                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                      Complete your GCP Data Engineering program and your instructor will publish the certificate here with your name.
                    </p>
                    <p className="mt-4 text-xs text-slate-500">
                      Logged in as <span className="text-white">{student.email}</span>
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          <button
            onClick={onLogout}
            className="sm:hidden flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-3 text-sm font-bold text-slate-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
