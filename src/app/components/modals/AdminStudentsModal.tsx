import { useEffect, useMemo, useState } from "react";
import { BookOpen, CreditCard, Loader2, Lock, Save, Search, Shield, Users, X } from "lucide-react";
import { motion } from "motion/react";
import { adminRequest, restoreAdminSession, sendPasswordReset, signInAdmin, signOutStudent, type AdminSession } from "@/app/lib/supabase";

interface Course { id: string; title: string }
interface CatalogCourse { id: string; title: string; subtitle: string; status: "draft" | "published"; updated_at: string }
interface Profile { id: string; email: string; full_name: string; phone: string; created_at: string }
interface Enrollment { student_id: string; course_id: string; amount_paid_paise: number; enrolled_at: string }
interface Progress { student_id: string; course_id: string; module_index: number }
interface Payment { order_id: string; student_email: string; course_ids: string[]; amount_paise: number; payment_id?: string; status: string; created_at: string }
interface ContentModule { id: string; course_id: string; title: string; position: number }
interface ContentLesson { id: string; module_id: string; title: string; description: string; video_url: string; duration_seconds: number; position: number; is_preview: boolean; is_published: boolean }
interface ContentResource { id: string; lesson_id: string; title: string; resource_url: string; resource_type: string; position: number }
interface DashboardData { profiles: Profile[]; enrollments: Enrollment[]; progress: Progress[]; payments: Payment[]; courses: CatalogCourse[]; modules: ContentModule[]; lessons: ContentLesson[]; resources: ContentResource[] }
type Tab = "students" | "payments" | "courses";

const emptyData: DashboardData = { profiles: [], enrollments: [], progress: [], payments: [], courses: [], modules: [], lessons: [], resources: [] };
const field = "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#18c29c]/50";

