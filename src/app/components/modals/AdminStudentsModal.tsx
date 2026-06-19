import { useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  Download,
  GraduationCap,
  Lock,
  Search,
  Shield,
  Users,
  X,
} from "lucide-react";
import { CertificatePreview } from "@/app/components/certificate/CertificatePreview";
import {
  ADMIN_EMAIL,
  OTP_VALIDITY_MS,
} from "@/app/config";
import {
  issueCertificate,
  openCertificatePrint as printCertificate,
} from "@/app/lib/certificate";
import { generateOtp } from "@/app/lib/format";
import {
  getAdminPassword,
  getEmailJsErrorMessage,
  sendOtpEmail,
} from "@/app/lib/services";
import type { Course, StoredStudent } from "@/app/types";
import skillVaneLogo from "@/imports/logo1.png";

type AdminTab = "students" | "certificates" | "security";

export function AdminStudentsModal({
  courses,
  onClose,
}: {
  courses: Course[];
  onClose: () => void;
}) {
  const [adminMode, setAdminMode] = useState<"login" | "forgot">("login");
  const [adminLogin, setAdminLogin] = useState({
    email: "",
    password: "",
  });
  const [adminOtp, setAdminOtp] = useState<{
    code: string;
    expiresAt: number;
    verified: boolean;
  } | null>(null);
  const [adminOtpInput, setAdminOtpInput] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState<Record<string, StoredStudent>>(
    () => {
      try {
        return JSON.parse(
          localStorage.getItem("skillvane_students") || "{}",
        );
      } catch {
        return {};
      }
    },
  );
  const [form, setForm] = useState<StoredStudent>({
    email: "",
    name: "",
    phone: "",
    password: "",
    enrolledCourses: [],
  });
  const [certificate, setCertificate] = useState({
    studentName: "",
    studentEmail: "",
    completionDate: new Date().toISOString().slice(0, 10),
  });
  const [activeTab, setActiveTab] = useState<AdminTab>("students");
  const [studentSearch, setStudentSearch] = useState("");

  const persistStudents = (next: Record<string, StoredStudent>) => {
    setStudents(next);
    localStorage.setItem("skillvane_students", JSON.stringify(next));
  };

  const resetForm = () => {
    setForm({
      email: "",
      name: "",
      phone: "",
      password: "",
      enrolledCourses: [],
    });
  };

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

    const next = {
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
    };
    persistStudents(next);
    setMessage("Student login saved.");
    resetForm();
  };

  const editStudent = (student: StoredStudent) => {
    setForm({
      email: student.email,
      name: student.name,
      phone: student.phone || "",
      password: student.password || "",
      enrolledCourses: student.enrolledCourses || [],
    });
    setMessage("");
  };

  const deleteStudent = (email: string) => {
    const next = { ...students };
    delete next[email];
    persistStudents(next);
    if (form.email === email) resetForm();
    setMessage("Student removed.");
  };

  const toggleCourse = (courseId: string) => {
    const enrolled = new Set(form.enrolledCourses || []);
    if (enrolled.has(courseId)) enrolled.delete(courseId);
    else enrolled.add(courseId);
    setForm({ ...form, enrolledCourses: Array.from(enrolled) });
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

  const sendAdminResetOtp = async () => {
    const email = adminLogin.email.trim().toLowerCase();
    if (email !== ADMIN_EMAIL) {
      setMessage("Enter the registered admin Gmail first.");
      return;
    }

    const code = generateOtp();
    setMessage("Sending OTP to admin Gmail...");
    try {
      await sendOtpEmail(ADMIN_EMAIL, "SkillVane Admin", code, "admin password reset");
      setAdminOtp({
        code,
        expiresAt: Date.now() + OTP_VALIDITY_MS,
        verified: false,
      });
      setAdminOtpInput("");
      setMessage("OTP sent to admin Gmail.");
    } catch (error) {
      console.error("Admin OTP email failed:", error);
      setMessage(`Unable to send admin OTP: ${getEmailJsErrorMessage(error)}`);
    }
  };

  const verifyAdminOtp = () => {
    if (!adminOtp) return;
    if (Date.now() > adminOtp.expiresAt) {
      setAdminOtp(null);
      setMessage("OTP expired. Please send a new OTP.");
      return;
    }
    if (adminOtpInput.trim() !== adminOtp.code) {
      setMessage("Invalid OTP. Please check the admin Gmail.");
      return;
    }
    setAdminOtp({ ...adminOtp, verified: true });
    setMessage("OTP verified. Set a new admin password.");
  };

  const saveAdminPassword = () => {
    if (newAdminPassword.length < 6) {
      setMessage("Admin password must be at least 6 characters.");
      return;
    }
    localStorage.setItem("skillvane_admin_password", newAdminPassword);
    setAdminLogin({ email: ADMIN_EMAIL, password: "" });
    setNewAdminPassword("");
    setAdminOtp(null);
    setAdminOtpInput("");
    setAdminMode("login");
    setMessage("Admin password updated. Login with the new password.");
  };

  const studentList = Object.values(students).sort((a, b) =>
    a.email.localeCompare(b.email),
  );

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return studentList;
    return studentList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone || "").includes(q),
    );
  }, [studentList, studentSearch]);

  const totalEnrollments = studentList.reduce(
    (sum, s) => sum + (s.enrolledCourses?.length || 0),
    0,
  );

  const openCertificatePrint = () => {
    const studentName = certificate.studentName.trim();
    if (!studentName || !certificate.completionDate) {
      setMessage("Enter student name and completion date for the certificate.");
      return;
    }

    const email = certificate.studentEmail.trim().toLowerCase();
    if (email) {
      issueCertificate(email, {
        studentName,
        completionDate: certificate.completionDate,
        studentEmail: email,
      });
    }

    const opened = printCertificate(
      {
        studentName,
        completionDate: certificate.completionDate,
        studentEmail: email || undefined,
      },
      skillVaneLogo,
    );

    if (!opened) {
      setMessage("Allow popups to print or save the certificate.");
      return;
    }

    setMessage(
      email
        ? "Certificate issued to student dashboard and opened for PDF export."
        : "Certificate opened for PDF export.",
    );
  };

  const fillCertificateFromStudent = (student: StoredStudent) => {
    setCertificate({
      studentName: student.name,
      studentEmail: student.email,
      completionDate: new Date().toISOString().slice(0, 10),
    });
    setActiveTab("certificates");
    setMessage(`Certificate form filled for ${student.name}.`);
  };

  return (
    <div className="sv-modal-root" style={{ zIndex: 130 }}>
      <div className="sv-modal-backdrop" onClick={onClose} />
      <div className="sv-modal sv-modal-xl flex max-h-[94dvh]">
        <div className="sv-modal-header">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2b84b] to-[#fff0a8] shadow-lg shadow-[#f2b84b]/20">
              <Shield className="h-5 w-5 text-[#1b1202]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f2b84b]">
                SkillVane Admin
              </p>
              <h2
                className="text-lg font-black text-white sm:text-xl"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                Academy Control Center
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="sv-close-btn">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!unlocked ? (
          <div className="sv-modal-body space-y-4">
            <div className="sv-panel-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10">
                  <Lock className="h-4 w-4 text-[#ffe4a3]" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Secure admin access</p>
                  <p className="text-xs text-slate-400">
                    Manage students, issue certificates, and reset credentials.
                  </p>
                </div>
              </div>
            {adminMode === "login" ? (
              <>
                <input
                  type="email"
                  value={adminLogin.email}
                  onChange={(e) =>
                    setAdminLogin({
                      ...adminLogin,
                      email: e.target.value.toLowerCase(),
                    })
                  }
                  placeholder="Admin Gmail"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                />
                <input
                  type="password"
                  value={adminLogin.password}
                  onChange={(e) =>
                    setAdminLogin({
                      ...adminLogin,
                      password: e.target.value,
                    })
                  }
                  placeholder="Admin password"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                />
                {message && <p className="text-sm text-red-300">{message}</p>}
                <button
                  onClick={openAdminConsole}
                  className="w-full rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] px-4 py-3 text-sm font-black text-white"
                >
                  Open Admin Console
                </button>
                <button
                  onClick={() => {
                    setAdminMode("forgot");
                    setMessage("");
                    setAdminOtp(null);
                    setAdminOtpInput("");
                  }}
                  className="w-full text-sm font-bold text-[#8df5d7] hover:text-white"
                >
                  Forgot admin password? Reset with OTP
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-300">
                  OTP will be sent to the registered admin Gmail.
                </p>
                <input
                  type="email"
                  value={adminLogin.email}
                  onChange={(e) =>
                    setAdminLogin({
                      ...adminLogin,
                      email: e.target.value.toLowerCase(),
                    })
                  }
                  placeholder="Admin Gmail"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                />
                <button
                  onClick={sendAdminResetOtp}
                  className="w-full rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 px-4 py-3 text-sm font-black text-[#ffe4a3]"
                >
                  {adminOtp ? "Resend Admin OTP" : "Send Admin OTP"}
                </button>
                {adminOtp && !adminOtp.verified && (
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      inputMode="numeric"
                      value={adminOtpInput}
                      onChange={(e) => setAdminOtpInput(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                    />
                    <button
                      onClick={verifyAdminOtp}
                      className="rounded-xl bg-white/[0.08] px-4 py-3 text-sm font-black text-white hover:bg-white/[0.12]"
                    >
                      Verify
                    </button>
                  </div>
                )}
                {adminOtp?.verified && (
                  <>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="New admin password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                    />
                    <button
                      onClick={saveAdminPassword}
                      className="w-full rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] px-4 py-3 text-sm font-black text-white"
                    >
                      Save New Admin Password
                    </button>
                  </>
                )}
                {message && <p className="text-sm text-[#ffe4a3]">{message}</p>}
                <button
                  onClick={() => {
                    setAdminMode("login");
                    setMessage("");
                  }}
                  className="w-full text-sm font-bold text-slate-300 hover:text-white"
                >
                  Back to admin login
                </button>
              </>
            )}
            </div>
          </div>
        ) : (
          <div className="relative flex flex-1 flex-col overflow-hidden">
            <div className="grid grid-cols-3 gap-2 border-b border-white/10 px-4 py-3 sm:px-6">
              {(
                [
                  { id: "students" as const, label: "Students", icon: Users },
                  { id: "certificates" as const, label: "Certificates", icon: BadgeCheck },
                  { id: "security" as const, label: "Security", icon: Lock },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black transition-all sm:text-sm ${
                    activeTab === id
                      ? "bg-gradient-to-r from-[#18c29c] to-[#2f80ed] text-white shadow-lg shadow-[#18c29c]/20"
                      : "border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="lms-dashboard-scroll flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Students", value: studentList.length, icon: Users },
                  { label: "Enrollments", value: totalEnrollments, icon: Award },
                  { label: "Courses", value: courses.length, icon: GraduationCap },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="premium-surface rounded-2xl p-3 sm:p-4">
                    <Icon className="mb-2 h-4 w-4 text-[#f2b84b]" />
                    <div className="text-2xl font-black text-white">{value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {message && (
                <p className="rounded-xl border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-4 py-3 text-sm text-[#ffe4a3]">
                  {message}
                </p>
              )}

              {activeTab === "certificates" && (
                <div className="premium-surface rounded-2xl p-4 sm:p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f2b84b]">
                        Certificate Studio
                      </p>
                      <h3 className="mt-1 text-lg font-black text-white">
                        GCP Data Engineering Completion Certificate
                      </h3>
                    </div>
                    <button
                      onClick={openCertificatePrint}
                      className="magnetic-button inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#fff0a8] px-4 py-3 text-sm font-black text-[#1d1602] shadow-lg shadow-[#f2b84b]/15"
                    >
                      <Download className="h-4 w-4" />
                      Issue & Export PDF
                    </button>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                    <div className="space-y-3">
                      <select
                        value={certificate.studentEmail}
                        onChange={(e) => {
                          const email = e.target.value;
                          const student = students[email];
                          if (student) fillCertificateFromStudent(student);
                          else
                            setCertificate({ ...certificate, studentEmail: email });
                        }}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white focus:border-[#f2b84b]/60 focus:outline-none"
                      >
                        <option value="" className="bg-[#07111f]">
                          Select student to auto-fill
                        </option>
                        {studentList.map((s) => (
                          <option key={s.email} value={s.email} className="bg-[#07111f]">
                            {s.name} — {s.email}
                          </option>
                        ))}
                      </select>
                      <input
                        value={certificate.studentName}
                        onChange={(e) =>
                          setCertificate({ ...certificate, studentName: e.target.value })
                        }
                        placeholder="Student full name"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#f2b84b]/60 focus:outline-none"
                      />
                      <input
                        type="email"
                        value={certificate.studentEmail}
                        onChange={(e) =>
                          setCertificate({ ...certificate, studentEmail: e.target.value })
                        }
                        placeholder="Student email (publishes to dashboard)"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#f2b84b]/60 focus:outline-none"
                      />
                      <input
                        type="date"
                        value={certificate.completionDate}
                        onChange={(e) =>
                          setCertificate({ ...certificate, completionDate: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white focus:border-[#f2b84b]/60 focus:outline-none"
                      />
                      <p className="text-xs leading-5 text-slate-400">
                        Add the student email to publish the certificate to their dashboard.
                        Export uses a premium A4 landscape layout ready for PDF.
                      </p>
                    </div>
                    <CertificatePreview data={certificate} />
                  </div>
                </div>
              )}

              {activeTab === "students" && (
                <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="premium-surface rounded-2xl p-4">
                    <h3 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-[#8df5d7]">
                      Create / Update Student
                    </h3>
                    <div className="space-y-3">
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Student name"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                      />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="student@email.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                      />
                      <input
                        value={form.phone || ""}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Phone number"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                      />
                      <input
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Login password"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                      />
                      <div className="rounded-xl border border-white/10 bg-[#07111f]/70 p-3">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#f2b84b]">
                          Enrolled Courses
                        </p>
                        <div className="grid max-h-40 gap-2 overflow-y-auto">
                          {courses.map((course) => (
                            <label
                              key={course.id}
                              className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
                            >
                              <input
                                type="checkbox"
                                checked={form.enrolledCourses.includes(course.id)}
                                onChange={() => toggleCourse(course.id)}
                              />
                              {course.title}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={saveStudent}
                          className="rounded-xl bg-gradient-to-r from-[#18c29c] to-[#2f80ed] px-4 py-3 text-sm font-black text-white"
                        >
                          Save Student
                        </button>
                        <button
                          onClick={resetForm}
                          className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:text-white"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="premium-surface rounded-2xl p-4">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#8df5d7]">
                        Student Directory
                      </h3>
                      <div className="relative w-full sm:w-56">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          placeholder="Search students..."
                          className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {filteredStudents.length === 0 ? (
                        <p className="text-sm text-slate-400">No students found.</p>
                      ) : (
                        filteredStudents.map((student) => (
                          <div
                            key={student.email}
                            className="rounded-xl border border-white/10 bg-[#07111f]/72 p-3 transition-colors hover:border-[#18c29c]/30"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <p className="font-black text-white">{student.name}</p>
                                <p className="truncate text-xs text-slate-400">{student.email}</p>
                                <p className="mt-1 text-xs text-[#9cf8dd]">
                                  {(student.enrolledCourses || []).length} enrolled course(s)
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => fillCertificateFromStudent(student)}
                                  className="rounded-lg border border-[#f2b84b]/25 px-3 py-2 text-xs font-black text-[#ffe4a3]"
                                >
                                  Certificate
                                </button>
                                <button
                                  onClick={() => editStudent(student)}
                                  className="rounded-lg border border-[#18c29c]/25 px-3 py-2 text-xs font-black text-[#9cf8dd]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteStudent(student.email)}
                                  className="rounded-lg border border-red-400/25 px-3 py-2 text-xs font-black text-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="premium-surface max-w-xl rounded-2xl p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f2b84b]">
                    Admin Security
                  </p>
                  <h3 className="mt-2 text-lg font-black text-white">Password reset</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Use the forgot-password flow on the login screen to receive an OTP at{" "}
                    <span className="text-white">{ADMIN_EMAIL}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setUnlocked(false);
                      setAdminMode("forgot");
                    }}
                    className="mt-4 rounded-xl border border-[#f2b84b]/30 bg-[#f2b84b]/10 px-4 py-3 text-sm font-black text-[#ffe4a3]"
                  >
                    Open password reset
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
