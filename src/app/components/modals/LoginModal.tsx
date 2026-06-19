import { useState } from "react";
import { LogIn, Lock, Mail, User, X, Eye, EyeOff } from "lucide-react";
import { OTP_VALIDITY_MS } from "@/app/config";
import { generateOtp } from "@/app/lib/format";
import { getEmailJsErrorMessage, sendOtpEmail } from "@/app/lib/services";
import { STORAGE_KEYS } from "@/app/lib/storage";
import type { LoggedInStudent, StoredStudent } from "@/app/types";

export function LoginModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (student: LoggedInStudent) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [otpState, setOtpState] = useState<{
    email: string;
    code: string;
    expiresAt: number;
    verified: boolean;
  } | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (
      !form.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    )
      e.email = "Valid email is required";
    if (mode !== "reset" || otpState?.verified) {
      if (!form.password || form.password.length < 6)
        e.password = "Password must be at least 6 characters";
    }
    if (mode === "signup") {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone))
        e.phone = "Valid 10-digit mobile number required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const loadStudents = (): Record<string, StoredStudent> => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.students) || "{}");
    } catch {
      return {};
    }
  };

  const sendStudentResetOtp = async () => {
    const email = form.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Valid email is required" });
      return;
    }

    const students = loadStudents();
    const student = students[email];
    if (!student) {
      setErrors({ email: "No student found with this email." });
      return;
    }

    setLoading(true);
    try {
      const code = generateOtp();
      await sendOtpEmail(
        email,
        student.name || "Student",
        code,
        "password reset",
      );
      setOtpState({
        email,
        code,
        expiresAt: Date.now() + OTP_VALIDITY_MS,
        verified: false,
      });
      setOtpInput("");
      setErrors({
        general: "OTP sent to your registered email. Please check your inbox.",
      });
    } catch (error) {
      console.error("Student OTP email failed:", error);
      setErrors({
        general: `Unable to send OTP: ${getEmailJsErrorMessage(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyStudentOtp = () => {
    if (!otpState) return;
    if (Date.now() > otpState.expiresAt) {
      setErrors({ general: "OTP expired. Please send a new OTP." });
      setOtpState(null);
      return;
    }
    if (otpInput.trim() !== otpState.code) {
      setErrors({ general: "Invalid OTP. Please check your email." });
      return;
    }
    setOtpState({ ...otpState, verified: true });
    setErrors({ general: "OTP verified. Set your new password." });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get existing students from localStorage
      const students = loadStudents();

      if (mode === "reset") {
        if (!otpState?.verified) {
          setErrors({ general: "Please verify the OTP before resetting." });
          setLoading(false);
          return;
        }

        const student = students[otpState.email];
        if (!student) {
          setErrors({ email: "No student found with this email." });
          setLoading(false);
          return;
        }

        students[otpState.email] = {
          ...student,
          password: form.password,
        };
        localStorage.setItem(
          STORAGE_KEYS.students,
          JSON.stringify(students),
        );
        setErrors({
          general:
            "Password reset successful. You can login with the new password.",
        });
        setMode("login");
        setForm({ ...form, password: "" });
        setOtpState(null);
        setOtpInput("");
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        // Check if user already exists
        const email = form.email.trim().toLowerCase();
        if (students[email]) {
          setErrors({
            email: "Email already registered. Please login.",
          });
          setLoading(false);
          return;
        }

        // Create new student account
        students[email] = {
          email,
          name: form.name,
          phone: form.phone,
          password: form.password, // In production, hash this!
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          STORAGE_KEYS.students,
          JSON.stringify(students),
        );

        // Auto-login after signup
        const loggedStudent: LoggedInStudent = {
          email,
          name: form.name,
          enrolledCourses: [],
        };
        localStorage.setItem(
          STORAGE_KEYS.currentStudent,
          JSON.stringify(loggedStudent),
        );
        onLogin(loggedStudent);
      } else {
        // Login
        const email = form.email.trim().toLowerCase();
        const student = students[email];
        if (!student || student.password !== form.password) {
          setErrors({ password: "Invalid email or password" });
          setLoading(false);
          return;
        }

        const loggedStudent: LoggedInStudent = {
          email: student.email,
          name: student.name,
          enrolledCourses: student.enrolledCourses || [],
        };
        localStorage.setItem(
          STORAGE_KEYS.currentStudent,
          JSON.stringify(loggedStudent),
        );
        onLogin(loggedStudent);
      }
    } catch (error) {
      setErrors({
        general: "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="sv-modal-root">
      <div className="sv-modal-backdrop" onClick={onClose} />
      <div className="sv-modal sv-modal-md max-h-[92dvh] overflow-hidden">
        <div className="sv-modal-header">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#18c29c] to-[#2f80ed] flex items-center justify-center shadow-lg shadow-[#18c29c]/20">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
            <h2
              className="font-black text-white text-xl"
              style={{
                fontFamily:
                  "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              {mode === "login"
                ? "Welcome Back"
                : mode === "signup"
                  ? "Create Account"
                  : "Reset Password"}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === "login"
                ? "Login to access your courses"
                : mode === "signup"
                  ? "Sign up to get started"
                  : "Verify OTP sent to your email"}
            </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="sv-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sv-modal-body space-y-4 overflow-y-auto">
          {errors.general && (
            <div
              className={`p-3 rounded-lg border text-sm ${
                /sent|verified|successful/i.test(errors.general)
                  ? "bg-[#18c29c]/10 border-[#18c29c]/30 text-[#9cf8dd]"
                  : "bg-red-500/10 border-red-500/30 text-red-300"
              }`}
            >
              {errors.general}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
              />
              {errors.name && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value.toLowerCase() })
              }
              placeholder="your.email@example.com"
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
            />
            {errors.email && (
              <p className="text-xs text-red-300 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="10-digit mobile number"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
              />
              {errors.phone && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
          )}

          {mode === "reset" && (
            <div className="grid gap-3">
              <button
                type="button"
                onClick={sendStudentResetOtp}
                disabled={loading}
                className="rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 px-4 py-3 text-sm font-black text-[#ffe4a3] transition-colors hover:bg-[#f2b84b]/16 disabled:opacity-50"
              >
                {otpState ? "Resend OTP" : "Send OTP to Email"}
              </button>

              {otpState && !otpState.verified && (
                <div className="grid gap-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Email OTP
                  </label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      inputMode="numeric"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
                    />
                    <button
                      type="button"
                      onClick={verifyStudentOtp}
                      className="rounded-xl bg-white/[0.08] px-4 py-3 text-sm font-black text-white hover:bg-white/[0.12]"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {(mode !== "reset" || otpState?.verified) && (
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              {mode === "reset" ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder={
                mode === "login"
                  ? "Enter your password"
                  : "Create a password (min 6 chars)"
              }
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#18c29c]/60 transition-all"
            />
            {errors.password && (
              <p className="text-xs text-red-300 mt-1">
                {errors.password}
              </p>
            )}
          </div>
          )}

          <button
            type="submit"
            disabled={loading || (mode === "reset" && !otpState?.verified)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white font-black text-sm hover:shadow-xl hover:shadow-[#18c29c]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : mode === "signup"
                  ? "Sign Up"
                  : "Save New Password"}
          </button>

          <div className="flex flex-col items-center gap-2 text-center">
            {mode === "login" && (
              <button
                type="button"
                onClick={() => {
                  setMode("reset");
                  setErrors({});
                  setForm({ ...form, password: "" });
                  setOtpState(null);
                  setOtpInput("");
                }}
                className="text-sm font-bold text-[#8df5d7] hover:text-white transition-colors"
              >
                Forgot password? Reset with email OTP
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
                setOtpState(null);
                setOtpInput("");
              }}
              className="text-sm text-slate-400 hover:text-[#8df5d7] transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : mode === "signup"
                  ? "Already have an account? Login"
                  : "Back to login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
