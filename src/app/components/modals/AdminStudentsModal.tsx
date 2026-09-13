import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, CreditCard, Download, Eye, Loader2, Lock, MessageCircle, MonitorPlay, RotateCw, Save, Search, Shield, Users, X } from "lucide-react";
import { motion } from "motion/react";
import { adminRequest, restoreAdminSession, sendPasswordReset, signInAdmin, signOutStudent, type AdminSession } from "@/app/lib/supabase";

interface Course { id: string; title: string }
interface CatalogCourse { id: string; title: string; subtitle: string; status: "draft" | "published"; updated_at: string }
interface Profile { id: string; email: string; full_name: string; phone: string; created_at: string }
interface Enrollment { student_id: string; course_id: string; amount_paid_paise: number; enrolled_at: string }
interface Progress { student_id: string; course_id: string; module_index: number }
interface Payment { order_id: string; student_email: string; course_ids: string[]; amount_paise: number; payment_id?: string; status: string; created_at: string; verified_at?: string }
interface DriveAccess { student_id: string; course_id: string; status: "pending" | "granted" | "failed"; last_error?: string; attempted_at?: string; granted_at?: string; updated_at: string }
interface ContentModule { id: string; course_id: string; title: string; position: number }
interface ContentLesson { id: string; module_id: string; title: string; description: string; video_url: string; duration_seconds: number; position: number; is_preview: boolean; is_published: boolean }
interface ContentResource { id: string; lesson_id: string; title: string; resource_url: string; resource_type: string; position: number }
interface SupportTicket { id: string; student_id: string; subject: string; message: string; status: "open" | "in_progress" | "resolved"; created_at: string; updated_at: string }
interface AppEvent { id: number; student_id?: string; event_type: string; context: Record<string, unknown>; created_at: string }
interface DashboardData { profiles: Profile[]; enrollments: Enrollment[]; progress: Progress[]; payments: Payment[]; driveAccess: DriveAccess[]; courses: CatalogCourse[]; modules: ContentModule[]; lessons: ContentLesson[]; resources: ContentResource[]; supportTickets: SupportTicket[]; events: AppEvent[] }
type Tab = "overview" | "students" | "payments" | "support" | "courses";

