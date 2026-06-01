import { useState } from "react";
import { Cloud, Eye, EyeOff, LogIn, AlertCircle, BookOpen } from "lucide-react";

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials
  avatarColor: string;
  enrolledCourseIds: string[];
  joinedDate: string;
}

// ─── Mock student database ─────────────────────────────────────────────────
// Replace with real Supabase/backend auth in production
export const MOCK_STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Arjun Sharma",
    email: "arjun@example.com",
    avatar: "AS",
    avatarColor: "from-blue-500 to-indigo-600",
    enrolledCourseIds: ["gcp-live", "python-de"],
    joinedDate: "March 2025",
  },
  {
    id: "s2",
    name: "Priya Nair",
    email: "priya@example.com",
    avatar: "PN",
    avatarColor: "from-violet-500 to-purple-600",
    enrolledCourseIds: ["gcp-recordings", "project-healthcare", "project-retail"],
    joinedDate: "January 2025",
  },
  {
    id: "s3",
    name: "Rahul Verma",
    email: "rahul@example.com",
    avatar: "RV",
    avatarColor: "from-cyan-500 to-blue-600",
    enrolledCourseIds: ["gcp-live", "gcp-recordings", "python-de", "project-healthcare", "project-retail"],
    joinedDate: "November 2024",
  },
];

// Password for all demo accounts (replace with real hashed passwords)
const MOCK_PASSWORD = "student123";

export function authenticateStudent(email: string, password: string): Student | null {
  if (password !== MOCK_PASSWORD) return null;
  return MOCK_STUDENTS.find((s) => s.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export default function LoginPage({
  onLogin,
  onBack,
}: {
  onLogin: (student: Student) => void;
  onBack: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const student = authenticateStudent(email, password);
      if (student) {
        onLogin(student);
      } else {
        setError("Invalid email or password. Check the demo credentials below.");
      }
      setLoading(false);
    }, 700);
  }

  function fillDemo(email: string) {
    setEmail(email);
    setPassword(MOCK_PASSWORD);
    setError("");
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Top bar */}
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#4361ee] flex items-center justify-center shadow-md shadow-[#4361ee]/30">
              <Cloud className="w-3.5 h-3.5 text-white" />
            </div>
            <span
              className="font-bold text-sm tracking-tight"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              SkillVane <span className="text-[#4361ee]">IT Academy</span>
            </span>
          </button>
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Browse Courses
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#4361ee]/25"
              style={{ background: "linear-gradient(135deg, #4361ee 0%, #3bc9db 100%)" }}
            >
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-foreground mb-1.5"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
              Student Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Access your enrolled courses and recordings
            </p>
          </div>

          {/* Login card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/40 focus:border-[#4361ee]/60 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/40 focus:border-[#4361ee]/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 shadow-lg shadow-[#4361ee]/25"
                style={{ background: "linear-gradient(135deg, #4361ee 0%, #3bc9db 100%)" }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {loading ? "Signing in…" : "Sign In to My Courses"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">Demo Accounts</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Demo credentials */}
            <div className="space-y-2">
              {MOCK_STUDENTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => fillDemo(s.email)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border border-border hover:border-[#4361ee]/40 hover:bg-[#4361ee]/5 transition-all text-left group"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{s.email}</p>
                  </div>
                  <span className="text-[10px] text-[#4361ee] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    Use →
                  </span>
                </button>
              ))}
              <p className="text-center text-[11px] text-muted-foreground pt-1">
                Password for all accounts: <span className="font-mono text-foreground/60">student123</span>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Not enrolled yet?{" "}
            <button onClick={onBack} className="text-[#4361ee] hover:underline font-semibold">
              Browse courses →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
