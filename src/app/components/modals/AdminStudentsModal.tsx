import { useMemo, useState } from "react";
import {
  Award,
  Download,
  GraduationCap,
  Lock,
  Search,
  Shield,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CertificatePreview } from "@/app/components/certificate/CertificatePreview";
import { openCertificatePrintWindow } from "@/app/lib/certificate";
import skillVaneLogo from "@/imports/logo1.png";

const ADMIN_EMAIL = "saidhuljohny@gmail.com";
const ADMIN_DEFAULT_PASSWORD = "SkillVane@1711";
const OTP_VALIDITY_MS = 10 * 60 * 1000;

interface Course {
  id: string;
  title: string;
}

interface StoredStudent {
  email: string;
  name: string;
  phone?: string;
  password: string;
  enrolledCourses: string[];
  createdAt?: string;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getAdminPassword() {
  return localStorage.getItem("skillvane_admin_password") || ADMIN_DEFAULT_PASSWORD;
}

async function loadEmailJs(): Promise<void> {
  if ((window as any).emailjs) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("EmailJS not loaded"));
    document.body.appendChild(s);
  });
}

async function sendOtpEmail(toEmail: string, toName: string, otp: string, purpose: string) {
  const EMAILJS_SERVICE_ID = "service_huss9yj";
  const EMAILJS_PASSWORD_OTP_TEMPLATE_ID = "template_fx61y3u";
  const EMAILJS_PUBLIC_KEY = "xC4HlrScSivWvpXtz";
  await loadEmailJs();
  const ejs = (window as any).emailjs;
  ejs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_PASSWORD_OTP_TEMPLATE_ID, {
    to_name: toName,
    to_email: toEmail,
    email: toEmail,
    otp,
    purpose,
    academy_name: "SkillVane IT Academy",
  });
}

type AdminTab = "certificates" | "students";

