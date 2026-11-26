import { useState } from "react";
import { completePasswordRecovery, MIN_PASSWORD_LENGTH, type AuthCallback } from "@/app/lib/supabase";

export function PasswordRecoveryModal({ callback }: { callback: AuthCallback }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(callback.error);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [destination, setDestination] = useState(callback.destination);
  const confirmed = callback.kind === "signup" && !callback.error;
  const field = "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none focus:border-blue-400";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) { setMessage("Use at least 8 characters."); return; }
    if (password !== confirm) { setMessage("The passwords do not match."); return; }
    setLoading(true); setMessage("");
    try {
      setDestination(await completePasswordRecovery(password, callback.accessToken));
      setPassword(""); setConfirm(""); setComplete(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update the password. Request a fresh email link and try again."); }
    finally { setLoading(false); }
  };

  return <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[#02060c]/95 p-4 backdrop-blur-lg">
    <div role="dialog" aria-modal="true" aria-labelledby="auth-link-title" className="max-h-[95dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1522] p-6 shadow-2xl">
      <h2 id="auth-link-title" className="text-2xl font-black text-white">{complete ? "Password updated" : callback.error ? "Email link expired or invalid" : confirmed ? "Email confirmed" : callback.kind === "invite" ? "Welcome to SkillVane" : "Create a new password"}</h2>
      {complete || confirmed ? <p className="mt-3 text-sm text-slate-300">{confirmed ? "Your email is confirmed. Sign in to continue." : "Your password has been saved. Sign in with your new password."}</p> : callback.error ? <p className="mt-3 text-sm text-slate-300">{callback.kind === "invite" ? "Ask your administrator to send a new invitation." : "Return to login and use Forgot password to request a new link. For email confirmation, use Resend email confirmation on the login screen."}</p> : <form onSubmit={submit} className="mt-5 space-y-4">
        <p className="text-sm text-slate-400">{callback.kind === "invite" ? "Set a password to finish creating your account." : "Choose a new password for your account."}</p>
        <label className="block text-sm text-slate-200">New password<input type="password" autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH} value={password} onChange={(e) => setPassword(e.target.value)} className={field} /></label>
        <p className="text-xs text-slate-400">Use at least 8 characters.</p>
        <label className="block text-sm text-slate-200">Confirm new password<input type="password" autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} /></label>
        <button disabled={loading} className="w-full rounded-xl bg-[#3b82f6] py-3 font-black text-white disabled:opacity-50">{loading ? "Saving…" : "Save password"}</button>
      </form>}
      {message && <p role="alert" className="mt-3 text-sm text-red-300">{message}</p>}
      <a href={`/?login=${destination}`} className="mt-5 block text-center font-bold text-blue-300">{destination === "admin" ? "Go to admin login" : "Go to student login"}</a>
    </div>
  </div>;
}
