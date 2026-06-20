import { motion } from "motion/react";
import {
  ArrowRight,
  GraduationCap,
  Lock,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { LoggedInStudent } from "@/app/types";
import { useActiveSection } from "@/app/hooks/useActiveSection";

const NAV = [
  { id: "courses", label: "Courses" },
  { id: "free-learning", label: "Free Lessons" },
  { id: "instructor", label: "Instructor" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "FAQ" },
] as const;

export function Navbar({
  logo,
  scrollProgress,
  mobileOpen,
  setMobileOpen,
  currentStudent,
  scrollTo,
  onLogin,
  onDashboard,
  onAdmin,
  onLogout,
}: {
  logo: string;
  scrollProgress: number;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  currentStudent: LoggedInStudent | null;
  scrollTo: (id: string) => void;
  onLogin: () => void;
  onDashboard: () => void;
  onAdmin: () => void;
  onLogout: () => void;
}) {
  const activeSection = useActiveSection();
  const scrolled = scrollProgress > 2;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[90] h-[3px] bg-[#07111f]">
        <motion.div
          className="h-full origin-left rounded-r-full bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] shadow-[0_0_24px_rgba(242,184,75,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <motion.nav
        className={`fixed inset-x-0 top-[3px] z-[70] transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-[#07111f]/75 shadow-2xl shadow-black/30 backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        }`}
        initial={false}
        animate={{ paddingBlock: scrolled ? 0 : 4 }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => scrollTo("courses")}
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-[#18c29c]/20 ring-1 ring-white/15 transition-transform group-hover:scale-105">
              <img src={logo} alt="SkillVane logo" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-base font-bold tracking-tight">
              SkillVane{" "}
              <span className="bg-gradient-to-r from-[#18c29c] via-[#7cc7ff] to-[#f2b84b] bg-clip-text text-transparent">
                IT Academy
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activeSection === id
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {activeSection === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={onAdmin}
              className="flex items-center gap-2 rounded-xl border border-[#f2b84b]/25 px-3 py-2 text-sm font-semibold text-[#ffe4a3] transition-all hover:border-[#f2b84b]/50 hover:text-white"
            >
              <Lock className="h-4 w-4" />
              Admin
            </button>
            {currentStudent ? (
              <>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                <button
                  type="button"
                  onClick={onDashboard}
                  className="magnetic-button flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#18c29c]/25"
                >
                  <GraduationCap className="h-4 w-4" />
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onLogin}
                  className="flex items-center gap-2 rounded-xl border border-white/12 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-[#18c29c]/40 hover:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("courses")}
                  className="magnetic-button group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#18c29c]/25"
                >
                  View Courses
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-white/10 bg-[#0b1524]/95 px-4 py-4 backdrop-blur-xl md:hidden"
          >
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  scrollTo(id);
                  setMobileOpen(false);
                }}
                className="block w-full border-b border-white/5 py-3 text-left text-sm font-semibold text-slate-300 last:border-0"
              >
                {label}
              </button>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  onAdmin();
                  setMobileOpen(false);
                }}
                className="w-full rounded-xl border border-[#f2b84b]/25 py-3 text-sm font-semibold text-[#ffe4a3]"
              >
                Admin
              </button>
              {currentStudent ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onDashboard();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] py-3 text-sm font-bold text-white"
                  >
                    My Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-xl border border-white/12 py-3 text-sm font-semibold text-slate-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onLogin();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-xl border border-white/12 py-3 text-sm font-semibold"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      scrollTo("courses");
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] py-3 text-sm font-bold text-white"
                  >
                    View Courses
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
}
