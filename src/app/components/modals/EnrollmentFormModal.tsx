import { useState, useRef, useEffect } from "react";
import { Lock, Mail, Phone, User, X } from "lucide-react";
import { formatINR } from "@/app/lib/format";
import type { Course, StudentDetails } from "@/app/types";

export function EnrollmentFormModal({
  course,
  onClose,
  onSubmit,
}: {
  course: Course;
  onClose: () => void;
  onSubmit: (student: StudentDetails) => void;
}) {
  const [form, setForm] = useState<StudentDetails>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<StudentDetails>>(
    {},
  );
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const validate = () => {
    const e: Partial<StudentDetails> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Valid 10-digit mobile number required";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <div className="sv-modal-root">
      <div className="sv-modal-backdrop" onClick={onClose} />
      <div className="sv-modal sv-modal-md max-h-[92dvh] overflow-hidden">
        <div
          className="sv-modal-header"
          style={{
            background: `linear-gradient(135deg, ${course.accentFrom}18, transparent)`,
          }}
        >
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest mb-0.5"
              style={{ color: course.accentFrom }}
            >
              Step 1 of 2 - Your Details
            </p>
            <h2
              className="font-black text-white text-base"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              {course.title}
            </h2>
            <p className="text-xs text-white/40">
              {course.subtitle} · {formatINR(course.price)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="sv-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sv-modal-body space-y-4 overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                ref={nameRef}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#0abab5]/60 focus:bg-white/[0.08] transition-all"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Email Address *{" "}
              <span className="text-white/30 font-normal">
                (invoice will be sent here)
              </span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#0abab5]/60 focus:bg-white/[0.08] transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Mobile Number *{" "}
              <span className="text-white/30 font-normal">
                (10 digits, Indian)
              </span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <div className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-white/40 border-r border-white/10 pr-2.5">
                +91
              </div>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10),
                  })
                }
                placeholder="9876543210"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-20 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#0abab5]/60 focus:bg-white/[0.08] transition-all"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-400 mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Create Login Password *{" "}
              <span className="text-white/30 font-normal">
                (minimum 6 characters)
              </span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Create a password"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#0abab5]/60 focus:bg-white/[0.08] transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <p className="text-xs text-white/30 leading-relaxed">
            Your details are used only for sending your course
            access, invoice, and student login. We do not share your
            information.
          </p>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
              boxShadow: `0 8px 24px ${course.accentFrom}40`,
            }}
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
}
