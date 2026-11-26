import { useState } from "react";
import { sendPasswordReset } from "@/app/lib/supabase";

export function AccountSecurity({ email, destination = "student" }: { email: string; destination?: "student" | "admin" }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const changePassword = async () => {
    setBusy(true); setMessage("");
    try {
      await sendPasswordReset(email, destination);
      setMessage("Check your email for a secure link to choose a new password. Check spam if it does not arrive.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not send the reset email. Try again."); }
    finally { setBusy(false); }
  };
  return <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
    <h4 className="font-black text-white">Account security</h4>
    <p className="mt-2 text-sm text-slate-400">Change your password using a secure link sent to {email}.</p>
    <button type="button" disabled={busy} onClick={() => void changePassword()} className="mt-3 rounded-xl bg-[#3b82f6] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Sending…" : "Change password"}</button>
    {message && <p role="status" className="mt-3 text-sm text-blue-200">{message}</p>}
  </section>;
}
