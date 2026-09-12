import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Download,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Mail,
  Play,
  ShoppingCart,
  Sparkles,
  X,
  Youtube,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CertificatePreview } from "@/app/components/certificate/CertificatePreview";
import { openCertificatePrintWindow } from "@/app/lib/certificate";
import {
  isSupabaseConfigured,
  loadLearningProgress,
  loadPublishedCourseContent,
  setLearningModuleComplete,
  type PublishedModule,
} from "@/app/lib/supabase";
import type { LoggedInStudent } from "@/app/types";
import skillVaneLogo from "@/imports/logo1.png";

const FREE_LEARNING_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLk8wwChOsCPzoZHuQEiJqWVvhHFdFa6sy";

interface Course {
  id: string;
  type: string;
  badge: string;
  icon: React.ElementType;
  accentFrom: string;
  accentTo: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  zoomLink?: string;
  driveLink?: string;
  notesLink?: string;
  curriculum?: { module: string; topics: string[] }[];
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getEnrolledCourseAccess(course: Course) {
  if (course.type === "live" && course.zoomLink) {
    return { href: course.zoomLink, label: "Join Live Class", icon: Play };
  }
  return null;
}

function getDriveAccessRequestHref(student: LoggedInStudent, course: Course) {
  const message = [
    "Hi Admin, please provide Google Drive access for my course.",
    `Course: ${course.title}`,
    `Student Name: ${student.name}`,
    `Student Email ID: ${student.email}`,
    `Please provide access to this email: ${student.email}`,
  ].join("\n");
  return `https://wa.me/917305101711?text=${encodeURIComponent(message)}`;
}

type DashTab = "overview" | "courses" | "explore";

function usableResource(url?: string) {
  return url && !url.includes("REPLACE_WITH") ? url : null;
}

function LessonPlayer({
  student,
  course,
  completedModules,
  onToggleComplete,
  onClose,
}: {
  student: LoggedInStudent;
  course: Course;
  completedModules: number[];
  onToggleComplete: (moduleIndex: number) => void;
  onClose: () => void;
}) {
  const resumeKey = `skillvane_last_lesson_${student.email}_${course.id}`;
  const [publishedContent, setPublishedContent] = useState<PublishedModule[]>([]);
  useEffect(() => {
    if (isSupabaseConfigured) {
      void loadPublishedCourseContent(course.id).then(setPublishedContent).catch(() => undefined);
    }
  }, [course.id]);
  const databaseLessons = publishedContent.flatMap((contentModule) =>
    contentModule.lessons.map((lesson) => ({
      module: lesson.title,
      topics: lesson.description ? [lesson.description] : [contentModule.title],
      videoUrl: lesson.videoUrl,
      resources: lesson.resources,
    })),
  );
  const modules = databaseLessons.length ? databaseLessons : (course.curriculum || []);
  const [moduleIndex, setModuleIndex] = useState(() => {
    const saved = Number(localStorage.getItem(resumeKey));
    return Number.isInteger(saved) && saved >= 0 && saved < modules.length ? saved : 0;
  });
  const module = modules[moduleIndex];
  const isComplete = completedModules.includes(moduleIndex);

  const selectModule = (index: number) => {
    setModuleIndex(index);
    localStorage.setItem(resumeKey, String(index));
  };

  return (
    <div className="fixed inset-0 z-[135] flex bg-[#050b14]">
      <div className="flex w-full flex-col lg:grid lg:grid-cols-[20rem_1fr]">
        <aside className="order-2 max-h-[42vh] overflow-y-auto border-t border-white/10 bg-[#07111d] lg:order-1 lg:max-h-none lg:border-r lg:border-t-0">
          <div className="sticky top-0 z-10 border-b border-white/10 bg-[#07111d]/95 p-4 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8df5d7]">
              Course content
            </p>
            <h3 className="mt-1 text-sm font-black text-white">{course.title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {completedModules.length}/{modules.length} modules complete
            </p>
          </div>
          <div className="space-y-1 p-2">
            {modules.map((item, index) => {
              const complete = completedModules.includes(index);
              return (
                <button
                  key={`${course.id}-lesson-${index}`}
                  type="button"
                  onClick={() => selectModule(index)}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                    index === moduleIndex
                      ? "bg-[#18c29c]/12 text-white ring-1 ring-[#18c29c]/25"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-none ${complete ? "text-[#18c29c]" : "text-slate-600"}`} />
                  <span>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Module {index + 1}
                    </span>
                    <span className="block text-xs font-bold leading-snug">{item.module}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="order-1 min-h-0 flex-1 overflow-y-auto lg:order-2">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#08121f]/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#8df5d7]">
                Module {moduleIndex + 1} of {modules.length}
              </p>
              <h2 className="truncate font-black text-white">{module?.module}</h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(24,194,156,0.14),transparent_55%),#030811] shadow-2xl">
              <div className="max-w-md px-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#18c29c]/15 ring-1 ring-[#18c29c]/30">
                  <Play className="h-7 w-7 fill-[#8df5d7] text-[#8df5d7]" />
                </div>
                <h3 className="mt-4 text-lg font-black text-white">Lesson workspace ready</h3>
                <p className="mt-2 text-sm text-slate-400">
                  The lesson video will appear here when it is published by your instructor.
                </p>
                {"videoUrl" in (module || {}) && module.videoUrl ? <a href={module.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-xl bg-[#18c29c] px-5 py-2.5 text-sm font-black text-[#04110d]">Open lesson video</a> : usableResource(course.driveLink) && <a href={course.driveLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-xl bg-[#18c29c] px-5 py-2.5 text-sm font-black text-[#04110d]">Open course recordings</a>}
              </div>
            </div>

            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f2b84b]">What you will learn</p>
              <h3 className="mt-2 text-xl font-black text-white">{module?.module}</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {module?.topics.map((topic) => (
                  <div key={topic} className="flex gap-2 rounded-xl bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#18c29c]" />
                    {topic}
                  </div>
                ))}
              </div>
              {usableResource(course.notesLink) && (
                <a href={course.notesLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8df5d7]">
                  <Download className="h-4 w-4" /> Download lesson resources
                </a>
              )}
              {"resources" in (module || {}) && module.resources?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{module.resources.map((resource) => <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#18c29c]/25 bg-[#18c29c]/10 px-3 py-2 text-xs font-bold text-[#9cf8dd]"><Download className="mr-1 inline h-3 w-3" />{resource.title}</a>)}</div>}
            </section>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#08121f] p-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" disabled={moduleIndex === 0} onClick={() => selectModule(moduleIndex - 1)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 disabled:opacity-35">
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button type="button" onClick={() => onToggleComplete(moduleIndex)} className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black ${isComplete ? "border border-[#18c29c]/30 bg-[#18c29c]/10 text-[#9cf8dd]" : "bg-[#18c29c] text-[#04110d]"}`}>
                <CheckCircle2 className="h-4 w-4" /> {isComplete ? "Completed" : "Mark complete"}
              </button>
              <button type="button" disabled={moduleIndex >= modules.length - 1} onClick={() => selectModule(moduleIndex + 1)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 disabled:opacity-35">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

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
  const [tab, setTab] = useState<DashTab>("overview");
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);
  const [playerCourse, setPlayerCourse] = useState<Course | null>(null);
  const [certificateForm, setCertificateForm] = useState({
    studentName: student.name,
    completionDate: new Date().toISOString().slice(0, 10),
  });
  const [certificateMessage, setCertificateMessage] = useState("");
  const enrolledCourses = courses.filter((c) =>
    student.enrolledCourses.includes(c.id),
  );
  const availableCourses = courses.filter(
    (c) => !student.enrolledCourses.includes(c.id),
  );
  const accessStorageKey = `skillvane_drive_access_confirmed_${student.email}`;
  const progressStorageKey = `skillvane_learning_progress_${student.email}`;
  const [confirmedAccess, setConfirmedAccess] = useState<Record<string, boolean>>(
    () => {
      try {
        return JSON.parse(localStorage.getItem(accessStorageKey) || "{}");
      } catch {
        return {};
      }
    },
  );
  const [completedModules, setCompletedModules] = useState<Record<string, number[]>>(
    () => {
      try {
        return JSON.parse(localStorage.getItem(progressStorageKey) || "{}");
      } catch {
        return {};
      }
    },
  );
  const [progressSync, setProgressSync] = useState<"syncing" | "synced" | "local">(
    isSupabaseConfigured ? "syncing" : "local",
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    setProgressSync("syncing");
    loadLearningProgress()
      .then(async (remoteProgress) => {
        if (!active) return;
        const localProgress = completedModules;
        const merged = { ...remoteProgress };
        const pendingUploads: Promise<void>[] = [];
        student.enrolledCourses.forEach((courseId) => {
          const remoteModules = new Set(remoteProgress[courseId] || []);
          const localModules = localProgress[courseId] || [];
          localModules.forEach((moduleIndex) => {
            remoteModules.add(moduleIndex);
            if (!(remoteProgress[courseId] || []).includes(moduleIndex)) {
              pendingUploads.push(
                setLearningModuleComplete(courseId, moduleIndex, true),
              );
            }
          });
          merged[courseId] = [...remoteModules].sort((a, b) => a - b);
        });
        setCompletedModules(merged);
        localStorage.setItem(progressStorageKey, JSON.stringify(merged));
        await Promise.all(pendingUploads);
        if (active) setProgressSync("synced");
      })
      .catch(() => {
        if (active) setProgressSync("local");
      });
    return () => {
      active = false;
    };
  }, [progressStorageKey, student.email]);

  const confirmAccess = (courseId: string) => {
    const next = { ...confirmedAccess, [courseId]: true };
    setConfirmedAccess(next);
    localStorage.setItem(accessStorageKey, JSON.stringify(next));
  };

  const toggleModuleComplete = (courseId: string, moduleIndex: number) => {
    const completed = new Set(completedModules[courseId] || []);
    const willComplete = !completed.has(moduleIndex);
    if (willComplete) completed.add(moduleIndex);
    else completed.delete(moduleIndex);
    const next = {
      ...completedModules,
      [courseId]: [...completed].sort((a, b) => a - b),
    };
    setCompletedModules(next);
    localStorage.setItem(progressStorageKey, JSON.stringify(next));
    if (isSupabaseConfigured) {
      setProgressSync("syncing");
      void setLearningModuleComplete(courseId, moduleIndex, willComplete)
        .then(() => setProgressSync("synced"))
        .catch(() => setProgressSync("local"));
    }
  };

  const getCourseProgress = (course: Course) => {
    const moduleCount = course.curriculum?.length || 0;
    if (moduleCount === 0) return 0;
    const completedCount = (completedModules[course.id] || []).filter(
      (index) => index >= 0 && index < moduleCount,
    ).length;
    return Math.round((completedCount / moduleCount) * 100);
  };

  const openCertificate = (course: Course) => {
    setCertificateCourse(course);
    setCertificateForm({
      studentName: student.name,
      completionDate: new Date().toISOString().slice(0, 10),
    });
    setCertificateMessage("");
  };

  const generateCertificate = () => {
    if (!certificateCourse) return;
    if (!certificateForm.studentName.trim() || !certificateForm.completionDate) {
      setCertificateMessage("Please enter name and completion date.");
      return;
    }

    const ok = openCertificatePrintWindow({
      studentName: certificateForm.studentName,
      completionDate: certificateForm.completionDate,
      courseName: certificateCourse.title,
      logoUrl: skillVaneLogo,
    });
    setCertificateMessage(
      ok
        ? "Certificate opened. Use Save as PDF in the print dialog."
        : "Please allow popups to generate the certificate.",
    );
  };

  const enrolledModuleCount = enrolledCourses.reduce(
    (total, course) => total + (course.curriculum?.length || 0),
    0,
  );
  const completedModuleCount = enrolledCourses.reduce(
    (total, course) =>
      total +
      (completedModules[course.id] || []).filter(
        (index) => index >= 0 && index < (course.curriculum?.length || 0),
      ).length,
    0,
  );
  const progress = enrolledModuleCount
    ? Math.round((completedModuleCount / enrolledModuleCount) * 100)
    : 0;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: LayoutGrid },
    { id: "courses" as const, label: "My Courses", icon: BookOpen },
    { id: "explore" as const, label: "Explore", icon: ShoppingCart },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-[#02060c]/86 backdrop-blur-lg"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex h-[96dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl border border-white/[0.09] bg-[#08121f] shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:h-[90vh] sm:rounded-[1.5rem]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(45,212,166,0.09),transparent_35%),radial-gradient(ellipse_at_90%_10%,rgba(234,185,110,0.055),transparent_30%)]" />

        {/* Header */}
        <header className="relative flex items-center justify-between border-b border-white/[0.08] bg-[#0b1522]/70 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#2dd4a6] shadow-lg shadow-[#2dd4a6]/10">
              <GraduationCap className="h-5 w-5 text-[#04110d]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8bedd0]">
                Student Portal
              </p>
              <h2 className="truncate text-lg font-black text-white sm:text-xl">
                Hi, {student.name.split(" ")[0]}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white sm:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Nav */}
          <nav className="flex gap-1 border-b border-white/[0.08] bg-[#07111d]/55 p-2 lg:w-52 lg:flex-col lg:border-b-0 lg:border-r lg:p-4">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all lg:justify-start lg:px-4 ${
                  tab === id
                    ? "bg-[#2dd4a6]/10 text-[#8bedd0] ring-1 ring-[#2dd4a6]/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline lg:inline">{label}</span>
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 lms-dashboard-scroll">
            <AnimatePresence mode="wait">
              {tab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="dashboard-hero rounded-2xl border border-[#18c29c]/20 bg-gradient-to-br from-[#18c29c]/10 via-[#07111f] to-[#2f80ed]/10 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#f2b84b]/30 bg-[#f2b84b]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#ffe4a3]">
                          <Sparkles className="h-3 w-3" />
                          Learning path
                        </div>
                        <h3 className="text-2xl font-black text-white sm:text-3xl">
                          Continue your learning
                        </h3>
                        <p className="mt-2 max-w-lg text-sm text-slate-300">
                          Complete each curriculum module as you learn. Your
                          progress follows you across devices.
                        </p>
                        <p className="mt-2 text-xs font-bold text-[#8bedd0]">
                          {progressSync === "synced"
                            ? "Cloud progress synced"
                            : progressSync === "syncing"
                              ? "Syncing progress..."
                              : "Saved on this device until cloud sync resumes"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="relative flex h-24 w-24 items-center justify-center rounded-full"
                          style={{
                            background: `conic-gradient(#18c29c ${progress}%, rgba(255,255,255,0.08) 0)`,
                          }}
                        >
                          <div className="flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full bg-[#07111f]">
                            <span className="text-xl font-black text-white">
                              {progress}%
                            </span>
                            <span className="text-[9px] font-bold uppercase text-slate-500">
                              Complete
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Enrolled", val: enrolledCourses.length, icon: Award },
                      { label: "Available", val: availableCourses.length, icon: ShoppingCart },
                      { label: "Programs", val: courses.length, icon: BookOpen },
                    ].map(({ label, val, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center"
                      >
                        <Icon className="mx-auto mb-2 h-4 w-4 text-[#f2b84b]" />
                        <div className="text-2xl font-black text-white">{val}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-red-400/20 bg-red-500/8 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15">
                          <Youtube className="h-6 w-6 text-red-200" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-red-200">
                            Free library
                          </p>
                          <p className="font-bold text-white">
                            GCP Data Engineering Playlist
                          </p>
                        </div>
                      </div>
                      <a
                        href={FREE_LEARNING_PLAYLIST_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-black text-white hover:bg-red-400"
                      >
                        <Play className="h-4 w-4 fill-white" />
                        Watch
                      </a>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#f2b84b]/20 bg-[#f2b84b]/8 px-4 py-3 text-xs text-[#ffe4a3]">
                    Drive access is sent to{" "}
                    <span className="font-black text-white">{student.email}</span>
                  </div>
                </motion.div>
              )}

              {tab === "courses" && (
                <motion.div
                  key="courses"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-black text-white">
                    Enrolled courses ({enrolledCourses.length})
                  </h3>
                  {enrolledCourses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center">
                      <BookOpen className="mx-auto mb-3 h-10 w-10 text-[#f2b84b]" />
                      <p className="font-bold text-white">No courses yet</p>
                      <button
                        type="button"
                        onClick={() => setTab("explore")}
                        className="mt-3 text-sm font-bold text-[#8df5d7] hover:text-white"
                      >
                        Browse programs →
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {enrolledCourses.map((course) => {
                        const Icon = course.icon;
                        const access = getEnrolledCourseAccess(course);
                        const driveHref = getDriveAccessRequestHref(student, course);
                        const confirmed = Boolean(confirmedAccess[course.id]);
                        const courseProgress = getCourseProgress(course);
                        return (
                          <div
                            key={course.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-[#18c29c]/25"
                          >
                            <div className="flex gap-3">
                              <div
                                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                                style={{
                                  background: `linear-gradient(135deg, ${course.accentFrom}30, ${course.accentTo}15)`,
                                  border: `1px solid ${course.accentFrom}50`,
                                }}
                              >
                                <Icon className="h-5 w-5" style={{ color: course.accentFrom }} />
                              </div>
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-[#8df5d7]">
                                  {course.badge}
                                </span>
                                <h4 className="font-black text-white">{course.title}</h4>
                                <p className="text-xs text-slate-500">{course.subtitle}</p>
                              </div>
                             </div>
                             <div className="mt-4">
                              <div className="mb-2 flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-300">
                                  Course progress
                                </span>
                                <span className="font-black text-[#8df5d7]">
                                  {courseProgress}%
                                </span>
                             </div>
                            {course.curriculum && course.curriculum.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setPlayerCourse(course)}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] py-3 text-sm font-black text-white"
                              >
                                <Play className="h-4 w-4 fill-white" />
                                {courseProgress > 0 ? "Continue Learning" : "Start Learning"}
                              </button>
                            )}
                              <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#18c29c] to-[#2f80ed] transition-[width] duration-500"
                                  style={{ width: `${courseProgress}%` }}
                                />
                              </div>
                            </div>
                            {course.curriculum && course.curriculum.length > 0 && (
                              <details className="mt-3 rounded-xl border border-white/[0.08] bg-black/10">
                                <summary className="cursor-pointer px-3 py-2.5 text-xs font-black text-slate-200 marker:text-[#18c29c]">
                                  Track curriculum ({completedModules[course.id]?.length || 0}/
                                  {course.curriculum.length} modules)
                                </summary>
                                <div className="space-y-1 border-t border-white/[0.07] p-2">
                                  {course.curriculum.map((module, moduleIndex) => {
                                    const isComplete = (
                                      completedModules[course.id] || []
                                    ).includes(moduleIndex);
                                    return (
                                      <button
                                        key={`${course.id}-${moduleIndex}`}
                                        type="button"
                                        onClick={() =>
                                          toggleModuleComplete(course.id, moduleIndex)
                                        }
                                        className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                                          isComplete
                                            ? "bg-[#18c29c]/10 text-[#9cf8dd]"
                                            : "text-slate-300 hover:bg-white/5"
                                        }`}
                                      >
                                        <CheckCircle2
                                          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                            isComplete ? "fill-[#18c29c]/20" : "text-slate-600"
                                          }`}
                                        />
                                        <span>
                                          <span className="font-bold">
                                            Module {moduleIndex + 1}: {module.module}
                                          </span>
                                          <span className="mt-0.5 block text-[10px] text-slate-500">
                                            {module.topics.length} topics
                                          </span>
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </details>
                            )}
                            {access ? (
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <a
                                  href={access.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 py-2.5 text-sm font-black text-[#9cf8dd]"
                                >
                                  <access.icon className="h-4 w-4" />
                                  {access.label}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => openCertificate(course)}
                                  disabled={courseProgress < 100}
                                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 py-2.5 text-sm font-black text-[#ffe4a3] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Award className="h-4 w-4" />
                                   {courseProgress === 100 ? "Certificate" : "Certificate at 100%"}
                                </button>
                              </div>
                            ) : confirmed ? (
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <div className="flex items-center gap-2 rounded-xl border border-[#18c29c]/25 bg-[#18c29c]/10 px-3 py-2.5 text-xs font-bold text-[#9cf8dd]">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Access confirmed
                                </div>
                                <button
                                  type="button"
                                  onClick={() => openCertificate(course)}
                                  disabled={courseProgress < 100}
                                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 py-2.5 text-sm font-black text-[#ffe4a3] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Award className="h-4 w-4" />
                                   {courseProgress === 100 ? "Certificate" : "Certificate at 100%"}
                                </button>
                              </div>
                            ) : (
                              <div className="mt-3 space-y-2">
                                <a
                                  href={driveHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] py-2.5 text-sm font-black text-white"
                                >
                                  <Mail className="h-4 w-4" />
                                  Request Drive Access
                                </a>
                                <button
                                  type="button"
                                  onClick={() => confirmAccess(course.id)}
                                  className="w-full rounded-xl border border-white/10 py-2 text-xs font-bold text-slate-300"
                                >
                                  I received access
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openCertificate(course)}
                                  disabled={courseProgress < 100}
                                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 py-2.5 text-sm font-black text-[#ffe4a3] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Award className="h-4 w-4" />
                                   {courseProgress === 100 ? "Generate Certificate" : "Certificate at 100%"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {tab === "explore" && (
                <motion.div
                  key="explore"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-black text-white">
                    Available programs ({availableCourses.length})
                  </h3>
                  {availableCourses.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      You&apos;re enrolled in every program. Great work!
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {availableCourses.map((course) => {
                        const Icon = course.icon;
                        return (
                          <div
                            key={course.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-[#f2b84b]/25"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-lg"
                                style={{
                                  background: `${course.accentFrom}20`,
                                }}
                              >
                                <Icon className="h-5 w-5" style={{ color: course.accentFrom }} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-black text-white leading-tight">
                                  {course.title}
                                </h4>
                                <p className="text-xs text-slate-500">{course.subtitle}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div>
                                <span className="text-xl font-black text-white">
                                  {formatINR(course.price)}
                                </span>
                                {course.originalPrice && (
                                  <span className="ml-2 text-xs text-slate-500 line-through">
                                    {formatINR(course.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => onEnroll(course)}
                                className="rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] px-4 py-2 text-sm font-black text-white"
                              >
                                Enroll
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-white/10 p-3 sm:hidden">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-slate-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </motion.div>

      {certificateCourse && (
        <div className="fixed inset-0 z-[140] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setCertificateCourse(null)}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative max-h-[94dvh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-[#f2b84b]/25 bg-[#07111f] p-4 shadow-2xl sm:rounded-3xl sm:p-5 lms-dashboard-scroll"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f2b84b]">
                  Completion Certificate
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  {certificateCourse.title}
                </h3>
                <p className="text-sm text-slate-400">
                  Edit the certificate name and completion date before generating.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCertificateCourse(null)}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-400">
                    Certificate Name
                  </span>
                  <input
                    value={certificateForm.studentName}
                    onChange={(e) =>
                      setCertificateForm({
                        ...certificateForm,
                        studentName: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#18c29c]/50"
                    placeholder="Student full name"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-400">
                    Completion Date
                  </span>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="date"
                      value={certificateForm.completionDate}
                      onChange={(e) =>
                        setCertificateForm({
                          ...certificateForm,
                          completionDate: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-[#18c29c]/50"
                    />
                  </div>
                </label>

                {certificateMessage && (
                  <p className="rounded-xl border border-[#f2b84b]/20 bg-[#f2b84b]/10 px-3 py-2 text-xs font-semibold text-[#ffe4a3]">
                    {certificateMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={generateCertificate}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#f59e0b] px-5 py-3 text-sm font-black text-[#1b1202] shadow-lg shadow-[#f2b84b]/20"
                >
                  <Download className="h-4 w-4" />
                  Generate PDF
                </button>
              </div>

              <CertificatePreview
                studentName={certificateForm.studentName}
                completionDate={certificateForm.completionDate}
                courseName={certificateCourse.title}
              />
            </div>
          </motion.div>
        </div>
      )}
      {playerCourse && (
        <LessonPlayer
          student={student}
          course={playerCourse}
          completedModules={completedModules[playerCourse.id] || []}
          onToggleComplete={(moduleIndex) =>
            toggleModuleComplete(playerCourse.id, moduleIndex)
          }
          onClose={() => setPlayerCourse(null)}
        />
      )}
    </div>
  );
}