export function AdminStudentsModal({ courses: storefront, onClose }: { courses: Course[]; onClose: () => void }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [data, setData] = useState<DashboardData>(emptyData);
  const [tab, setTab] = useState<Tab>("students");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<CatalogCourse | null>(null);
  const [contentCourse, setContentCourse] = useState<CatalogCourse | null>(null);
  const [newModule, setNewModule] = useState("");
  const [lessonDraft, setLessonDraft] = useState({ moduleId: "", title: "", description: "", videoUrl: "", duration: 0, preview: false });
  const [resourceDraft, setResourceDraft] = useState({ lessonId: "", title: "", url: "", type: "link" });

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

  const courseNames = useMemo(() => new Map(storefront.map((course) => [course.id, course.title])), [storefront]);
  const filtered = data.profiles.filter((profile) => { const term = search.toLowerCase().trim(); return !term || profile.full_name.toLowerCase().includes(term) || profile.email.toLowerCase().includes(term) || profile.phone.includes(term); });
  const revenue = data.payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount_paise, 0) / 100;

  return <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-4">
    <div className="absolute inset-0 bg-[#02060c]/90 backdrop-blur-lg" onClick={onClose} />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative flex h-[96dvh] w-full max-w-7xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#08121f] shadow-2xl sm:h-[92vh] sm:rounded-3xl">
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0b1522] px-5 py-4">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-[#eab96e] p-3"><Shield className="h-5 w-5 text-[#1b1202]" /></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#eab96e]">Secure administration</p><h2 className="text-lg font-black text-white">SkillVane Control Center</h2></div></div>
        <button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2.5 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
      </header>

      {!admin ? <form onSubmit={login} className="m-auto w-full max-w-md space-y-4 p-6">
        <div className="text-center"><Lock className="mx-auto h-10 w-10 text-[#18c29c]" /><h3 className="mt-3 text-xl font-black text-white">Administrator login</h3><p className="mt-1 text-sm text-slate-400">Use a Supabase account assigned the admin role.</p></div>
        <input type="email" required autoComplete="username" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} placeholder="Admin email" className={field} />
        <input type="password" required autoComplete="current-password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} placeholder="Password" className={field} />
        <div className="flex justify-end"><button type="button" onClick={forgotPassword} disabled={loading} className="text-sm font-bold text-[#8df5d7] hover:text-white disabled:opacity-50">Forgot password?</button></div>
        {message && <p className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">{message}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18c29c] py-3 font-black text-[#04110d] disabled:opacity-50">{loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in securely</button>
      </form> : <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-[#07111d] p-3 lg:w-60 lg:border-b-0 lg:border-r lg:p-4">
          <div className="mb-3 rounded-xl border border-[#18c29c]/20 bg-[#18c29c]/8 p-3"><p className="text-xs font-black text-white">{admin.name}</p><p className="truncate text-[11px] text-slate-400">{admin.email}</p></div>
          <nav className="flex gap-2 lg:flex-col">{([{ id: "students", label: "Students", icon: Users }, { id: "payments", label: "Payments", icon: CreditCard }, { id: "courses", label: "Courses", icon: BookOpen }] as const).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold lg:justify-start ${tab === id ? "bg-[#18c29c]/15 text-[#9cf8dd]" : "text-slate-400 hover:bg-white/5"}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
          <button onClick={async () => { await signOutStudent(); setAdmin(null); setData(emptyData); }} className="mt-3 w-full rounded-xl border border-white/10 py-2 text-xs font-bold text-slate-400">Sign out</button>
        </aside>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Students", data.profiles.length], ["Enrollments", data.enrollments.length], ["Paid orders", data.payments.filter((p) => p.status === "paid").length], ["Revenue", `₹${revenue.toLocaleString("en-IN")}`]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-2xl font-black text-white">{value}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p></div>)}</div>
          {message && <p className="mb-4 rounded-xl border border-[#f2b84b]/20 bg-[#f2b84b]/10 px-4 py-2 text-sm text-[#ffe4a3]">{message}</p>}
          {loading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#18c29c]" /></div> : tab === "students" ? <section>
            <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-lg font-black text-white">Students and progress</h3><label className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className={`${field} pl-9`} /></label></div>
            <div className="space-y-3">{filtered.map((profile) => { const enrolled = data.enrollments.filter((e) => e.student_id === profile.id); const done = data.progress.filter((p) => p.student_id === profile.id); return <article key={profile.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><h4 className="font-black text-white">{profile.full_name || "Student"}</h4><p className="text-sm text-slate-400">{profile.email} · {profile.phone || "No phone"}</p></div><div className="text-sm text-slate-300"><b className="text-[#9cf8dd]">{enrolled.length}</b> courses · <b className="text-[#9cf8dd]">{done.length}</b> modules done</div></div><div className="mt-3 flex flex-wrap gap-2">{enrolled.map((e) => <span key={e.course_id} className="rounded-full bg-[#18c29c]/10 px-3 py-1 text-xs text-[#9cf8dd]">{courseNames.get(e.course_id) || e.course_id}</span>)}</div></article>; })}</div>
          </section> : tab === "payments" ? <section><h3 className="mb-4 text-lg font-black text-white">Payment history</h3><div className="space-y-2">{data.payments.map((payment) => <article key={payment.order_id} className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[1fr_auto]"><div><p className="font-bold text-white">{payment.student_email}</p><p className="text-xs text-slate-500">{payment.course_ids.map((id) => courseNames.get(id) || id).join(", ")}</p><p className="mt-1 text-[11px] text-slate-600">{new Date(payment.created_at).toLocaleString("en-IN")} · {payment.payment_id || payment.order_id}</p></div><div className="sm:text-right"><p className="font-black text-white">₹{(payment.amount_paise / 100).toLocaleString("en-IN")}</p><span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${payment.status === "paid" ? "bg-[#18c29c]/15 text-[#9cf8dd]" : "bg-white/5 text-slate-400"}`}>{payment.status}</span></div></article>)}</div></section> : <section>
            <h3 className="mb-1 text-lg font-black text-white">Course publishing</h3><p className="mb-4 text-sm text-slate-400">Edit catalog details and build course content.</p><div className="grid gap-3 md:grid-cols-2">{data.courses.map((course) => <article key={course.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><p className="text-[10px] font-black uppercase text-[#8df5d7]">{course.id}</p><h4 className="font-black text-white">{course.title}</h4><p className="text-sm text-slate-500">{course.subtitle}</p><div className="mt-4 flex items-center justify-between"><span className="text-xs font-black uppercase text-[#9cf8dd]">{course.status}</span><div className="flex gap-2"><button onClick={() => setContentCourse(course)} className="rounded-xl bg-[#18c29c]/15 px-4 py-2 text-xs font-bold text-[#9cf8dd]">Content</button><button onClick={() => setEditing({ ...course })} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300">Edit</button></div></div></article>)}</div>
          </section>}
        </main>
      </div>}
    </motion.div>
    {editing && <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/75 p-4"><div className="w-full max-w-lg space-y-4 rounded-3xl border border-white/10 bg-[#0b1522] p-5"><div className="flex justify-between"><h3 className="text-lg font-black text-white">Edit course</h3><button onClick={() => setEditing(null)} className="text-slate-400"><X /></button></div><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={field} /><textarea value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className={field} /><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as CatalogCourse["status"] })} className={field}><option value="published">Published</option><option value="draft">Draft</option></select><button onClick={saveCourse} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18c29c] py-3 font-black text-[#04110d]"><Save className="h-4 w-4" /> Save changes</button></div></div>}
    {contentCourse && <div className="fixed inset-0 z-[170] overflow-y-auto bg-[#050b14] p-4 sm:p-6"><div className="mx-auto max-w-6xl space-y-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-black uppercase tracking-wider text-[#8df5d7]">Content editor</p><h2 className="text-2xl font-black text-white">{contentCourse.title}</h2></div><button onClick={() => setContentCourse(null)} className="rounded-xl border border-white/10 p-2 text-slate-400"><X /></button></div>
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><h3 className="font-black text-white">Add module</h3><div className="mt-3 flex gap-2"><input value={newModule} onChange={(e) => setNewModule(e.target.value)} placeholder="Module title" className={field} /><button onClick={createModule} className="rounded-xl bg-[#18c29c] px-5 font-black text-[#04110d]">Add</button></div></section>
      <div className="space-y-4">{data.modules.filter((module) => module.course_id === contentCourse.id).map((module) => <section key={module.id} className="rounded-2xl border border-white/10 bg-[#08121f] p-4"><div className="flex items-center justify-between gap-3"><input defaultValue={module.title} onBlur={(e) => { if (e.target.value !== module.title) void patchContent("module", module.id, { title: e.target.value }); }} className={`${field} font-black`} /><button onClick={() => void deleteContent("module", module.id)} className="text-xs font-bold text-red-300">Delete</button></div><div className="mt-3 space-y-2">{data.lessons.filter((lesson) => lesson.module_id === module.id).map((lesson) => <div key={lesson.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-white">{lesson.title}</p><p className="text-xs text-slate-500">{lesson.video_url || "No video URL"} · {lesson.duration_seconds}s</p></div><div className="flex gap-2"><button onClick={() => void patchContent("lesson", lesson.id, { is_published: !lesson.is_published })} className={`rounded-lg px-3 py-1 text-xs font-bold ${lesson.is_published ? "bg-[#18c29c]/15 text-[#9cf8dd]" : "bg-white/5 text-slate-400"}`}>{lesson.is_published ? "Published" : "Publish"}</button><button onClick={() => void deleteContent("lesson", lesson.id)} className="text-xs text-red-300">Delete</button></div></div><div className="mt-2 flex flex-wrap gap-2">{data.resources.filter((resource) => resource.lesson_id === lesson.id).map((resource) => <span key={resource.id} className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-slate-400">{resource.title} <button onClick={() => void deleteContent("resource", resource.id)} className="ml-1 text-red-300">×</button></span>)}</div></div>)}</div></section>)}</div>
      <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-2"><div className="space-y-3"><h3 className="font-black text-white">Add lesson</h3><select value={lessonDraft.moduleId} onChange={(e) => setLessonDraft({ ...lessonDraft, moduleId: e.target.value })} className={field}><option value="">Choose module</option>{data.modules.filter((m) => m.course_id === contentCourse.id).map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select><input value={lessonDraft.title} onChange={(e) => setLessonDraft({ ...lessonDraft, title: e.target.value })} placeholder="Lesson title" className={field} /><textarea value={lessonDraft.description} onChange={(e) => setLessonDraft({ ...lessonDraft, description: e.target.value })} placeholder="Description" className={field} /><input value={lessonDraft.videoUrl} onChange={(e) => setLessonDraft({ ...lessonDraft, videoUrl: e.target.value })} placeholder="Video URL" className={field} /><input type="number" value={lessonDraft.duration} onChange={(e) => setLessonDraft({ ...lessonDraft, duration: Number(e.target.value) })} placeholder="Duration in seconds" className={field} /><label className="flex gap-2 text-sm text-slate-300"><input type="checkbox" checked={lessonDraft.preview} onChange={(e) => setLessonDraft({ ...lessonDraft, preview: e.target.checked })} /> Free preview</label><button onClick={createLesson} className="w-full rounded-xl bg-[#18c29c] py-3 font-black text-[#04110d]">Add unpublished lesson</button></div><div className="space-y-3"><h3 className="font-black text-white">Attach resource</h3><select value={resourceDraft.lessonId} onChange={(e) => setResourceDraft({ ...resourceDraft, lessonId: e.target.value })} className={field}><option value="">Choose lesson</option>{data.lessons.filter((lesson) => data.modules.some((m) => m.id === lesson.module_id && m.course_id === contentCourse.id)).map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select><input value={resourceDraft.title} onChange={(e) => setResourceDraft({ ...resourceDraft, title: e.target.value })} placeholder="Resource title" className={field} /><input value={resourceDraft.url} onChange={(e) => setResourceDraft({ ...resourceDraft, url: e.target.value })} placeholder="PDF, notebook, dataset or link URL" className={field} /><select value={resourceDraft.type} onChange={(e) => setResourceDraft({ ...resourceDraft, type: e.target.value })} className={field}><option value="link">Link</option><option value="pdf">PDF</option><option value="notebook">Notebook</option><option value="dataset">Dataset</option></select><button onClick={createResource} className="w-full rounded-xl border border-[#18c29c]/30 bg-[#18c29c]/10 py-3 font-black text-[#9cf8dd]">Attach resource</button></div></section>
    </div></div>}
  </div>;
}