export function AdminStudentsModal({
  courses,
  onClose,
}: {
  courses: Course[];
  onClose: () => void;
}) {
  const [adminMode, setAdminMode] = useState<"login" | "forgot">("login");
  const [adminLogin, setAdminLogin] = useState({ email: "", password: "" });
  const [adminOtp, setAdminOtp] = useState<{
    code: string;
    expiresAt: number;
    verified: boolean;
  } | null>(null);
  const [adminOtpInput, setAdminOtpInput] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<AdminTab>("students");
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Record<string, StoredStudent>>(() => {
    try {
      return JSON.parse(localStorage.getItem("skillvane_students") || "{}");
    } catch {
      return {};
    }
  });
  const [form, setForm] = useState<StoredStudent>({
    email: "",
    name: "",
    phone: "",
    password: "",
    enrolledCourses: [],
  });
  const [certificate, setCertificate] = useState({
    studentName: "",
    completionDate: new Date().toISOString().slice(0, 10),
  });

  const studentList = useMemo(
    () =>
      Object.values(students)
        .filter(
          (s) =>
            !search.trim() ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => a.email.localeCompare(b.email)),
    [students, search],
  );

  const totalEnrollments = useMemo(
    () =>
      Object.values(students).reduce(
        (n, s) => n + (s.enrolledCourses?.length || 0),
        0,
      ),
    [students],
  );

  const persistStudents = (next: Record<string, StoredStudent>) => {
    setStudents(next);
    localStorage.setItem("skillvane_students", JSON.stringify(next));
  };

  const resetForm = () =>
    setForm({ email: "", name: "", phone: "", password: "", enrolledCourses: [] });

  const saveStudent = () => {
    const email = form.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Enter a valid student email.");
      return;
    }
    if (!form.name.trim()) {
      setMessage("Student name is required.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    persistStudents({
      ...students,
      [email]: {
        ...students[email],
        email,
        name: form.name.trim(),
        phone: form.phone?.trim() || "",
        password: form.password,
        enrolledCourses: form.enrolledCourses || [],
        createdAt: students[email]?.createdAt || new Date().toISOString(),
      },
    });
    setMessage("Student saved successfully.");
    resetForm();
  };

  const openAdminConsole = () => {
    const email = adminLogin.email.trim().toLowerCase();
    if (email !== ADMIN_EMAIL || adminLogin.password !== getAdminPassword()) {
      setMessage("Invalid admin email or password.");
      return;
    }
    setUnlocked(true);
    setMessage("");
  };

  const handlePrintCertificate = () => {
    if (!certificate.studentName.trim() || !certificate.completionDate) {
      setMessage("Enter student name and completion date.");
      return;
    }
    const ok = openCertificatePrintWindow({
      studentName: certificate.studentName,
      completionDate: certificate.completionDate,
      logoUrl: skillVaneLogo,
    });
    setMessage(
      ok
        ? "Certificate opened — use Save as PDF in the print dialog."
        : "Allow popups to generate the certificate.",
    );
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/50 focus:outline-none focus:ring-2 focus:ring-[#18c29c]/20";

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-[#020817]/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/12 bg-[#07111f] shadow-2xl sm:max-h-[92dvh] sm:max-w-6xl sm:rounded-3xl"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(24,194,156,0.12),transparent_40%),radial-gradient(ellipse_at_100%_0%,rgba(242,184,75,0.08),transparent_35%)]" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2b84b] to-[#fff0a8] shadow-lg shadow-[#f2b84b]/20">
              <Shield className="h-5 w-5 text-[#1b1202]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f2b84b]">
                Admin Control
              </p>
              <h2 className="text-lg font-black text-white sm:text-xl">
                SkillVane Dashboard
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!unlocked ? (
          <div className="relative space-y-4 px-5 py-6 sm:max-w-md sm:mx-auto sm:w-full sm:py-8">
            <div className="mb-2 text-center">
              <Lock className="mx-auto mb-3 h-10 w-10 text-[#18c29c]" />
              <p className="text-sm text-slate-300">
                Secure access for student management and certificates.
              </p>
            </div>
            <input
              type="email"
              value={adminLogin.email}
              onChange={(e) =>
                setAdminLogin({ ...adminLogin, email: e.target.value.toLowerCase() })
              }
              placeholder="Admin Gmail"
              className={inputCls}
            />
            {adminMode === "login" ? (
              <>
                <input
                  type="password"
                  value={adminLogin.password}
                  onChange={(e) =>
                    setAdminLogin({ ...adminLogin, password: e.target.value })
                  }
                  placeholder="Password"
                  className={inputCls}
                />
                {message && <p className="text-sm text-red-300">{message}</p>}
                <button
                  type="button"
                  onClick={openAdminConsole}
                  className="w-full rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] py-3.5 text-sm font-black text-white shadow-lg shadow-[#18c29c]/20"
                >
                  Unlock Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminMode("forgot");
                    setMessage("");
                  }}
                  className="w-full text-sm font-semibold text-[#8df5d7] hover:text-white"
                >
                  Forgot password? Reset with OTP
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    if (adminLogin.email.trim().toLowerCase() !== ADMIN_EMAIL) {
                      setMessage("Enter the registered admin Gmail.");
                      return;
                    }
                    try {
                      const code = generateOtp();
                      await sendOtpEmail(ADMIN_EMAIL, "Admin", code, "admin password reset");
                      setAdminOtp({
                        code,
                        expiresAt: Date.now() + OTP_VALIDITY_MS,
                        verified: false,
                      });
                      setMessage("OTP sent to admin Gmail.");
                    } catch {
                      setMessage("Could not send OTP.");
                    }
                  }}
                  className="w-full rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 py-3 text-sm font-black text-[#ffe4a3]"
                >
                  Send OTP
                </button>
                {adminOtp && (
                  <>
                    <input
                      value={adminOtpInput}
                      onChange={(e) => setAdminOtpInput(e.target.value)}
                      placeholder="Enter OTP"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!adminOtp || Date.now() > adminOtp.expiresAt) {
                          setMessage("OTP expired.");
                          return;
                        }
                        if (adminOtpInput.trim() !== adminOtp.code) {
                          setMessage("Invalid OTP.");
                          return;
                        }
                        setAdminOtp({ ...adminOtp, verified: true });
                        setMessage("OTP verified. Set new password.");
                      }}
                      className="w-full rounded-xl border border-[#18c29c]/30 py-3 text-sm font-bold text-[#9cf8dd]"
                    >
                      Verify OTP
                    </button>
                  </>
                )}
                {adminOtp?.verified && (
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="New admin password"
                    className={inputCls}
                  />
                )}
                {adminOtp?.verified && (
                  <button
                    type="button"
                    onClick={() => {
                      if (newAdminPassword.length < 6) {
                        setMessage("Password must be at least 6 characters.");
                        return;
                      }
                      localStorage.setItem("skillvane_admin_password", newAdminPassword);
                      setAdminMode("login");
                      setMessage("Password updated. Login again.");
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#f59e0b] py-3 text-sm font-black text-[#1b1202]"
                  >
                    Save New Password
                  </button>
                )}
                {message && <p className="text-sm text-[#ffe4a3]">{message}</p>}
                <button
                  type="button"
                  onClick={() => setAdminMode("login")}
                  className="w-full text-sm text-slate-400 hover:text-white"
                >
                  Back to login
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="border-b border-white/10 p-4 lg:w-56 lg:border-b-0 lg:border-r lg:p-5">
              <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
                {[
                  { label: "Students", val: studentList.length, icon: Users },
                  { label: "Enrollments", val: totalEnrollments, icon: GraduationCap },
                ].map(({ label, val, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    <Icon className="mb-2 h-4 w-4 text-[#18c29c]" />
                    <div className="text-2xl font-black text-white">{val}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <nav className="flex gap-2 lg:flex-col">
                {(
                  [
                    { id: "students" as const, label: "Manage Students", icon: Users },
                    { id: "certificates" as const, label: "Certificates", icon: Award },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex flex-1 items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all lg:flex-none ${
                      tab === id
                        ? "bg-gradient-to-r from-[#18c29c]/20 to-[#2f80ed]/15 text-white ring-1 ring-[#18c29c]/30"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 lms-dashboard-scroll">
              {message && (
                <p className="mb-4 rounded-xl border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-4 py-2.5 text-sm text-[#ffe4a3]">
                  {message}
                </p>
              )}

              <AnimatePresence mode="wait">
                {tab === "certificates" ? (
                  <motion.div
                    key="cert"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-black text-white">
                          Completion Certificate
                        </h3>
                        <p className="text-sm text-slate-400">
                          Generate official GCP Data Engineering certificates with wax seal.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handlePrintCertificate}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#f59e0b] px-5 py-3 text-sm font-black text-[#1b1202] shadow-lg"
                      >
                        <Download className="h-4 w-4" />
                        Generate PDF
                      </button>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
                      <div className="space-y-3">
                        <input
                          value={certificate.studentName}
                          onChange={(e) =>
                            setCertificate({ ...certificate, studentName: e.target.value })
                          }
                          placeholder="Student full name"
                          className={inputCls}
                        />
                        <input
                          type="date"
                          value={certificate.completionDate}
                          onChange={(e) =>
                            setCertificate({ ...certificate, completionDate: e.target.value })
                          }
                          className={inputCls}
                        />
                        <p className="text-xs leading-relaxed text-slate-500">
                          Name appears exactly as entered. Print dialog → Save as PDF.
                        </p>
                      </div>
                      <CertificatePreview
                        studentName={certificate.studentName}
                        completionDate={certificate.completionDate}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="students"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="grid gap-4 xl:grid-cols-2"
                  >
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-[#8df5d7]">
                        Add / Update Student
                      </h3>
                      <div className="space-y-3">
                        <input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Full name"
                          className={inputCls}
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="Email"
                          className={inputCls}
                        />
                        <input
                          value={form.phone || ""}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="Phone"
                          className={inputCls}
                        />
                        <input
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          placeholder="Login password"
                          className={inputCls}
                        />
                        <div className="rounded-xl border border-white/10 bg-[#050d18]/80 p-3">
                          <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#f2b84b]">
                            Courses
                          </p>
                          <div className="max-h-36 space-y-1.5 overflow-y-auto">
                            {courses.map((course) => (
                              <label
                                key={course.id}
                                className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
                              >
                                <input
                                  type="checkbox"
                                  checked={form.enrolledCourses.includes(course.id)}
                                  onChange={() => {
                                    const set = new Set(form.enrolledCourses);
                                    if (set.has(course.id)) set.delete(course.id);
                                    else set.add(course.id);
                                    setForm({
                                      ...form,
                                      enrolledCourses: Array.from(set),
                                    });
                                  }}
                                />
                                {course.title}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={saveStudent}
                            className="rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] py-3 text-sm font-black text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-xl border border-white/10 py-3 text-sm font-bold text-slate-300"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Search className="h-4 w-4 text-slate-500" />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search students..."
                          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                      <div className="max-h-[420px] space-y-2 overflow-y-auto">
                        {studentList.length === 0 ? (
                          <p className="py-8 text-center text-sm text-slate-500">
                            No students yet.
                          </p>
                        ) : (
                          studentList.map((student) => (
                            <div
                              key={student.email}
                              className="group rounded-xl border border-white/10 bg-[#050d18]/60 p-3 transition-colors hover:border-[#18c29c]/25"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-bold text-white">{student.name}</p>
                                  <p className="truncate text-xs text-slate-500">
                                    {student.email}
                                  </p>
                                  <p className="mt-1 text-xs text-[#9cf8dd]">
                                    {(student.enrolledCourses || []).length} course(s)
                                  </p>
                                </div>
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setForm({
                                        email: student.email,
                                        name: student.name,
                                        phone: student.phone || "",
                                        password: student.password || "",
                                        enrolledCourses: student.enrolledCourses || [],
                                      });
                                      setCertificate((c) => ({
                                        ...c,
                                        studentName: student.name,
                                      }));
                                    }}
                                    className="rounded-lg border border-[#18c29c]/25 px-2.5 py-1.5 text-[10px] font-black text-[#9cf8dd]"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = { ...students };
                                      delete next[student.email];
                                      persistStudents(next);
                                      setMessage("Student removed.");
                                    }}
                                    className="rounded-lg border border-red-400/25 px-2.5 py-1.5 text-[10px] font-black text-red-300"
                                  >
                                    Del
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
