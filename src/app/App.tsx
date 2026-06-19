import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Reveal } from "@/app/components/effects/Reveal";
import { AnimatedCounter } from "@/app/components/effects/AnimatedCounter";
import { EnrollmentTicker } from "@/app/components/effects/EnrollmentTicker";
import { GcpTechMarquee } from "@/app/components/effects/GcpTechMarquee";
import { TestimonialMarquee } from "@/app/components/effects/TestimonialMarquee";
import { LandingHero } from "@/app/components/landing/LandingHero";
import { SectionHeading } from "@/app/components/landing/SectionHeading";
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
  Menu,
  X,
  Layers,
  Video,
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

      <nav className="fixed inset-x-0 top-1 z-[70] border-b border-white/[0.06] bg-[#050b14]/85 backdrop-blur-xl">
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

      <LandingHero onExploreCourses={() => scrollTo("courses")} />

      <GcpTechMarquee />

      <section id="courses" className="landing-section landing-section-alt">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Courses"
              title={
                <>
                  Your{" "}
                  <span className="bg-gradient-to-r from-[#7cc7ff] to-[#18c29c] bg-clip-text text-transparent">
                    GCP learning path
                  </span>
                </>
              }
              description="Live morning batch or self-paced recordings — pick what fits your schedule."
            />
          </Reveal>

          {/* Category tabs */}
          <div className="mx-auto mb-8 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1">
            {COURSE_CATEGORIES.map(({ label, value, icon: CategoryIcon }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === value
                    ? "bg-white text-[#050b14]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CategoryIcon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{label}</span>
                <span className={`relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeCategory === value ? "bg-black/10 text-[#050b14]" : "bg-white/10 text-slate-500"
                }`}>
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
                  index={index}
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
        className="border-y border-white/[0.06] bg-[#050b14] py-5"
      >
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p className="text-center text-sm text-slate-400 sm:text-left">
            <span className="font-semibold text-white">Free on YouTube</span>
            {" — "}start with the GCP Data Engineering playlist before you enroll
          </p>
          <a
            href={FREE_LEARNING_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 px-5 py-2 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/[0.04]"
          >
            <Youtube className="h-4 w-4 text-red-400" />
            Watch Free
          </a>
        </Reveal>
      </section>

      <section id="instructor" className="landing-section landing-section-base">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Instructor"
              title="Learn from a working GCP professional"
              align="center"
            />
          </Reveal>

          <Reveal delay={100}>
          <div className="flex flex-col items-center gap-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:flex-row sm:items-start sm:p-8">
            <div className="flex flex-shrink-0 flex-col items-center gap-3">
              <div className="relative h-48 w-40 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-56 sm:w-44">
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

            <div className="flex-1 text-center sm:text-left">
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Shaik Saidhul
              </h3>
              <p className="mt-1 text-sm font-medium text-[#18c29c]">
                Solution Architect · SkillVane IT Academy
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                9+ years building data pipelines on GCP for enterprises across
                BFSI, e-commerce, and logistics. Google Certified Professional
                Data Engineer bringing real-world patterns into every session.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { value: "9+", label: "Years on GCP" },
                  { value: "2500+", label: "Students Trained" },
                  { value: "5", label: "GCP Certifications" },
                  { value: "30+", label: "Live Projects" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center"
                  >
                    <div
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                    >
                      <AnimatedCounter value={value} />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      <section id="testimonials" className="landing-section landing-section-alt">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Reviews"
              title="Trusted by professionals across India"
              description="4.9 / 5 average rating from 500+ learners"
            />
          </Reveal>

          <TestimonialMarquee testimonials={TESTIMONIALS} />
        </div>
      </section>

      <section id="faq" className="landing-section landing-section-base">
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Common questions" align="center" />
          </Reveal>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 60}>
              <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
                <button
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/[0.03]"
                  onClick={() =>
                    setOpenFaq(openFaq === i ? null : i)
                  }
                >
                  <span className="pr-4 text-sm font-medium text-slate-200">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-white/[0.06] px-4 pb-4">
                    <p className="pt-4 text-sm leading-relaxed text-slate-400">
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
      <footer className="border-t border-white/[0.06] bg-[#050b14] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white">
              <img src={skillVaneLogo} alt="SkillVane logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-sm font-semibold text-white">SkillVane IT Academy</span>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} SkillVane IT Academy
          </p>
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


