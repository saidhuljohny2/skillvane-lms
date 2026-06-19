import { ThemeToggle } from "@/app/components/theme/ThemeToggle";
import {
  GraduationCap,
  Lock,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import type { LoggedInStudent } from "@/app/types";

const NAV_LINKS = [
  { id: "courses", label: "Courses" },
  { id: "instructor", label: "Instructor" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "FAQ" },
] as const;

type NavbarProps = {
  logoSrc: string;
  activeSection: string;
  mobileOpen: boolean;
  currentStudent: LoggedInStudent | null;
  onToggleMobile: () => void;
  onScrollTo: (id: string) => void;
  onLogin: () => void;
  onAdmin: () => void;
  onDashboard: () => void;
};

export function Navbar({
  logoSrc,
  activeSection,
  mobileOpen,
  currentStudent,
  onToggleMobile,
  onScrollTo,
  onLogin,
  onAdmin,
  onDashboard,
}: NavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-1 z-[70] border-b border-border bg-background/95 backdrop-blur-md">
      <div className="sv-page flex h-14 items-center justify-between gap-3 sm:h-16">
        <button
          type="button"
          onClick={() => onScrollTo("courses")}
          className="flex min-w-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:h-10 sm:w-10">
            <img src={logoSrc} alt="SkillVane" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
          </div>
          <span className="truncate text-sm font-bold text-foreground sm:text-base">
            SkillVane{" "}
            <span className="hidden text-primary sm:inline">IT Academy</span>
          </span>
        </button>

        <div className="hidden items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5 lg:flex">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onScrollTo(id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeSection === id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 md:flex">
            <button type="button" onClick={onAdmin} className="sv-btn-ghost !px-3 !py-2 text-xs">
              <Lock className="h-3.5 w-3.5" />
              Admin
            </button>
            {currentStudent ? (
              <button type="button" onClick={onDashboard} className="sv-btn-primary !px-4 !py-2 text-xs">
                <GraduationCap className="h-3.5 w-3.5" />
                Dashboard
              </button>
            ) : (
              <>
                <button type="button" onClick={onLogin} className="sv-btn-ghost !px-3 !py-2 text-xs">
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </button>
                <button type="button" onClick={() => onScrollTo("courses")} className="sv-btn-primary !px-4 !py-2 text-xs">
                  Enroll
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            className="rounded-lg border border-border p-2 text-muted-foreground lg:hidden"
            onClick={onToggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onScrollTo(id)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium ${
                  activeSection === id
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={onAdmin} className="sv-btn-ghost w-full text-xs">
              Admin
            </button>
            {currentStudent ? (
              <button type="button" onClick={onDashboard} className="sv-btn-primary w-full text-xs">
                Dashboard
              </button>
            ) : (
              <>
                <button type="button" onClick={onLogin} className="sv-btn-ghost w-full text-xs">
                  Login
                </button>
                <button type="button" onClick={() => onScrollTo("courses")} className="sv-btn-primary w-full text-xs">
                  Enroll
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
