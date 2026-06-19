import { useState } from "react";
import {
  Award, Check, Copy, Download, GraduationCap, Lock, LogOut, Mail, Phone, Plus,
  Search, Trash2, User, X,
} from "lucide-react";
import {
  ADMIN_EMAIL, OTP_VALIDITY_MS,
} from "@/app/config";
import { generateOtp } from "@/app/lib/format";
import {
  escapeHtml, getAdminPassword, getEmailJsErrorMessage, sendOtpEmail,
} from "@/app/lib/services";
import type { Course, StoredStudent } from "@/app/types";

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
    completionDate: new Date().toISOString().slice(0, 10),
  });

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
  const certificateName = certificate.studentName.trim();
  const certificateDate = certificate.completionDate
    ? new Date(`${certificate.completionDate}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      )
    : "";
  const certificateId = certificateName
    ? `SV-GCP-${certificate.completionDate.replaceAll("-", "")}-${certificateName
        .replace(/[^a-z0-9]/gi, "")
        .slice(0, 6)
        .toUpperCase()}`
    : "SV-GCP-READY";

  const openCertificatePrint = () => {
    if (!certificateName || !certificate.completionDate) {
      setMessage("Enter student name and completion date for the certificate.");
      return;
    }

    const html = `<!doctype html>
<html>
<head>
  <title>${escapeHtml(certificateName)} - SkillVane Certificate</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; background: #07111f; color: #07111f; }
    .page { width: 297mm; height: 210mm; padding: 13mm; background: linear-gradient(135deg, #07111f 0%, #0b2032 42%, #f7fbff 42.2%, #ffffff 100%); }
    .certificate { height: 100%; border: 2px solid #f2b84b; background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(245,250,255,0.98)); position: relative; overflow: hidden; padding: 18mm; }
    .certificate:before { content: ""; position: absolute; inset: 9mm; border: 1px solid rgba(24,194,156,0.35); pointer-events: none; }
    .mark { position: absolute; right: 16mm; top: 12mm; width: 34mm; opacity: 0.12; }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 16px; position: relative; z-index: 1; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand img { width: 18mm; height: 18mm; object-fit: contain; background: #ffffff; border-radius: 10px; padding: 2mm; border: 1px solid #dfe8f3; }
    .brand h1 { margin: 0; font-size: 20px; letter-spacing: 0.3px; }
    .brand p, .id { margin: 4px 0 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.8px; }
    .content { margin-top: 18mm; text-align: center; position: relative; z-index: 1; }
    .eyebrow { color: #18a884; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; font-size: 13px; }
    .title { margin: 8px 0 0; font-size: 46px; line-height: 1; font-weight: 900; color: #07111f; }
    .line { width: 92px; height: 4px; background: linear-gradient(90deg, #18c29c, #2f80ed, #f2b84b); margin: 12mm auto 8mm; border-radius: 999px; }
    .copy { color: #475569; font-size: 18px; margin: 0; }
    .name { margin: 7mm auto 5mm; color: #07111f; font-size: 40px; font-weight: 900; border-bottom: 2px solid #d4af37; width: 72%; padding-bottom: 4mm; }
    .course { margin: 0 auto; max-width: 760px; color: #334155; font-size: 18px; line-height: 1.65; }
    .course strong { color: #07111f; }
    .footer { position: absolute; left: 18mm; right: 18mm; bottom: 16mm; display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: end; gap: 20px; z-index: 1; }
    .field { border-top: 1.5px solid #94a3b8; padding-top: 8px; color: #334155; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    .signature { text-align: center; }
    .signature .sign { color: #07111f; font-family: Georgia, serif; font-size: 24px; font-style: italic; text-transform: none; letter-spacing: 0; margin-bottom: 5px; }
    .seal { justify-self: center; width: 28mm; height: 28mm; border-radius: 50%; border: 2px solid #f2b84b; display: grid; place-items: center; color: #07111f; font-size: 10px; font-weight: 900; text-align: center; background: #fff7df; }
  </style>
</head>
<body>
  <main class="page">
    <section class="certificate">
      <img class="mark" src="${skillVaneLogo}" alt="">
      <div class="top">
        <div class="brand">
          <img src="${skillVaneLogo}" alt="SkillVane logo">
          <div>
            <h1>SkillVane IT Academy</h1>
            <p>Industry focused cloud training</p>
          </div>
        </div>
        <div class="id">Certificate ID<br>${escapeHtml(certificateId)}</div>
      </div>
      <div class="content">
        <div class="eyebrow">Certificate of Completion</div>
        <div class="title">GCP Data Engineering</div>
        <div class="line"></div>
        <p class="copy">This certifies that</p>
        <div class="name">${escapeHtml(certificateName)}</div>
        <p class="course">has successfully completed the <strong>GCP Data Engineering</strong> training program covering BigQuery, Dataflow, Dataproc, Cloud Composer, production pipelines, and real-world data engineering projects.</p>
      </div>
      <div class="footer">
        <div class="field">Completion Date<br>${escapeHtml(certificateDate)}</div>
        <div class="seal">SkillVane<br>Verified<br>Certificate</div>
        <div class="field signature"><div class="sign">Shaik Saidhul</div>Lead Instructor</div>
      </div>
    </section>
  </main>
  <script>window.onload = () => { window.focus(); window.print(); };</script>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setMessage("Allow popups to print or save the certificate.");
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    setMessage("Certificate generated. Use Save as PDF from the print window.");
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#07111f] shadow-2xl sm:max-w-5xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f2b84b]">
              Admin Console
            </p>
            <h2 className="text-xl font-black text-white">
              Student Login Manager
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!unlocked ? (
          <div className="space-y-4 px-5 py-5">
            {adminMode === "login" ? (
              <>
                <p className="text-sm text-slate-300">
                  Login with admin Gmail and password to manage student
                  accounts.
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
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div className="rounded-2xl border border-[#f2b84b]/25 bg-[#f2b84b]/[0.06] p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f2b84b]">
                    Certificate Generator
                  </p>
                  <h3 className="mt-1 text-lg font-black text-white">
                    GCP Data Engineering Completion Certificate
                  </h3>
                </div>
                <button
                  onClick={openCertificatePrint}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f2b84b] to-[#fff0a8] px-4 py-3 text-sm font-black text-[#1d1602] shadow-lg shadow-[#f2b84b]/15"
                >
                  <Download className="h-4 w-4" />
                  Generate PDF
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
                <div className="space-y-3">
                  <input
                    value={certificate.studentName}
                    onChange={(e) =>
                      setCertificate({
                        ...certificate,
                        studentName: e.target.value,
                      })
                    }
                    placeholder="Student full name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#f2b84b]/60 focus:outline-none"
                  />
                  <input
                    type="date"
                    value={certificate.completionDate}
                    onChange={(e) =>
                      setCertificate({
                        ...certificate,
                        completionDate: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white focus:border-[#f2b84b]/60 focus:outline-none"
                  />
                  <p className="text-xs leading-5 text-slate-400">
                    Enter the name exactly as it should appear on the
                    certificate. The print window can be saved as PDF.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#f2b84b]/30 bg-white p-5 text-[#07111f] shadow-2xl shadow-black/20">
                  <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#f2b84b]/15" />
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={skillVaneLogo}
                        alt="SkillVane logo"
                        className="h-12 w-12 rounded-xl border border-slate-200 bg-white object-contain p-1"
                      />
                      <div>
                        <p className="text-sm font-black text-[#07111f]">
                          SkillVane IT Academy
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Verified Certificate
                        </p>
                      </div>
                    </div>
                    <p className="text-right text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                      {certificateId}
                    </p>
                  </div>

                  <div className="relative py-7 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.26em] text-[#18a884]">
                      Certificate of Completion
                    </p>
                    <h4 className="mt-2 text-2xl font-black">
                      GCP Data Engineering
                    </h4>
                    <div className="mx-auto my-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#f2b84b]" />
                    <p className="text-sm text-slate-500">
                      This certifies that
                    </p>
                    <p className="mx-auto mt-2 max-w-lg border-b border-[#d4af37] pb-2 text-3xl font-black">
                      {certificateName || "Student Name"}
                    </p>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
                      has successfully completed the GCP Data Engineering
                      training program covering cloud data pipelines,
                      BigQuery, Dataflow, Dataproc, Composer, and projects.
                    </p>
                  </div>

                  <div className="relative grid grid-cols-3 items-end gap-4 text-center text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                    <div className="border-t border-slate-300 pt-2">
                      {certificateDate || "Completion Date"}
                    </div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#f2b84b] bg-[#fff7df] text-[9px] text-[#07111f]">
                      SkillVane<br />Verified
                    </div>
                    <div className="border-t border-slate-300 pt-2">
                      <span className="block font-serif text-base normal-case tracking-normal text-[#07111f]">
                        Shaik Saidhul
                      </span>
                      Lead Instructor
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
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
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="student@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                />
                <input
                  value={form.phone || ""}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                />
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Login password"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#18c29c]/60 focus:outline-none"
                />
                <div className="rounded-xl border border-white/10 bg-[#07111f]/70 p-3">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#f2b84b]">
                    Enrolled Courses
                  </p>
                  <div className="grid gap-2">
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
                {message && (
                  <p className="rounded-lg border border-[#f2b84b]/25 bg-[#f2b84b]/10 px-3 py-2 text-sm text-[#ffe4a3]">
                    {message}
                  </p>
                )}
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

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <h3 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-[#8df5d7]">
                Existing Students
              </h3>
              <div className="space-y-3">
                {studentList.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No student logins created yet.
                  </p>
                ) : (
                  studentList.map((student) => (
                    <div
                      key={student.email}
                      className="rounded-xl border border-white/10 bg-[#07111f]/72 p-3"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-black text-white">
                            {student.name}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {student.email}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Password: {student.password}
                          </p>
                          <p className="mt-1 text-xs text-[#9cf8dd]">
                            {(student.enrolledCourses || []).length} enrolled
                          </p>
                        </div>
                        <div className="flex gap-2">
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
          </div>
        )}
      </div>
    </div>
  );
}
