import skillVaneLogo from "@/imports/logo1.png";
import {
  buildCertificateId,
  formatCertificateDate,
} from "@/app/lib/certificate";
import { CertificateStamp } from "./CertificateStamp";

export function CertificatePreview({
  studentName,
  completionDate,
  courseName = "GCP Data Engineering",
}: {
  studentName: string;
  completionDate: string;
  courseName?: string;
}) {
  const name = studentName.trim() || "Student Name";
  const date = formatCertificateDate(completionDate) || "Completion Date";
  const id = buildCertificateId(studentName, completionDate);

  return (
    <div className="cert-preview relative overflow-hidden rounded-2xl border-2 border-double border-[#c9a227]/60 bg-gradient-to-br from-[#fffef9] via-[#f8fbff] to-[#fffdf6] p-5 text-[#07111f] shadow-2xl shadow-black/25 sm:p-6">
      <div className="pointer-events-none absolute -right-6 -top-4 rotate-[42deg] bg-gradient-to-r from-[#18c29c] to-[#2f80ed] px-8 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
        Official
      </div>
      <div
        className="pointer-events-none absolute inset-4 rounded-xl border border-[#18c29c]/20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23e2e8f0' stroke-width='0.5'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={skillVaneLogo}
            alt="SkillVane"
            className="h-11 w-11 rounded-xl border border-slate-200 bg-white object-contain p-1"
          />
          <div>
            <p className="text-sm font-black">SkillVane IT Academy</p>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
              Verified Certificate
            </p>
          </div>
        </div>
        <p className="text-right text-[9px] font-black uppercase tracking-wider text-slate-500">
          {id}
        </p>
      </div>

      <div className="relative py-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#18a884]">
          Certificate of Completion
        </p>
        <h4 className="mt-2 font-serif text-3xl font-bold italic text-[#07111f] sm:text-4xl">
          {courseName}
        </h4>
        <div className="mx-auto my-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#18c29c] via-[#2f80ed] to-[#f2b84b]" />
        <p className="text-sm text-slate-500">This is to certify that</p>
        <p className="mx-auto mt-2 max-w-md border-b-2 border-[#c9a227] pb-2 font-serif text-3xl font-bold italic text-[#07111f]">
          {name}
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
          has successfully completed the {courseName} training program at
          SkillVane IT Academy.
        </p>
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div className="border-t border-slate-300 pt-2 text-[9px] font-black uppercase tracking-wider text-slate-500">
          {date}
        </div>
        <div className="flex flex-col items-center">
          <CertificateStamp size={76} />
          <span className="mt-1 text-[8px] font-black tracking-[0.2em] text-[#b8860b]">
            AUTHENTIC
          </span>
        </div>
        <div className="border-t border-slate-300 pt-2 text-right text-[9px] font-black uppercase tracking-wider text-slate-500">
          <span className="block font-serif text-base normal-case tracking-normal text-[#07111f]">
            Shaik Saidhul
          </span>
          Lead Instructor
        </div>
      </div>
    </div>
  );
}
