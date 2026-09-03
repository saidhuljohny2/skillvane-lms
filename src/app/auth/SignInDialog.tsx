import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, X } from "lucide-react";
import { useAuth } from "@/app/auth/AuthProvider";

export function SignInDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await signInWithEmail(email);
      setStatus("sent");
    } catch (reason) {
      setStatus("idle");
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d1928] p-6 shadow-2xl shadow-black/50 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          aria-label="Close sign in"
        >
          <X className="size-5" />
        </button>

        {status === "sent" ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-12 text-emerald-400" />
            <h2 id="sign-in-title" className="mt-5 text-2xl font-bold text-white">
              Check your inbox
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              We sent a secure sign-in link to <strong className="text-white">{email}</strong>.
            </p>
          </div>
        ) : (
          <>
            <span className="eyebrow">Student portal</span>
            <h2 id="sign-in-title" className="mt-4 text-3xl font-bold text-white">
              Welcome back
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in without a password. We’ll email you a secure, one-time link.
            </p>
            <form onSubmit={handleSubmit} className="mt-7">
              <label htmlFor="sign-in-email" className="text-sm font-semibold text-slate-200">
                Email address
              </label>
              <input
                ref={inputRef}
                id="sign-in-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-400/60"
              />
              {error && (
                <p className="mt-3 text-sm text-rose-300" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="primary-button mt-5 w-full"
              >
                {status === "sending" ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                Email me a sign-in link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
