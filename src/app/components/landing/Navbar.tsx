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
      <div className="fixed inset-x-0 top-0 z-[90] h-0.5 bg-[#060d17]">
        <motion.div
          className="h-full origin-left rounded-r-full bg-gradient-to-r from-[#2dd4a6] via-[#76b4ff] to-[#eab96e]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <motion.nav
        className={`fixed inset-x-0 top-0.5 z-[70] transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.08] bg-[#060d17]/90 shadow-[0_16px_45px_rgba(0,0,0,0.24)] backdrop-blur-xl"
            : "border-b border-transparent bg-[#060d17]/25 backdrop-blur-sm"
        }`}
        initial={false}
        animate={{ paddingBlock: scrolled ? 0 : 3 }}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => scrollTo("courses")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[0.7rem] bg-white p-0.5 shadow-lg shadow-black/20 ring-1 ring-white/15 transition-transform group-hover:-rotate-2">
              <img src={logo} alt="SkillVane logo" className="h-9 w-9 object-contain" />
            </div>
            <span className="text-[0.95rem] font-black tracking-[-0.02em] text-white">
              SkillVane
              <span className="ml-1.5 text-xs font-semibold tracking-normal text-slate-400">
                IT Academy
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1 md:flex">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={`relative rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  activeSection === id
                    ? "text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {activeSection === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-white/[0.08]"
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
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-all hover:bg-white/[0.04] hover:text-[#eab96e]"
            >
              <Lock className="h-4 w-4" />
              Admin
            </button>
            {currentStudent ? (
              <>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.09] px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.04] hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                <button
                  type="button"
                  onClick={onDashboard}
                  className="magnetic-button flex items-center gap-2 rounded-lg bg-[#2dd4a6] px-5 py-2.5 text-sm font-black text-[#04110d] shadow-lg shadow-[#2dd4a6]/10 hover:bg-[#55dfb9]"
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
                  className="flex items-center gap-2 rounded-lg border border-white/[0.09] px-4 py-2 text-sm font-semibold text-slate-300 hover:border-[#2dd4a6]/30 hover:bg-white/[0.03] hover:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("courses")}
                  className="magnetic-button group flex items-center gap-2 rounded-lg bg-[#2dd4a6] px-5 py-2.5 text-sm font-black text-[#04110d] shadow-lg shadow-[#2dd4a6]/10 hover:bg-[#55dfb9]"
                >
                  View Courses
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-slate-300 md:hidden"
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
            className="border-t border-white/[0.08] bg-[#08121f]/98 px-4 py-4 shadow-2xl backdrop-blur-xl md:hidden"
          >
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  scrollTo(id);
                  setMobileOpen(false);
                }}
                className={`block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold ${
                  activeSection === id ? "bg-white/[0.06] text-white" : "text-slate-400"
                }`}
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
