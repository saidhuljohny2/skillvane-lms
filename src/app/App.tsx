import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Reveal } from "@/app/components/effects/Reveal";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { CyclingTechWords } from "@/app/components/effects/CyclingTechWords";
import { DataPipelineVisual } from "@/app/components/effects/DataPipelineVisual";
import { EnrollmentTicker } from "@/app/components/effects/EnrollmentTicker";
import { FloatingOrbs } from "@/app/components/effects/FloatingOrbs";
import { HeroBackground } from "@/app/components/effects/HeroBackground";
import { GcpTechMarquee } from "@/app/components/effects/GcpTechMarquee";
import { TestimonialMarquee } from "@/app/components/effects/TestimonialMarquee";
import { LiveBatchBanner } from "@/app/components/landing/LiveBatchBanner";
import { SocialConnect } from "@/app/components/landing/SocialConnect";
import { ThemeToggle } from "@/app/components/theme/ThemeToggle";
import { CourseCard } from "@/app/components/course/CourseCard";
import { CourseModal } from "@/app/components/course/CourseModal";
import { LoginModal } from "@/app/components/modals/LoginModal";
import { AdminStudentsModal } from "@/app/components/modals/AdminStudentsModal";
import { StudentDashboard } from "@/app/components/modals/StudentDashboard";
import { EnrollmentFormModal } from "@/app/components/modals/EnrollmentFormModal";
import { InvoiceModal } from "@/app/components/modals/InvoiceModal";
import { RAZORPAY_KEY, TRAINER_WHATSAPP_LINK } from "@/app/config";
import { COURSES } from "@/app/data/courses";
import {
  FREE_LEARNING_PLAYLIST_URL,
  TESTIMONIALS,
  TICKER,
} from "@/app/data/marketing";
import { SOCIAL_LINKS } from "@/app/data/social";
import { celebrateEnrollment } from "@/app/lib/confetti";
import { generateInvoiceNo } from "@/app/lib/format";
import { loadRazorpay } from "@/app/lib/services";
import type { Course, CourseCategory, EnrollmentRecord, LoggedInStudent, StudentDetails } from "@/app/types";
import instructorPhoto from "@/imports/IMG_20260518_113243.jpg.jpeg";
import skillVaneLogo from "@/imports/logo1.png";
import {
  ChevronDown,
  Star,
  Users,
  Award,
  CheckCircle2,
  Menu,
  X,
  Play,
  Layers,
  Video,
  BookOpen,
  ArrowRight,
  MonitorPlay,
  MessageCircle,
  LogIn,
  LogOut,
  GraduationCap,
  Lock,
  Youtube,
} from "lucide-react";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<CourseCategory>("all");
  const [modalCourse, setModalCourse] = useState<Course | null>(
    null,
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [payLoading, setPayLoading] = useState<string | null>(
    null,
  );
  const [payError, setPayError] = useState<string | null>(null);
  const [formCourse, setFormCourse] = useState<Course | null>(
    null,
  );
  const [invoice, setInvoice] =
    useState<EnrollmentRecord | null>(null);

  // Authentication state
  const [currentStudent, setCurrentStudent] =
    useState<LoggedInStudent | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [ticker, setTicker] = useState(0);

  // Check if user is logged in on mount
  useEffect(() => {
    const studentData = localStorage.getItem(
      "skillvane_current_student",
    );
    if (studentData) {
      try {
        setCurrentStudent(JSON.parse(studentData));
      } catch (e) {
        localStorage.removeItem("skillvane_current_student");
      }
    }
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setTicker((i) => (i + 1) % TICKER.length),
      2800,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, nextProgress)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const anyOpen = !!(
      modalCourse ||
      formCourse ||
      invoice ||
      showLogin ||
      showAdmin ||
      showDashboard
    );
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    modalCourse,
    formCourse,
    invoice,
    showLogin,
    showAdmin,
    showDashboard,
  ]);

  const scrollTo = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const fixedTopOffset = 112;
      window.scrollTo({
        top:
          section.getBoundingClientRect().top +
          window.scrollY -
          fixedTopOffset,
        behavior: "smooth",
      });
    }
    setMobileOpen(false);
  };

  // Authentication handlers
  const handleLogin = (student: LoggedInStudent) => {
    setCurrentStudent(student);
    setShowLogin(false);
    setShowDashboard(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("skillvane_current_student");
    setCurrentStudent(null);
    setShowDashboard(false);
  };

  // Step 1: Enroll button -> show student details form
  const getSavedStudentDetails = (
    student: LoggedInStudent,
  ): StudentDetails | null => {
    try {
      const studentsData = localStorage.getItem("skillvane_students");
      const students: Record<string, any> = studentsData
        ? JSON.parse(studentsData)
        : {};
      const saved = students[student.email];

      if (
        saved?.name &&
        saved?.email &&
        /^[6-9]\d{9}$/.test(saved.phone || "") &&
        saved?.password
      ) {
        return {
          name: saved.name,
          email: saved.email,
          phone: saved.phone,
          password: saved.password,
        };
      }
    } catch (err) {
      console.error("Could not load saved student details:", err);
    }

    return null;
  };

  // Step 2: Form submitted -> open Razorpay
  const startEnrollmentPayment = async (
    course: Course,
    student: StudentDetails,
  ) => {
    setFormCourse(null);
    setShowDashboard(false);
    setPayLoading(course.id);
    setPayError(null);

    try {
      // Load Razorpay SDK
      await loadRazorpay();

      // Validate Razorpay key
      if (
        !RAZORPAY_KEY ||
        RAZORPAY_KEY === "YOUR_RAZORPAY_KEY"
      ) {
        throw new Error(
          "Razorpay key not configured. Please add your key at the top of App.tsx",
        );
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: course.price * 100, // Amount in paise
        currency: "INR",
        name: "SkillVane IT Academy",
        description: `${course.title} - ${course.subtitle}`,
        image: "", // Optional: Add your logo URL
        handler: (response: any) => {
          setPayLoading(null);

          // Validate payment response
          if (!response.razorpay_payment_id) {
            setPayError(
              "Payment verification failed. Please contact support.",
            );
            setTimeout(() => setPayError(null), 6000);
            return;
          }

          const record: EnrollmentRecord = {
            invoiceNo: generateInvoiceNo(),
            paymentId: response.razorpay_payment_id,
            student,
            course,
            paidAt: new Date(),
          };

          // Auto-create/update student account and enroll in course
          try {
            const studentsData = localStorage.getItem(
              "skillvane_students",
            );
            const students: Record<string, any> = studentsData
              ? JSON.parse(studentsData)
              : {};

            if (!students[student.email]) {
              // Create new student account
              students[student.email] = {
                email: student.email,
                name: student.name,
                phone: student.phone,
                password: student.password,
                enrolledCourses: [course.id],
                createdAt: new Date().toISOString(),
              };
            } else {
              // Add course to existing student
              students[student.email].name = student.name;
              students[student.email].phone = student.phone;
              students[student.email].password = student.password;
              if (!students[student.email].enrolledCourses) {
                students[student.email].enrolledCourses = [];
              }
              if (
                !students[
                  student.email
                ].enrolledCourses.includes(course.id)
              ) {
                students[student.email].enrolledCourses.push(
                  course.id,
                );
              }
            }

            localStorage.setItem(
              "skillvane_students",
              JSON.stringify(students),
            );

            // Auto-login the student
            const loggedStudent: LoggedInStudent = {
              email: student.email,
              name: student.name,
              enrolledCourses:
                students[student.email].enrolledCourses,
            };
            localStorage.setItem(
              "skillvane_current_student",
              JSON.stringify(loggedStudent),
            );
            setCurrentStudent(loggedStudent);

            celebrateEnrollment();
            setInvoice(record);
          } catch (err) {
            console.error("Error saving enrollment:", err);
            setPayError(
              "Payment successful but enrollment failed. Please contact support with payment ID: " +
                response.razorpay_payment_id,
            );
            setTimeout(() => setPayError(null), 10000);
          }
        },
        prefill: {
          name: student.name,
          email: student.email,
          contact: "+91" + student.phone,
        },
        notes: {
          course_id: course.id,
          course_title: course.title,
          student_email: student.email,
          student_name: student.name,
        },
        theme: {
          color: course.accentFrom,
          backdrop_color: "rgba(0, 0, 0, 0.8)",
        },
        modal: {
          ondismiss: () => {
            setPayLoading(null);
            setPayError(
              "Payment cancelled. You can try again anytime.",
            );
            setTimeout(() => setPayError(null), 4000);
          },
          confirm_close: true,
          escape: false,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      const rzp = new (window as any).Razorpay(options);

      // Handle payment failures
      rzp.on("payment.failed", (resp: any) => {
        setPayLoading(null);
        const errorMsg =
          resp.error?.description ||
          resp.error?.reason ||
          "Payment failed";
        setPayError(
          `Payment failed: ${errorMsg}. Please try again.`,
        );
        setTimeout(() => setPayError(null), 8000);
      });

      rzp.open();
    } catch (err: any) {
      setPayLoading(null);
      const errorMsg =
        err.message || "Could not load payment gateway";
      setPayError(
        errorMsg +
          ". Please check your internet connection and try again.",
      );
      setTimeout(() => setPayError(null), 8000);
      console.error("Razorpay error:", err);
    }
  };

  const handleEnroll = (course: Course) => {
    setModalCourse(null);

    if (currentStudent?.enrolledCourses.includes(course.id)) {
      setShowDashboard(true);
      setPayError("You are already enrolled in this course.");
      setTimeout(() => setPayError(null), 4000);
      return;
    }

    if (currentStudent) {
      const savedStudent = getSavedStudentDetails(currentStudent);
      if (savedStudent) {
        void startEnrollmentPayment(course, savedStudent);
        return;
      }
    }

    setFormCourse(course);
  };

  const handleFormSubmit = async (student: StudentDetails) => {
    if (!formCourse) return;
    await startEnrollmentPayment(formCourse, student);
  };

  const COURSE_CATEGORIES: {
    label: string;
    value: CourseCategory;
    icon: React.ElementType;
  }[] = [
    {
      label: "All",
      value: "all",
      icon: Layers,
    },
    {
      label: "Live Batch",
      value: "live-batch",
      icon: MonitorPlay,
    },
    {
      label: "Self-paced",
      value: "self-paced",
      icon: Video,
    },
  ];

  const visibleCourses = COURSES.filter((course) => {
    if (activeCategory === "all") return true;
    return activeCategory === "live-batch"
      ? course.type === "live"
      : course.type !== "live";
  });

  const faqs = [
    {
      q: "Do I need prior GCP experience?",
      a: "No. The GCP courses start from cloud fundamentals. For the project courses, basic GCP knowledge is helpful. The Python course has no prerequisites at all.",
    },
    {
      q: "What is the difference between the Live Batch and Recordings course?",
      a: "The Live Batch gives you real-time interaction with the instructor (Mon-Fri, 7:30-8:30 AM) plus daily recordings, notes, and resume assistance. The Recordings course gives you the full video archive of the latest batch to study at your own pace.",
    },
    {
      q: "Can I buy the project courses without the main GCP course?",
      a: "Yes. The project courses are standalone. However, they are most effective if you have some GCP fundamentals. We recommend completing the Recordings course first if you are new to GCP.",
    },
    {
      q: "Is there a refund policy?",
      a: "Yes - 7-day no-questions-asked refund if you are not satisfied after accessing up to the first two modules of any course.",
    },
    {
      q: "Is EMI or instalment payment available?",
      a: "Yes. Razorpay offers 0% EMI on most major credit cards. The option appears automatically at checkout.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-[#f2b84b]/25"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* â”€â”€ Navbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="fixed inset-x-0 top-0 z-[90] h-1 bg-[#07111f]">
        <div
          className="h-full rounded-r-full bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] shadow-[0_0_20px_rgba(242,184,75,0.45)] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav className="fixed inset-x-0 top-1 z-[70] border-b border-white/10 bg-[#07111f]/88 shadow-2xl shadow-black/25 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-[#18c29c]/20 ring-1 ring-white/15 overflow-hidden">
              <img
                src={skillVaneLogo}
                alt="SkillVane logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <span
              className="font-bold text-base tracking-tight"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              SkillVane{" "}
              <span className="bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] bg-clip-text text-transparent">
                IT Academy
              </span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 text-sm text-muted-foreground">
            <button
              onClick={() => scrollTo("courses")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => scrollTo("free-learning")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              Free Lessons
            </button>
            <button
              onClick={() => scrollTo("instructor")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              Instructor
            </button>
            <button
              onClick={() => scrollTo("testimonials")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="rounded-full px-4 py-2 font-bold hover:bg-white/[0.08] hover:text-foreground transition-colors"
            >
              FAQ
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {currentStudent ? (
              <>
                <button
                  onClick={() => setShowAdmin(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#f2b84b]/25 text-[#ffe4a3] hover:text-white hover:border-[#f2b84b]/45 transition-all text-sm font-semibold"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </button>
                <button
                  onClick={() => setShowDashboard(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white text-sm font-semibold hover:shadow-xl hover:shadow-[#18c29c]/30 hover:scale-105 transition-all shadow-lg shadow-[#18c29c]/20"
                >
                  <GraduationCap className="w-4 h-4" />
                  My Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAdmin(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#f2b84b]/25 text-[#ffe4a3] hover:text-white hover:border-[#f2b84b]/45 transition-all text-sm font-semibold"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/12 text-muted-foreground hover:text-foreground hover:border-[#18c29c]/40 transition-all text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => scrollTo("courses")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white text-sm font-semibold hover:shadow-xl hover:shadow-[#18c29c]/30 hover:scale-105 transition-all shadow-lg shadow-[#18c29c]/20"
                >
                  View Courses
                </button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
          <button
            className="p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0b1524] border-t border-white/10 px-4 py-4 flex flex-col gap-1">
            {[
              "courses",
              "free-learning",
              "instructor",
              "testimonials",
              "faq",
            ].map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="capitalize text-sm text-muted-foreground hover:text-foreground py-2.5 text-left border-b border-border/40 last:border-0"
              >
                {s === "faq"
                  ? "FAQ"
                  : s === "free-learning"
                    ? "Free Lessons"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            {currentStudent ? (
              <>
                <button
                  onClick={() => {
                    setShowAdmin(true);
                    setMobileOpen(false);
                  }}
                  className="mt-3 w-full py-3 rounded-xl border border-[#f2b84b]/25 text-[#ffe4a3] text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </button>
              <button
                onClick={() => {
                  setShowDashboard(true);
                  setMobileOpen(false);
                }}
                className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white text-sm font-semibold shadow-lg shadow-[#18c29c]/20 flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                My Dashboard
              </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowAdmin(true);
                    setMobileOpen(false);
                  }}
                  className="mt-3 w-full py-3 rounded-xl border border-[#f2b84b]/25 text-[#ffe4a3] text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </button>
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setMobileOpen(false);
                  }}
                  className="mt-3 w-full py-3 rounded-xl border border-white/12 text-foreground text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => scrollTo("courses")}
                  className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white text-sm font-semibold shadow-lg shadow-[#18c29c]/20"
                >
                View Courses
              </button>
            </>
          )}
          </div>
        )}
      </nav>

      <EnrollmentTicker
        messages={TICKER}
        activeIndex={ticker}
        onEnrollClick={() => scrollTo("courses")}
      />

      {!showDashboard && (
        <a
          href={TRAINER_WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-fab fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
          aria-label="WhatsApp trainer support"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}

      {/* ── Hero ── */}
      <section className="relative min-h-[92svh] overflow-hidden bg-[#050b14] pt-[4.5rem] sm:pt-[5.5rem]">
        <HeroBackground />
        <FloatingOrbs />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050b14] to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(92svh-5rem)] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <div>
              <Reveal delay={0}>
                <LiveBatchBanner onClick={() => scrollTo("courses")} />
              </Reveal>

              <Reveal delay={60}>
                <h1
                  className="max-w-3xl text-4xl font-black leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]"
                  style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                >
                  <span className="block">Master</span>
                  <span className="block">
                    <CyclingTechWords />
                  </span>
                  <span className="mt-1 block">
                    with{" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-[#7cc7ff] to-[#18c29c] bg-clip-text text-transparent text-gradient-animate">
                      Shaik Saidhul
                    </span>
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  Industry-focused Google Cloud Data Engineering — live classes,
                  hands-on pipelines, real case studies, and career support.
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => scrollTo("courses")}
                    className="magnetic-button group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] px-8 py-4 text-base font-extrabold text-white shadow-2xl shadow-[#18c29c]/25"
                  >
                    Explore Courses
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => scrollTo("instructor")}
                    className="magnetic-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.05] px-8 py-4 text-base font-bold text-white backdrop-blur-md hover:border-[#f2b84b]/45"
                  >
                    <Play className="h-5 w-5 text-[#f2b84b]" />
                    Meet Instructor
                  </button>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-6 flex flex-wrap gap-2 stagger-children">
                  {[
                    "Daily live sessions",
                    "Recordings shared",
                    "Portfolio projects",
                    "Resume guidance",
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-colors hover:border-[#18c29c]/35"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#18c29c]" />
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal direction="right" delay={100}>
              <div className="pipeline-hero-glow pipeline-hero-float mx-auto w-full max-w-xl lg:max-w-none">
                <DataPipelineVisual />
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <Reveal delay={300}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Users, val: "2500+", label: "Learners" },
                  { icon: Star, val: "4.9/5", label: "Rating" },
                  { icon: Award, val: "9+", label: "Years" },
                  { icon: BookOpen, val: "5", label: "Programs" },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="hero-stat-chip rounded-xl p-3 sm:p-4">
                    <Icon className="mb-2 h-4 w-4 text-[#f2b84b]" />
                    <div
                      className="text-xl font-black text-white sm:text-2xl"
                      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                    >
                      <AnimatedCounter value={val} />
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <SocialConnect />
          </div>
        </div>
      </section>

      <GcpTechMarquee />

      {/* â”€â”€ Courses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section
        id="courses"
        className="relative py-12 sm:py-16 bg-[#08111f] overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(66,133,244,0.12),transparent_40%),radial-gradient(ellipse_at_70%_100%,rgba(24,194,156,0.1),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="mx-auto mb-7 max-w-3xl text-center sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18c29c]/10 border border-[#18c29c]/25 text-xs font-mono text-[#8df5d7] tracking-widest uppercase mb-4 shadow-lg shadow-[#18c29c]/10">
              <span className="w-2 h-2 rounded-full bg-[#18c29c] animate-pulse" />
              Premium Programs
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black mb-4 text-white"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Pick your{" "}
              <span className="bg-gradient-to-r from-[#4285f4] via-[#18c29c] to-[#fbbc04] bg-clip-text text-transparent">
                GCP learning path
              </span>
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Choose the format that fits your schedule and career goals.
            </p>
          </Reveal>

          {/* Category tabs */}
          <div className="premium-surface mx-auto mb-7 flex w-fit max-w-full flex-wrap justify-center gap-2 rounded-2xl p-2">
            {COURSE_CATEGORIES.map(({ label, value, icon: CategoryIcon }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-black transition-all ${
                  activeCategory === value
                    ? "bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#7cc7ff] text-white shadow-lg shadow-[#18c29c]/20"
                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-[#f2b84b]/35 hover:text-white"
                }`}
              >
                {activeCategory === value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0" />
                )}
                <CategoryIcon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{label}</span>
                <span className="relative z-10 rounded-full bg-black/18 px-2 py-0.5 text-[10px] font-black">
                  {
                    value === "all"
                      ? COURSES.length
                      : COURSES.filter((course) =>
                          value === "live-batch"
                            ? course.type === "live"
                            : course.type !== "live",
                        ).length
                  }
                </span>
              </button>
            ))}
          </div>

          {/* Payment error banner */}
          {payError && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center font-semibold">
              Error: {payError}
            </div>
          )}

          {/* Course grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {visibleCourses.map((course, index) => (
              <Reveal
                key={course.id}
                delay={index * 80}
                className={course.id === "gcp-live" ? "lg:col-span-2" : ""}
              >
                <CourseCard
                  course={course}
                  onEnroll={handleEnroll}
                />
              </Reveal>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">
            More courses coming soon - All prices in INR
            inclusive of taxes
          </p>
        </div>
      </section>

      <section
        id="free-learning"
        className="relative border-y border-white/10 bg-[#07111f] py-6 sm:py-8"
      >
        <Reveal className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-red-400/25 bg-red-500/15">
              <Play className="h-5 w-5 fill-red-200 text-red-200" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-300">
                Free on YouTube
              </p>
              <p
                className="text-lg font-black text-white sm:text-xl"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                GCP Data Engineering playlist — start before you enroll
              </p>
            </div>
          </div>
          <a
            href={FREE_LEARNING_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-button inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-400"
          >
            <Youtube className="h-4 w-4" />
            Watch Free
          </a>
        </Reveal>
      </section>

      <section
        id="instructor"
        className="relative py-12 sm:py-16 bg-[#08111f] overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(24,194,156,0.12),transparent_32%),radial-gradient(ellipse_at_86%_62%,rgba(47,128,237,0.1),transparent_34%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-7">
            <span className="inline-flex rounded-full border border-[#18c29c]/25 bg-[#18c29c]/10 px-4 py-2 text-xs font-mono text-[#8df5d7] tracking-widest uppercase">
              Your Instructor
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black mt-3 text-white"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Learn From a Working Professional
            </h2>
          </Reveal>

          <Reveal delay={100}>
          <div className="premium-surface rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start">
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="premium-ring relative w-40 h-52 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-[#18c29c]/20 ring-1 ring-white/12 instructor-photo-glow">
                <ImageWithFallback
                  src={instructorPhoto}
                  alt="SkillVane IT Academy - GCP Data Engineering Instructor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3
                className="text-2xl sm:text-3xl font-black mb-1 text-white"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                Shaik Saidhul
              </h3>
              <p className="text-[#8df5d7] font-semibold text-sm mb-4">
                Solution Architect - SkillVane IT Academy
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xl">
                With over 9+ years of hands-on experience
                designing large-scale data pipelines on Google
                Cloud Platform, your instructor has architected
                solutions for Fortune 500 enterprises across
                BFSI, e-commerce, and logistics. As a Google
                Certified Professional Data Engineer and Cloud
                Architect, they bring real-world war stories,
                battle-tested patterns, and current industry
                practices into every lesson - no filler, no
                theory-only slides.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: "9+", label: "Years on GCP" },
                  { value: "2500+", label: "Students Trained" },
                  { value: "5", label: "GCP Certifications" },
                  { value: "30+", label: "Live Projects" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                      className="rounded-xl border border-white/10 bg-[#07111f]/72 p-3 text-center shadow-lg shadow-black/10 sm:p-4"
                  >
                    <div
                      className="text-xl sm:text-2xl font-black text-[#f2b84b]"
                      style={{
                        fontFamily:
                          "'Outfit', system-ui, sans-serif",
                      }}
                    >
                      <AnimatedCounter value={value} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        className="relative py-12 sm:py-16 bg-[#07111f] border-y border-white/10 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_12%,rgba(242,184,75,0.1),transparent_30%),radial-gradient(ellipse_at_80%_70%,rgba(24,194,156,0.1),transparent_34%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-8">
            <span className="inline-flex rounded-full border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-4 py-2 text-xs font-mono text-[#ffe4a3] tracking-widest uppercase">
              Reviews
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black mt-2 mb-3 text-white"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Trusted by Professionals Across India
            </h2>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-yellow-400"
                />
              ))}
              <span className="ml-2 text-slate-400 text-sm">
                4.9 / 5 - 500+ ratings
              </span>
            </div>
          </Reveal>

          <TestimonialMarquee testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="faq" className="relative py-12 sm:py-16 bg-[#08111f] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,184,75,0.1),transparent_38%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-7">
            <span className="inline-flex rounded-full border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-4 py-2 text-xs font-mono text-[#f2b84b] tracking-widest uppercase">
              FAQ
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black mt-2 text-white"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Common Questions
            </h2>
          </Reveal>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 60}>
              <div
                className="premium-surface rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.06] transition-colors"
                  onClick={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                >
                  <span className="font-semibold text-sm pr-4 text-slate-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-white/10 bg-[#07111f]/70">
                    <p className="text-sm text-slate-300 pt-4 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 border-t border-white/10 bg-[#050b14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center overflow-hidden">
              <img
                src={skillVaneLogo}
                alt="SkillVane logo"
                className="h-7 w-7 object-contain"
              />
            </div>
            <span
              className="font-bold text-white"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              SkillVane IT Academy
            </span>
          </div>
          <span>
            (c) {new Date().getFullYear()} SkillVane IT Academy.
            All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.href.startsWith("tel:") ? undefined : "_blank"}
                  rel={link.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${link.border} ${link.bg} ${link.text} ${link.hoverBorder} hover:text-white`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </footer>

      {/* â”€â”€ Course Detail Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {modalCourse && (
        <CourseModal
          course={modalCourse}
          onClose={() => setModalCourse(null)}
          onEnroll={handleEnroll}
        />
      )}

      {/* â”€â”€ Enrollment Form Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {formCourse && (
        <EnrollmentFormModal
          course={formCourse}
          onClose={() => setFormCourse(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* â”€â”€ Invoice / Success Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {invoice && (
        <InvoiceModal
          record={invoice}
          onClose={() => setInvoice(null)}
        />
      )}

      {/* â”€â”€ Login Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {showAdmin && (
        <AdminStudentsModal
          courses={COURSES}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* â”€â”€ Student Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {showDashboard && currentStudent && (
        <StudentDashboard
          student={currentStudent}
          courses={COURSES}
          onLogout={handleLogout}
          onClose={() => setShowDashboard(false)}
          onEnroll={(course) => {
            setShowDashboard(false);
            handleEnroll(course);
          }}
        />
      )}
    </div>
  );
}


