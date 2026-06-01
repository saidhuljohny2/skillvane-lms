import { useState } from "react";
import {
  Play, Lock, BookOpen, Clock, LogOut, CheckCircle2, Cloud,
} from "lucide-react";
import type { Student } from "./LoginPage";
import type { CourseContent } from "./CourseContentPage";

interface DashboardCourse {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  accentFrom: string;
  accentTo: string;
  icon: React.ElementType;
  totalLessons: number;
  totalDuration: string;
  enrolled: boolean;
  content?: CourseContent;
}

export default function StudentDashboard({
  student,
  courses,
  onWatchCourse,
  onLogout,
  onBrowse,
}: {
  student: Student;
  courses: DashboardCourse[];
  onWatchCourse: (content: CourseContent) => void;
  onLogout: () => void;
  onBrowse: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"my-courses" | "browse">("my-courses");

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const browseCourses = courses.filter((c) => !c.enrolled);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4361ee] flex items-center justify-center shadow-md shadow-[#4361ee]/30">
              <Cloud className="w-3.5 h-3.5 text-white" />
            </div>
            <span
              className="font-bold text-sm tracking-tight"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              SkillVane <span className="text-[#4361ee]">IT Academy</span>
            </span>
          </div>

          {/* Tabs (desktop) */}
          <div className="hidden sm:flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setActiveTab("my-courses")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "my-courses"
                  ? "bg-[#4361ee] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "browse"
                  ? "bg-[#4361ee] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Browse All
            </button>
          </div>

          {/* Student + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${student.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
              >
                {student.avatar}
              </div>
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-foreground leading-none">{student.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Student</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden flex border-t border-border">
          {(["my-courses", "browse"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "text-[#4361ee] border-b-2 border-[#4361ee]"
                  : "text-muted-foreground"
              }`}
            >
              {tab === "my-courses" ? "My Courses" : "Browse All"}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "my-courses" ? (
          <>
            {/* Welcome strip */}
            <div
              className="rounded-2xl p-5 sm:p-6 mb-8 border border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                background: "linear-gradient(135deg, #4361ee18 0%, #3bc9db0a 100%)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${student.avatarColor} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg`}
                >
                  {student.avatar}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-0.5">
                    Welcome back
                  </p>
                  <h1
                    className="text-xl sm:text-2xl font-bold text-foreground"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                  >
                    {student.name}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Student since {student.joinedDate} · {enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""} enrolled
                  </p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-5 text-center">
                {[
                  { label: "Enrolled", value: enrolledCourses.length, icon: BookOpen, color: "text-[#4361ee]" },
                  { label: "Lessons", value: enrolledCourses.reduce((s, c) => s + c.totalLessons, 0), icon: Play, color: "text-emerald-400" },
                ].map(({ label, value, icon: Ic, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Ic className={`w-4 h-4 ${color}`} />
                    <span
                      className="text-xl font-bold text-foreground"
                      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                      {value}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrolled courses */}
            <div className="mb-3 flex items-center justify-between">
              <h2
                className="text-sm font-bold text-foreground"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              >
                Your Enrolled Courses
              </h2>
              <span className="text-xs text-muted-foreground">{enrolledCourses.length} courses</span>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground text-sm">No courses enrolled yet.</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#4361ee] text-white text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Browse Courses →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((course) => (
                  <EnrolledCourseCard
                    key={course.id}
                    course={course}
                    onWatch={() => course.content && onWatchCourse(course.content)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Browse header */}
            <div className="mb-8">
              <h2
                className="text-xl font-bold text-foreground mb-1"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
              >
                All Courses
              </h2>
              <p className="text-sm text-muted-foreground">
                Enroll in a course to unlock video recordings
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <BrowseCourseCard
                  key={course.id}
                  course={course}
                  onWatch={() => course.content && onWatchCourse(course.content)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ── Enrolled course card ──────────────────────────────────────────────────
function EnrolledCourseCard({
  course,
  onWatch,
}: {
  course: DashboardCourse;
  onWatch: () => void;
}) {
  const Icon = course.icon;
  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-card overflow-hidden hover:border-white/20 transition-all duration-300">
      {/* Accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)` }}
      />

      {/* Enrolled badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
        <CheckCircle2 className="w-2.5 h-2.5" />
        Enrolled
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Icon + badge */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}22 0%, ${course.accentTo}11 100%)`,
              border: `1px solid ${course.accentFrom}40`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: course.accentFrom }} />
          </div>
          <span
            className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border"
            style={{
              color: course.accentFrom,
              borderColor: `${course.accentFrom}40`,
              background: `${course.accentFrom}12`,
            }}
          >
            {course.badge}
          </span>
        </div>

        <h3
          className="text-base font-bold text-white leading-tight mb-0.5"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          {course.title}
        </h3>
        <p className="text-xs text-white/40 mb-4">{course.subtitle}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5 flex-1">
          <span className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            {course.totalLessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.totalDuration}
          </span>
        </div>

        <button
          onClick={onWatch}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
            boxShadow: `0 4px 20px ${course.accentFrom}30`,
          }}
        >
          <Play className="w-3.5 h-3.5" />
          Watch Recordings
        </button>
      </div>
    </div>
  );
}

// ── Browse course card (locked) ───────────────────────────────────────────
function BrowseCourseCard({
  course,
  onWatch,
}: {
  course: DashboardCourse;
  onWatch: () => void;
}) {
  const Icon = course.icon;
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 ${
        course.enrolled
          ? "border-white/10 bg-card hover:border-white/20"
          : "border-white/6 bg-card/60"
      }`}
    >
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)` }}
      />

      {/* Status badge */}
      <div className="absolute top-4 right-4">
        {course.enrolled ? (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Enrolled
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30">
            <Lock className="w-2.5 h-2.5" />
            Locked
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}${course.enrolled ? "22" : "12"} 0%, ${course.accentTo}11 100%)`,
              border: `1px solid ${course.accentFrom}${course.enrolled ? "40" : "20"}`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: course.enrolled ? course.accentFrom : `${course.accentFrom}60` }} />
          </div>
          <span
            className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border"
            style={{
              color: course.enrolled ? course.accentFrom : `${course.accentFrom}60`,
              borderColor: `${course.accentFrom}${course.enrolled ? "40" : "20"}`,
              background: `${course.accentFrom}${course.enrolled ? "12" : "08"}`,
            }}
          >
            {course.badge}
          </span>
        </div>

        <h3
          className={`text-base font-bold leading-tight mb-0.5 ${course.enrolled ? "text-white" : "text-white/50"}`}
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          {course.title}
        </h3>
        <p className={`text-xs mb-4 ${course.enrolled ? "text-white/40" : "text-white/25"}`}>
          {course.subtitle}
        </p>

        <div className={`flex items-center gap-4 text-xs mb-5 flex-1 ${course.enrolled ? "text-muted-foreground" : "text-white/25"}`}>
          <span className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            {course.totalLessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.totalDuration}
          </span>
        </div>

        {course.enrolled ? (
          <button
            onClick={onWatch}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom} 0%, ${course.accentTo} 100%)`,
            }}
          >
            <Play className="w-3.5 h-3.5" />
            Watch Recordings
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-white/25 flex items-center justify-center gap-2 border border-white/8 bg-white/3 cursor-not-allowed select-none">
            <Lock className="w-3.5 h-3.5" />
            Enroll to Unlock
          </div>
        )}
      </div>
    </div>
  );
}
