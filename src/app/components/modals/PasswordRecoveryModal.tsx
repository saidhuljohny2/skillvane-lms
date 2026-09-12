import { useState } from "react";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { completePasswordRecovery } from "@/app/lib/supabase";

export function PasswordRecoveryModal() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) { setMessage("Use at least 8 characters."); return; }
    if (password !== confirm) { setMessage("The passwords do not match."); return; }
    setLoading(true); setMessage("");
    try { await completePasswordRecovery(password); setComplete(true); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not update the password."); }
    finally { setLoading(false); }
  };

  return <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[#02060c]/95 p-4 backdrop-blur-lg">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1522] p-6 shadow-2xl">
      {complete ? <div className="text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-[#18c29c]" /><h2 className="mt-4 text-2xl font-black text-white">Password updated</h2><p className="mt-2 text-sm text-slate-400">You can now sign in to the admin console with your new password.</p><button onClick={() => window.location.assign("/")} className="mt-6 w-full rounded-xl bg-[#18c29c] py-3 font-black text-[#04110d]">Return to SkillVane</button></div> : <form onSubmit={submit} className="space-y-4">
        <div className="text-center"><KeyRound className="mx-auto h-11 w-11 text-[#18c29c]" /><h2 className="mt-4 text-2xl font-black text-white">Create a new password</h2><p className="mt-2 text-sm text-slate-400">Choose a strong password for your SkillVane account.</p></div>
        <input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none focus:border-[#18c29c]/50" />
        <input type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none focus:border-[#18c29c]/50" />
        {message && <p className="text-sm text-red-300">{message}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18c29c] py-3 font-black text-[#04110d] disabled:opacity-50">{loading && <Loader2 className="h-4 w-4 animate-spin" />} Update password</button>
      </form>}
    </div>
  </div>;
}
