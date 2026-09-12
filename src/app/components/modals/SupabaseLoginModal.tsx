import { useState } from "react";
import { Lock, X } from "lucide-react";
import {
  isSupabaseConfigured,
  sendPasswordReset,
  signInStudent,
  signUpStudent,
  type AuthenticatedStudent,
} from "@/app/lib/supabase";

type Mode = "login" | "signup" | "reset";

export function SupabaseLoginModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (student: AuthenticatedStudent) => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeMode = (next: Mode) => {
    setMode(next);
    setMessage("");
    setIsError(false);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    setMessage("");
    setIsError(false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Enter a valid email address.");
      setIsError(true);
      return;
    }
    if (mode !== "reset" && form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setIsError(true);
      return;
    }
    if (mode === "signup" && (!form.name.trim() || !/^[6-9]\d{9}$/.test(form.phone))) {
      setMessage("Enter your full name and a valid 10-digit mobile number.");
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      if (mode === "reset") {
        await sendPasswordReset(email);
        setMessage("Password reset link sent. Check your email.");
        return;
      }
      if (mode === "signup") {
        const result = await signUpStudent(email, form.password, form.name.trim(), form.phone);
        if (!result.session) {
          setMessage("Account created. Confirm your email, then sign in.");
          return;
        }
      }
      const student = await signInStudent(email, form.password);
      onLogin(student);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unable to continue.";
      setMessage(detail.replace(/invalid login credentials/i, "Email or password is incorrect."));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button aria-label="Close login" className="absolute inset-0 bg-[#02060c]/86 backdrop-blur-lg" onClick={onClose} />
      <div className="relative w-full overflow-hidden rounded-t-2xl border border-white/[0.09] bg-[#0a1522] shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:max-w-md sm:rounded-[1.5rem]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(45,212,166,0.1),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(234,185,110,0.055),transparent_36%)]" />
        <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3b82f6]"><Lock className="h-5 w-5 text-[#ffffff]" /></div>
            <div>
              <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === "login" ? "Secure student access" : mode === "signup" ? "Start your learning account" : "Receive a secure reset link"}
              </p>
            </div>
          </div>
          <button aria-label="Close" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={submit} className="relative space-y-4 px-5 py-5">
          {!isSupabaseConfigured && (
            <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">Student login is temporarily being configured.</div>
          )}
          {message && (
            <div className={`rounded-lg border p-3 text-sm ${isError ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#bfdbfe]"}`}>{message}</div>
          )}
          {mode === "signup" && (
            <label className="block text-sm font-semibold text-slate-200">Full Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" className="mt-1.5 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#3b82f6]/40 focus:outline-none" />
            </label>
          )}
          <label className="block text-sm font-semibold text-slate-200">Email
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your.email@example.com" className="mt-1.5 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#3b82f6]/40 focus:outline-none" />
          </label>
          {mode === "signup" && (
            <label className="block text-sm font-semibold text-slate-200">Phone
              <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile number" className="mt-1.5 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#3b82f6]/40 focus:outline-none" />
            </label>
          )}
          {mode !== "reset" && (
            <label className="block text-sm font-semibold text-slate-200">Password
              <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" className="mt-1.5 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#3b82f6]/40 focus:outline-none" />
            </label>
          )}
          <button type="submit" disabled={loading || !isSupabaseConfigured} className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2f80ed] py-3 text-sm font-black text-white transition-all hover:shadow-xl hover:shadow-[#3b82f6]/20 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center text-sm">
            {mode !== "login" && <button type="button" onClick={() => changeMode("login")} className="text-slate-400 hover:text-[#93c5fd]">Back to login</button>}
            {mode === "login" && <button type="button" onClick={() => changeMode("signup")} className="text-slate-400 hover:text-[#93c5fd]">Create an account</button>}
            {mode === "login" && <button type="button" onClick={() => changeMode("reset")} className="text-slate-400 hover:text-[#93c5fd]">Forgot password?</button>}
          </div>
          <p className="text-center text-[11px] text-slate-500">Authentication protected by Supabase.</p>
        </form>
      </div>
    </div>
  );
}