const emptyData: DashboardData = { profiles: [], enrollments: [], progress: [], payments: [], driveAccess: [], courses: [], modules: [], lessons: [], resources: [], supportTickets: [], events: [] };
const field = "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#3b82f6]/50";
const tableHead = "whitespace-nowrap border-b border-r border-white/10 bg-[#102033] px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 last:border-r-0";
const tableCell = "border-b border-r border-white/[0.07] px-4 py-3 align-top text-xs text-slate-300 last:border-r-0";

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminStudentsModal({ courses: storefront, onClose, onAccessCourses }: { courses: Course[]; onClose: () => void; onAccessCourses: (admin: AdminSession) => void }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [data, setData] = useState<DashboardData>(emptyData);
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<CatalogCourse | null>(null);
  const [contentCourse, setContentCourse] = useState<CatalogCourse | null>(null);
  const [newModule, setNewModule] = useState("");
  const [lessonDraft, setLessonDraft] = useState({ moduleId: "", title: "", description: "", videoUrl: "", duration: 0, preview: false });
  const [resourceDraft, setResourceDraft] = useState({ lessonId: "", title: "", url: "", type: "link" });
  const [grantCourse, setGrantCourse] = useState<Record<string, string>>({});
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentCourse, setPaymentCourse] = useState("all");

  const load = async () => {
    setLoading(true);
    try { setData(await adminRequest<DashboardData>("")); setMessage(""); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not load admin data."); }
    finally { setLoading(false); }
  };

  useEffect(() => { restoreAdminSession().then((session) => { setAdmin(session); if (session) void load(); else setLoading(false); }); }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setMessage("");
    try { const session = await signInAdmin(credentials.email.trim().toLowerCase(), credentials.password); setAdmin(session); setData(await adminRequest<DashboardData>("")); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Admin login failed."); }
    finally { setLoading(false); }
  };

  const forgotPassword = async () => {
    const email = credentials.email.trim().toLowerCase();
    if (!email) { setMessage("Enter your admin email first."); return; }
    setLoading(true); setMessage("");
    try { await sendPasswordReset(email); setMessage("Password reset email sent. Open the secure link in that email."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not send the reset email."); }
    finally { setLoading(false); }
  };

  const saveCourse = async () => {
    if (!editing?.title.trim()) return;
    setLoading(true);
    try { await adminRequest("", { method: "PATCH", body: JSON.stringify(editing) }); setEditing(null); await load(); setMessage("Course settings saved."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not save course."); setLoading(false); }
  };

  const createModule = async () => {
    if (!contentCourse || !newModule.trim()) return;
    const position = data.modules.filter((module) => module.course_id === contentCourse.id).length;
    await adminRequest("", { method: "POST", body: JSON.stringify({ entity: "module", values: { course_id: contentCourse.id, title: newModule.trim(), position } }) });
    setNewModule(""); await load();
  };

  const createLesson = async () => {
    if (!lessonDraft.moduleId || !lessonDraft.title.trim()) return;
    const position = data.lessons.filter((lesson) => lesson.module_id === lessonDraft.moduleId).length;
    await adminRequest("", { method: "POST", body: JSON.stringify({ entity: "lesson", values: { module_id: lessonDraft.moduleId, title: lessonDraft.title.trim(), description: lessonDraft.description.trim(), video_url: lessonDraft.videoUrl.trim() || null, duration_seconds: Number(lessonDraft.duration) || 0, position, is_preview: lessonDraft.preview, is_published: false } }) });
    setLessonDraft({ ...lessonDraft, title: "", description: "", videoUrl: "", duration: 0, preview: false }); await load();
  };

  const createResource = async () => {
    if (!resourceDraft.lessonId || !resourceDraft.title.trim() || !resourceDraft.url.trim()) return;
    const position = data.resources.filter((resource) => resource.lesson_id === resourceDraft.lessonId).length;
    await adminRequest("", { method: "POST", body: JSON.stringify({ entity: "resource", values: { lesson_id: resourceDraft.lessonId, title: resourceDraft.title.trim(), resource_url: resourceDraft.url.trim(), resource_type: resourceDraft.type, position } }) });
    setResourceDraft({ ...resourceDraft, title: "", url: "" }); await load();
  };

  const patchContent = async (entity: "module" | "lesson", id: string, values: Record<string, unknown>) => {
    await adminRequest("", { method: "PATCH", body: JSON.stringify({ entity, id, values }) }); await load();
  };

  const deleteContent = async (entity: "module" | "lesson" | "resource", id: string) => {
    await adminRequest("", { method: "DELETE", body: JSON.stringify({ entity, id }) }); await load();
  };

  const grantEnrollment = async (studentId: string) => {
    const courseId = grantCourse[studentId];
    if (!courseId) { setMessage("Choose a course to grant."); return; }
    setLoading(true); setMessage("");
    try {
      await adminRequest("", { method: "POST", body: JSON.stringify({ entity: "enrollment", values: { student_id: studentId, course_id: courseId } }) });
      await load();
      setGrantCourse((current) => ({ ...current, [studentId]: "" }));
      setMessage("Course access granted. Ask the student to sign out and sign in again.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not grant course access.");
      setLoading(false);
    }
  };

  const retryDriveAccess = async (studentId: string, courseId: string) => {
    setLoading(true); setMessage("");
    try {
      await adminRequest("", { method: "POST", body: JSON.stringify({ entity: "drive_access", values: { student_id: studentId, course_id: courseId } }) });
      await load();
      setMessage("Google Drive access granted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not grant Google Drive access.");
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id: string, status: SupportTicket["status"]) => {
    setLoading(true); setMessage("");
    try {
      await adminRequest("", { method: "PATCH", body: JSON.stringify({ entity: "support_ticket", id, values: { status } }) });
      setData((current) => ({ ...current, supportTickets: current.supportTickets.map((ticket) => ticket.id === id ? { ...ticket, status, updated_at: new Date().toISOString() } : ticket) }));
      setMessage("Support ticket updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update the ticket."); }
    finally { setLoading(false); }
  };

  const courseNames = useMemo(() => new Map(storefront.map((course) => [course.id, course.title])), [storefront]);
  const filtered = data.profiles.filter((profile) => { const term = search.toLowerCase().trim(); return !term || profile.full_name.toLowerCase().includes(term) || profile.email.toLowerCase().includes(term) || profile.phone.includes(term); });
  const filteredPayments = data.payments.filter((payment) => { const term = search.toLowerCase().trim(); const matchesSearch = !term || payment.student_email.toLowerCase().includes(term) || payment.order_id.toLowerCase().includes(term) || payment.payment_id?.toLowerCase().includes(term) || payment.course_ids.some((id) => (courseNames.get(id) || id).toLowerCase().includes(term)); return matchesSearch && (paymentStatus === "all" || payment.status === paymentStatus) && (paymentCourse === "all" || payment.course_ids.includes(paymentCourse)); });
  const revenue = data.payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount_paise, 0) / 100;
  const paidPayments = data.payments.filter((payment) => payment.status === "paid");
  const coursePerformance = storefront.map((course) => {
    const enrollments = data.enrollments.filter((item) => item.course_id === course.id).length;
    const orders = paidPayments.filter((payment) => payment.course_ids.includes(course.id));
    const revenue = orders.reduce((sum, payment) => sum + payment.amount_paise / Math.max(payment.course_ids.length, 1), 0) / 100;
    return { ...course, enrollments, orders: orders.length, revenue };
  }).sort((a, b) => b.enrollments - a.enrollments);
  const maxEnrollments = Math.max(...coursePerformance.map((course) => course.enrollments), 1);

  const exportStudents = () => downloadCsv("skillvane-student-history.csv", [
    ["Student", "Email", "Phone", "Joined", "Enrolled courses", "Modules completed", "Course names"],
    ...filtered.map((profile) => {
      const enrolled = data.enrollments.filter((item) => item.student_id === profile.id);
      const completed = data.progress.filter((item) => item.student_id === profile.id).length;
      return [profile.full_name || "Student", profile.email, profile.phone || "", new Date(profile.created_at).toLocaleString("en-IN"), enrolled.length, completed, enrolled.map((item) => courseNames.get(item.course_id) || item.course_id).join("; ")];
    }),
  ]);

  const exportPayments = () => downloadCsv("skillvane-payment-history.csv", [
    ["Date", "Student email", "Courses", "Order ID", "Payment ID", "Amount (INR)", "Status"],
    ...filteredPayments.map((payment) => [new Date(payment.verified_at || payment.created_at).toLocaleString("en-IN"), payment.student_email, payment.course_ids.map((id) => courseNames.get(id) || id).join("; "), payment.order_id, payment.payment_id || "", (payment.amount_paise / 100).toFixed(2), payment.status]),
  ]);

  return <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-4">
    <div className="absolute inset-0 bg-[#02060c]/90 backdrop-blur-lg" onClick={onClose} />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative flex h-[96dvh] w-full max-w-7xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#08121f] shadow-2xl sm:h-[92vh] sm:rounded-3xl">
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0b1522] px-5 py-4">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-[#eab96e] p-3"><Shield className="h-5 w-5 text-[#1b1202]" /></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#eab96e]">Secure administration</p><h2 className="text-lg font-black text-white">SkillVane Control Center</h2></div></div>
        <button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2.5 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
      </header>

      {!admin ? <form onSubmit={login} className="m-auto w-full max-w-md space-y-4 p-6">
        <div className="text-center"><Lock className="mx-auto h-10 w-10 text-[#3b82f6]" /><h3 className="mt-3 text-xl font-black text-white">Administrator login</h3><p className="mt-1 text-sm text-slate-400">Use a Supabase account assigned the admin role.</p></div>
        <input type="email" required autoComplete="username" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} placeholder="Admin email" className={field} />
        <input type="password" required autoComplete="current-password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} placeholder="Password" className={field} />
        <div className="flex justify-end"><button type="button" onClick={forgotPassword} disabled={loading} className="text-sm font-bold text-[#93c5fd] hover:text-white disabled:opacity-50">Forgot password?</button></div>
        {message && <p className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">{message}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] py-3 font-black text-[#ffffff] disabled:opacity-50">{loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in securely</button>
      </form> : <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-[#07111d] p-3 lg:w-60 lg:border-b-0 lg:border-r lg:p-4">
          <div className="mb-3 rounded-xl border border-[#3b82f6]/20 bg-[#3b82f6]/8 p-3"><p className="text-xs font-black text-white">{admin.name}</p><p className="truncate text-[11px] text-slate-400">{admin.email}</p></div>
          <button onClick={() => onAccessCourses(admin)} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2f80ed] px-3 py-2.5 text-sm font-black text-white lg:justify-start"><MonitorPlay className="h-4 w-4" />Access all courses</button>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">{([{ id: "overview", label: "Overview", icon: BarChart3 }, { id: "students", label: "Students", icon: Users }, { id: "payments", label: "Payments", icon: CreditCard }, { id: "support", label: `Support (${data.supportTickets.filter((ticket) => ticket.status !== "resolved").length})`, icon: MessageCircle }, { id: "courses", label: "Courses", icon: BookOpen }] as const).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold lg:justify-start ${tab === id ? "bg-[#3b82f6]/15 text-[#bfdbfe]" : "text-slate-400 hover:bg-white/5"}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
          <button onClick={async () => { await signOutStudent(); setAdmin(null); setData(emptyData); }} className="mt-3 w-full rounded-xl border border-white/10 py-2 text-xs font-bold text-slate-400">Sign out</button>
        </aside>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Students", data.profiles.length], ["Enrollments", data.enrollments.length], ["Paid orders", data.payments.filter((p) => p.status === "paid").length], ["Revenue", `₹${revenue.toLocaleString("en-IN")}`]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-2xl font-black text-white">{value}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p></div>)}</div>
          {message && <p className="mb-4 rounded-xl border border-[#f2b84b]/20 bg-[#f2b84b]/10 px-4 py-2 text-sm text-[#ffe4a3]">{message}</p>}
          {loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#3b82f6]" /></div> : tab === "overview" ? <section><div className="mb-5"><h3 className="text-lg font-black text-white">Business overview</h3><p className="text-xs text-slate-500">A quick view of sales, enrollments, and payment health.</p></div><div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]"><div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><div className="mb-5 flex items-center justify-between"><div><h4 className="font-black text-white">Enrollments by course</h4><p className="text-xs text-slate-500">Current active student access</p></div><span className="rounded-lg bg-[#3b82f6]/10 px-3 py-1 text-xs font-bold text-[#bfdbfe]">{data.enrollments.length} total</span></div><div className="space-y-4">{coursePerformance.map((course) => <div key={course.id}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="truncate font-bold text-slate-300">{course.title}</span><span className="whitespace-nowrap text-slate-500">{course.enrollments} students</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#22d3ee]" style={{ width: `${Math.max(course.enrollments ? 8 : 0, (course.enrollments / maxEnrollments) * 100)}%` }} /></div></div>)}</div></div><div className="space-y-4"><div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h4 className="font-black text-white">Payment health</h4><div className="mt-5 space-y-3">{["paid", "created", "failed"].map((status) => { const count = data.payments.filter((payment) => payment.status === status).length; const total = Math.max(data.payments.length, 1); return <div key={status}><div className="mb-1 flex justify-between text-xs"><span className="capitalize text-slate-400">{status}</span><b className="text-white">{count}</b></div><div className="h-1.5 rounded-full bg-white/[0.06]"><div className={`h-full rounded-full ${status === "paid" ? "bg-emerald-400" : status === "created" ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${(count / total) * 100}%` }} /></div></div>; })}</div></div><div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#12325c] to-[#0b1726] p-5"><p className="text-[10px] font-black uppercase tracking-wider text-[#93c5fd]">Collected revenue</p><p className="mt-2 text-3xl font-black text-white">₹{revenue.toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-slate-400">Across {paidPayments.length} paid orders</p></div></div></div><div className="mt-4 overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[720px] border-collapse"><thead><tr><th className={tableHead}>Course</th><th className={tableHead}>Enrollments</th><th className={tableHead}>Paid orders</th><th className={tableHead}>Attributed revenue</th></tr></thead><tbody>{coursePerformance.map((course) => <tr key={course.id} className="hover:bg-white/[0.03]"><td className={`${tableCell} font-bold text-white`}>{course.title}</td><td className={tableCell}>{course.enrollments}</td><td className={tableCell}>{course.orders}</td><td className={`${tableCell} font-bold text-white`}>₹{Math.round(course.revenue).toLocaleString("en-IN")}</td></tr>)}</tbody></table></div></section> : tab === "students" ? <section>
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h3 className="text-lg font-black text-white">Student history</h3><p className="text-xs text-slate-500">One clear row per student, with enrollment and learning progress.</p></div><div className="flex gap-2"><label className="relative min-w-0 flex-1 sm:w-64"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students" className={`${field} pl-9`} /></label><button type="button" onClick={exportStudents} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-bold text-slate-300 hover:bg-white/5"><Download className="h-4 w-4" />CSV</button></div></div>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.025]"><table className="w-full min-w-[1280px] border-collapse"><thead><tr><th className={tableHead}>Student</th><th className={tableHead}>Contact</th><th className={tableHead}>Joined</th><th className={tableHead}>Courses</th><th className={tableHead}>Progress</th><th className={tableHead}>Drive access</th><th className={tableHead}>Grant course access</th><th className={tableHead}>History</th></tr></thead><tbody>{filtered.map((profile) => { const enrolled = data.enrollments.filter((e) => e.student_id === profile.id); const done = data.progress.filter((p) => p.student_id === profile.id); const enrolledIds = new Set(enrolled.map((e) => e.course_id)); const accessRows = data.driveAccess.filter((item) => item.student_id === profile.id); const failed = accessRows.filter((item) => item.status === "failed").length; const pending = enrolled.filter((item) => !accessRows.some((access) => access.course_id === item.course_id && access.status === "granted")).length; return <tr key={profile.id} className="transition-colors hover:bg-white/[0.035]"><td className={tableCell}><p className="font-bold text-white">{profile.full_name || "Student"}</p><p className="mt-1 font-mono text-[10px] text-slate-600">{profile.id.slice(0, 8)}</p></td><td className={tableCell}><p className="text-slate-200">{profile.email}</p><p className="mt-1 text-slate-500">{profile.phone || "No phone"}</p></td><td className={`${tableCell} whitespace-nowrap`}>{new Date(profile.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td><td className={tableCell}><div className="flex max-w-xs flex-wrap gap-1.5">{enrolled.length ? enrolled.map((e) => <span key={e.course_id} className="rounded-md bg-[#3b82f6]/10 px-2 py-1 text-[10px] font-bold text-[#bfdbfe]">{courseNames.get(e.course_id) || e.course_id}</span>) : <span className="text-slate-600">No enrollments</span>}</div></td><td className={`${tableCell} whitespace-nowrap`}><b className="text-white">{enrolled.length}</b> courses<br/><span className="text-slate-500">{done.length} modules done</span></td><td className={`${tableCell} whitespace-nowrap`}>{!enrolled.length ? <span className="text-slate-600">—</span> : failed ? <span className="rounded-md bg-red-400/10 px-2 py-1 font-bold text-red-300">{failed} failed</span> : pending ? <span className="rounded-md bg-amber-400/10 px-2 py-1 font-bold text-amber-200">{pending} pending</span> : <span className="rounded-md bg-emerald-400/10 px-2 py-1 font-bold text-emerald-300">All granted</span>}</td><td className={tableCell}><div className="flex min-w-[285px] gap-2"><select value={grantCourse[profile.id] || ""} onChange={(e) => setGrantCourse((current) => ({ ...current, [profile.id]: e.target.value }))} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b1726] px-3 py-2 text-xs text-white outline-none"><option value="">Choose course</option>{storefront.filter((course) => !enrolledIds.has(course.id)).map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select><button type="button" disabled={!grantCourse[profile.id] || loading} onClick={() => void grantEnrollment(profile.id)} className="rounded-lg bg-[#3b82f6] px-3 py-2 text-xs font-black text-white disabled:opacity-40">Grant</button></div></td><td className={tableCell}><button type="button" onClick={() => setSelectedStudent(profile)} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 font-bold text-[#bfdbfe] hover:bg-white/5"><Eye className="h-3.5 w-3.5" />View</button></td></tr>; })}</tbody></table>{!filtered.length && <p className="py-12 text-center text-sm text-slate-500">No students found.</p>}</div>
          </section> : tab === "payments" ? <section><div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h3 className="text-lg font-black text-white">Payment history</h3><p className="text-xs text-slate-500">Orders, transaction references, payment status and collected amount.</p></div><div className="flex flex-wrap gap-2"><select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="rounded-xl border border-white/10 bg-[#0b1726] px-3 text-xs text-white"><option value="all">All statuses</option><option value="paid">Paid</option><option value="created">Pending</option><option value="failed">Failed</option></select><select value={paymentCourse} onChange={(e) => setPaymentCourse(e.target.value)} className="max-w-48 rounded-xl border border-white/10 bg-[#0b1726] px-3 text-xs text-white"><option value="all">All courses</option>{storefront.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select><label className="relative min-w-0 flex-1 sm:w-64"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payments" className={`${field} pl-9`} /></label><button type="button" onClick={exportPayments} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-bold text-slate-300 hover:bg-white/5"><Download className="h-4 w-4" />CSV</button></div></div><div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.025]"><table className="w-full min-w-[1050px] border-collapse"><thead><tr><th className={tableHead}>Date & time</th><th className={tableHead}>Student</th><th className={tableHead}>Courses</th><th className={tableHead}>Order / payment reference</th><th className={tableHead}>Amount</th><th className={tableHead}>Status</th></tr></thead><tbody>{filteredPayments.map((payment) => <tr key={payment.order_id} className="transition-colors hover:bg-white/[0.035]"><td className={`${tableCell} whitespace-nowrap`}>{new Date(payment.verified_at || payment.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td><td className={tableCell}><p className="font-bold text-white">{payment.student_email}</p></td><td className={tableCell}><div className="max-w-xs">{payment.course_ids.map((id) => courseNames.get(id) || id).join(", ")}</div></td><td className={`${tableCell} font-mono text-[10px]`}><p className="text-slate-300">{payment.payment_id || "Payment pending"}</p><p className="mt-1 text-slate-600">{payment.order_id}</p></td><td className={`${tableCell} whitespace-nowrap text-sm font-black text-white`}>₹{(payment.amount_paise / 100).toLocaleString("en-IN")}</td><td className={tableCell}><span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-black uppercase ${payment.status === "paid" ? "bg-emerald-400/10 text-emerald-300" : payment.status === "created" ? "bg-amber-400/10 text-amber-200" : "bg-red-400/10 text-red-300"}`}>{payment.status}</span></td></tr>)}</tbody></table>{!filteredPayments.length && <p className="py-12 text-center text-sm text-slate-500">No payments found.</p>}</div></section> : tab === "support" ? <section>
            <div className="mb-5"><h3 className="text-lg font-black text-white">Support and activity</h3><p className="text-xs text-slate-500">Resolve student requests and review recent system events.</p></div>
            <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"><div className="border-b border-white/10 px-5 py-4"><h4 className="font-black text-white">Student tickets</h4></div><div className="divide-y divide-white/[0.07]">{data.supportTickets.map((ticket) => { const student = data.profiles.find((profile) => profile.id === ticket.student_id); return <article key={ticket.id} className="p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-black text-white">{ticket.subject}</p><p className="mt-1 text-xs text-[#93c5fd]">{student?.full_name || "Student"} · {student?.email || ticket.student_id}</p></div><select value={ticket.status} onChange={(event) => void updateTicketStatus(ticket.id, event.target.value as SupportTicket["status"])} className="rounded-lg border border-white/10 bg-[#0b1726] px-3 py-2 text-xs font-bold text-white"><option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option></select></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{ticket.message}</p><p className="mt-3 text-[10px] uppercase tracking-wider text-slate-600">{new Date(ticket.created_at).toLocaleString("en-IN")}</p></article>; })}{!data.supportTickets.length && <p className="p-8 text-center text-sm text-slate-500">No support tickets yet.</p>}</div></div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"><div className="border-b border-white/10 px-5 py-4"><h4 className="font-black text-white">Recent activity</h4></div><div className="divide-y divide-white/[0.07]">{data.events.slice(0, 30).map((event) => <div key={event.id} className="p-4"><div className="flex items-center justify-between gap-3"><span className="rounded-md bg-[#3b82f6]/10 px-2 py-1 text-[10px] font-black uppercase text-[#bfdbfe]">{event.event_type.replace(/_/g, " ")}</span><time className="text-[10px] text-slate-600">{new Date(event.created_at).toLocaleString("en-IN")}</time></div><p className="mt-2 break-words text-xs text-slate-400">{Object.entries(event.context || {}).map(([key, value]) => `${key}: ${String(value)}`).join(" · ") || "Recorded system activity"}</p></div>)}{!data.events.length && <p className="p-8 text-center text-sm text-slate-500">No system events recorded yet.</p>}</div></div>
            </div>
          </section> : <section>
            <h3 className="mb-1 text-lg font-black text-white">Course publishing</h3><p className="mb-4 text-sm text-slate-400">Edit catalog details and build course content.</p><div className="grid gap-3 md:grid-cols-2">{data.courses.map((course) => <article key={course.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><p className="text-[10px] font-black uppercase text-[#93c5fd]">{course.id}</p><h4 className="font-black text-white">{course.title}</h4><p className="text-sm text-slate-500">{course.subtitle}</p><div className="mt-4 flex items-center justify-between"><span className="text-xs font-black uppercase text-[#bfdbfe]">{course.status}</span><div className="flex gap-2"><button onClick={() => setContentCourse(course)} className="rounded-xl bg-[#3b82f6]/15 px-4 py-2 text-xs font-bold text-[#bfdbfe]">Content</button><button onClick={() => setEditing({ ...course })} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300">Edit</button></div></div></article>)}</div>
          </section>}
        </main>
      </div>}
    </motion.div>
    {selectedStudent && (() => {
      const enrollments = data.enrollments.filter((item) => item.student_id === selectedStudent.id);
      const payments = data.payments.filter((item) => item.student_email.toLowerCase() === selectedStudent.email.toLowerCase());
      const progress = data.progress.filter((item) => item.student_id === selectedStudent.id);
      return <div className="fixed inset-0 z-[165] flex justify-end bg-black/65" onClick={() => setSelectedStudent(null)}><motion.aside initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} onClick={(event) => event.stopPropagation()} className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#08121f] p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#93c5fd]">Complete student history</p><h3 className="mt-1 text-2xl font-black text-white">{selectedStudent.full_name || "Student"}</h3><p className="mt-1 text-sm text-slate-400">{selectedStudent.email} · {selectedStudent.phone || "No phone"}</p></div><button onClick={() => setSelectedStudent(null)} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button></div>
        <div className="mt-6 grid grid-cols-3 gap-3">{[["Courses", enrollments.length], ["Modules done", progress.length], ["Payments", payments.length]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-xl font-black text-white">{value}</p><p className="text-[10px] font-bold uppercase text-slate-500">{label}</p></div>)}</div>
        <section className="mt-7"><h4 className="mb-3 font-black text-white">Course and Drive access</h4><div className="space-y-2">{enrollments.map((enrollment) => { const access = data.driveAccess.find((item) => item.student_id === selectedStudent.id && item.course_id === enrollment.course_id); const status = access?.status || "pending"; return <div key={enrollment.course_id} className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-center"><div><p className="font-bold text-white">{courseNames.get(enrollment.course_id) || enrollment.course_id}</p><p className="mt-1 text-xs text-slate-500">Enrolled {enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleString("en-IN") : "through SkillVane"}</p>{access?.last_error && <p className="mt-1 text-xs text-red-300">{access.last_error}</p>}</div><div className="flex items-center gap-2"><span className={`rounded-md px-2 py-1 text-[10px] font-black uppercase ${status === "granted" ? "bg-emerald-400/10 text-emerald-300" : status === "failed" ? "bg-red-400/10 text-red-300" : "bg-amber-400/10 text-amber-200"}`}>{status}</span>{status !== "granted" && <button disabled={loading} onClick={() => void retryDriveAccess(selectedStudent.id, enrollment.course_id)} className="flex items-center gap-1.5 rounded-lg bg-[#3b82f6] px-3 py-2 text-xs font-black text-white disabled:opacity-50"><RotateCw className="h-3.5 w-3.5" />Retry access</button>}</div></div>; })}{!enrollments.length && <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-500">No enrolled courses.</p>}</div></section>
        <section className="mt-7"><h4 className="mb-3 font-black text-white">Payment timeline</h4><div className="overflow-hidden rounded-xl border border-white/10">{payments.map((payment) => <div key={payment.order_id} className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/[0.07] p-4 last:border-b-0"><div><p className="text-sm font-bold text-white">{payment.course_ids.map((id) => courseNames.get(id) || id).join(", ")}</p><p className="mt-1 text-[11px] text-slate-500">{new Date(payment.verified_at || payment.created_at).toLocaleString("en-IN")} · {payment.payment_id || payment.order_id}</p></div><div className="text-right"><p className="font-black text-white">₹{(payment.amount_paise / 100).toLocaleString("en-IN")}</p><p className={`text-[10px] font-black uppercase ${payment.status === "paid" ? "text-emerald-300" : "text-amber-200"}`}>{payment.status}</p></div></div>)}{!payments.length && <p className="p-5 text-sm text-slate-500">No payment history.</p>}</div></section>
      </motion.aside></div>;
    })()}
    {editing && <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/75 p-4"><div className="w-full max-w-lg space-y-4 rounded-3xl border border-white/10 bg-[#0b1522] p-5"><div className="flex justify-between"><h3 className="text-lg font-black text-white">Edit course</h3><button onClick={() => setEditing(null)} className="text-slate-400"><X /></button></div><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={field} /><textarea value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className={field} /><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as CatalogCourse["status"] })} className={field}><option value="published">Published</option><option value="draft">Draft</option></select><button onClick={saveCourse} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] py-3 font-black text-[#ffffff]"><Save className="h-4 w-4" /> Save changes</button></div></div>}
    {contentCourse && <div className="fixed inset-0 z-[170] overflow-y-auto bg-[#050b14] p-4 sm:p-6"><div className="mx-auto max-w-6xl space-y-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-black uppercase tracking-wider text-[#93c5fd]">Content editor</p><h2 className="text-2xl font-black text-white">{contentCourse.title}</h2></div><button onClick={() => setContentCourse(null)} className="rounded-xl border border-white/10 p-2 text-slate-400"><X /></button></div>
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><h3 className="font-black text-white">Add module</h3><div className="mt-3 flex gap-2"><input value={newModule} onChange={(e) => setNewModule(e.target.value)} placeholder="Module title" className={field} /><button onClick={createModule} className="rounded-xl bg-[#3b82f6] px-5 font-black text-[#ffffff]">Add</button></div></section>
      <div className="space-y-4">{data.modules.filter((module) => module.course_id === contentCourse.id).map((module) => <section key={module.id} className="rounded-2xl border border-white/10 bg-[#08121f] p-4"><div className="flex items-center justify-between gap-3"><input defaultValue={module.title} onBlur={(e) => { if (e.target.value !== module.title) void patchContent("module", module.id, { title: e.target.value }); }} className={`${field} font-black`} /><button onClick={() => void deleteContent("module", module.id)} className="text-xs font-bold text-red-300">Delete</button></div><div className="mt-3 space-y-2">{data.lessons.filter((lesson) => lesson.module_id === module.id).map((lesson) => <div key={lesson.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-white">{lesson.title}</p><p className="text-xs text-slate-500">{lesson.video_url || "No video URL"} · {lesson.duration_seconds}s</p></div><div className="flex gap-2"><button onClick={() => void patchContent("lesson", lesson.id, { is_published: !lesson.is_published })} className={`rounded-lg px-3 py-1 text-xs font-bold ${lesson.is_published ? "bg-[#3b82f6]/15 text-[#bfdbfe]" : "bg-white/5 text-slate-400"}`}>{lesson.is_published ? "Published" : "Publish"}</button><button onClick={() => void deleteContent("lesson", lesson.id)} className="text-xs text-red-300">Delete</button></div></div><div className="mt-2 flex flex-wrap gap-2">{data.resources.filter((resource) => resource.lesson_id === lesson.id).map((resource) => <span key={resource.id} className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-slate-400">{resource.title} <button onClick={() => void deleteContent("resource", resource.id)} className="ml-1 text-red-300">×</button></span>)}</div></div>)}</div></section>)}</div>
      <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-2"><div className="space-y-3"><h3 className="font-black text-white">Add lesson</h3><select value={lessonDraft.moduleId} onChange={(e) => setLessonDraft({ ...lessonDraft, moduleId: e.target.value })} className={field}><option value="">Choose module</option>{data.modules.filter((m) => m.course_id === contentCourse.id).map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select><input value={lessonDraft.title} onChange={(e) => setLessonDraft({ ...lessonDraft, title: e.target.value })} placeholder="Lesson title" className={field} /><textarea value={lessonDraft.description} onChange={(e) => setLessonDraft({ ...lessonDraft, description: e.target.value })} placeholder="Description" className={field} /><input value={lessonDraft.videoUrl} onChange={(e) => setLessonDraft({ ...lessonDraft, videoUrl: e.target.value })} placeholder="Video URL" className={field} /><input type="number" value={lessonDraft.duration} onChange={(e) => setLessonDraft({ ...lessonDraft, duration: Number(e.target.value) })} placeholder="Duration in seconds" className={field} /><label className="flex gap-2 text-sm text-slate-300"><input type="checkbox" checked={lessonDraft.preview} onChange={(e) => setLessonDraft({ ...lessonDraft, preview: e.target.checked })} /> Free preview</label><button onClick={createLesson} className="w-full rounded-xl bg-[#3b82f6] py-3 font-black text-[#ffffff]">Add unpublished lesson</button></div><div className="space-y-3"><h3 className="font-black text-white">Attach resource</h3><select value={resourceDraft.lessonId} onChange={(e) => setResourceDraft({ ...resourceDraft, lessonId: e.target.value })} className={field}><option value="">Choose lesson</option>{data.lessons.filter((lesson) => data.modules.some((m) => m.id === lesson.module_id && m.course_id === contentCourse.id)).map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select><input value={resourceDraft.title} onChange={(e) => setResourceDraft({ ...resourceDraft, title: e.target.value })} placeholder="Resource title" className={field} /><input value={resourceDraft.url} onChange={(e) => setResourceDraft({ ...resourceDraft, url: e.target.value })} placeholder="PDF, notebook, dataset or link URL" className={field} /><select value={resourceDraft.type} onChange={(e) => setResourceDraft({ ...resourceDraft, type: e.target.value })} className={field}><option value="link">Link</option><option value="pdf">PDF</option><option value="notebook">Notebook</option><option value="dataset">Dataset</option></select><button onClick={createResource} className="w-full rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/10 py-3 font-black text-[#bfdbfe]">Attach resource</button></div></section>
    </div></div>}
  </div>;
}
