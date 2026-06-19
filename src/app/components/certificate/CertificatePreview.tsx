import skillVaneLogo from "@/imports/logo1.png";
import {
  buildCertificateId,
  formatCertificateDate,
  type CertificateData,
} from "@/app/lib/certificate";

export function CertificatePreview({
  data,
  courseTitle = "GCP Data Engineering",
  compact = false,
}: {
  data: CertificateData;
  courseTitle?: string;
  compact?: boolean;
}) {
  const name = data.studentName.trim() || "Student Name";
  const dateLabel = data.completionDate
    ? formatCertificateDate(data.completionDate)
    : "Completion Date";
  const certificateId = data.completionDate
    ? buildCertificateId(name, data.completionDate)
    : "SV-GCP-PREVIEW";

  return (
    <div
      className={`certificate-preview relative overflow-hidden rounded-2xl border border-[#f2b84b]/35 bg-white text-[#07111f] shadow-2xl shadow-black/25 ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 certificate-preview-grid opacity-[0.06]" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#4285f4]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-[#34a853]/10 blur-2xl" />
      <div className="absolute left-0 top-4 w-full -rotate-12 bg-gradient-to-r from-[#4285f4] via-[#34a853] to-[#fbbc04] py-1 text-center text-[8px] font-black uppercase tracking-[0.28em] text-white opacity-90">
        GCP Data Engineering
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={skillVaneLogo}
            alt="SkillVane"
            className="h-11 w-11 rounded-xl border border-slate-200 bg-white object-contain p-1"
          />
          <div>
            <p className="text-sm font-black">SkillVane IT Academy</p>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
              Verified Certificate
            </p>
          </div>
        </div>
        <p className="max-w-[9rem] text-right font-mono text-[9px] font-bold uppercase leading-relaxed tracking-wider text-slate-500">
          {certificateId}
        </p>
      </div>

      <div className={`relative text-center ${compact ? "py-5" : "py-7"}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#18a884]">
          Certificate of Completion
        </p>
        <h4
          className={`mt-2 font-black leading-tight ${compact ? "text-xl" : "text-2xl sm:text-3xl"}`}
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          {courseTitle}
        </h4>
        <div className="mx-auto my-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#4285f4] via-[#34a853] to-[#fbbc04]" />
        <p className="text-sm text-slate-500">This is to certify that</p>
        <p
          className={`mx-auto mt-2 max-w-lg border-b border-[#d4af37] pb-2 font-black text-[#07111f] ${
            compact ? "text-2xl" : "text-3xl"
          }`}
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          {name}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
          has successfully completed the {courseTitle} program covering BigQuery,
          Dataflow, Dataproc, Composer, and real-world GCP pipelines.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {["BigQuery", "Dataflow", "GCS", "Composer"].map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-3 items-end gap-3 text-center text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
        <div className="border-t border-slate-300 pt-2 text-left">
          Completion
          <span className="mt-1 block text-[11px] normal-case tracking-normal text-[#07111f]">
            {dateLabel}
          </span>
        </div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-[#f2b84b] bg-[#fff7df] text-[8px] leading-tight text-[#07111f] shadow-[0_0_0_4px_rgba(242,184,75,0.12)]">
          SkillVane
          <br />
          Verified
        </div>
        <div className="border-t border-slate-300 pt-2 text-right">
          <span className="block font-serif text-base normal-case tracking-normal text-[#07111f]">
            Shaik Saidhul
          </span>
          Lead Instructor
        </div>
      </div>
    </div>
  );
}
