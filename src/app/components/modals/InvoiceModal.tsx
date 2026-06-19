import { useState, useEffect } from "react";
import { CheckCircle2, Copy, Mail, X } from "lucide-react";
import { formatINR } from "@/app/lib/format";
import { saveToGoogleSheet, sendInvoiceEmail } from "@/app/lib/services";
import type { EnrollmentRecord } from "@/app/types";

export function InvoiceModal({
  record,
  onClose,
}: {
  record: EnrollmentRecord;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          saveToGoogleSheet(record),
          sendInvoiceEmail(record),
        ]);
        setEmailSent(true);
      } catch {
        setEmailSent(false);
      }
    })();
  }, [record]);

  const copyPaymentId = () => {
    navigator.clipboard.writeText(record.paymentId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="sv-modal-root">
      <div className="sv-modal-backdrop" onClick={onClose} />
      <div className="sv-modal sv-modal-lg max-h-[92dvh] overflow-hidden">
        <div className="sv-modal-body overflow-y-auto text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#0abab5]/25 bg-[#0abab5]/10">
            <CheckCircle2 className="h-8 w-8 text-[#8df5d7]" />
          </div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Enrollment Successful!
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Welcome to SkillVane IT Academy, {record.student.name.split(" ")[0]}!
          </p>
          {emailSent === true && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
              <Mail className="h-3.5 w-3.5" />
              Invoice sent to {record.student.email}
            </div>
          )}
          {emailSent === false && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-400">
              Invoice email setup pending
            </div>
          )}
        </div>

        <div className="sv-modal-body space-y-4 border-t border-white/[0.06] !pt-5">
          <div className="sv-panel flex items-center justify-between !py-3">
            <div>
              <p className="text-xs text-slate-500">Invoice Number</p>
              <p className="font-mono text-sm font-semibold text-white">
                {record.invoiceNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Date & Time</p>
              <p className="text-xs text-slate-300">
                {record.paidAt.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                ,{" "}
                {record.paidAt.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sv-panel !py-3">
              <p className="text-xs text-slate-500">Student</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {record.student.name}
              </p>
              <p className="text-xs text-slate-400">{record.student.email}</p>
              <p className="text-xs text-slate-400">+91 {record.student.phone}</p>
            </div>
            <div className="sv-panel !py-3">
              <p className="text-xs text-slate-500">Course</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {record.course.title}
              </p>
              <p className="text-xs text-slate-400">{record.course.subtitle}</p>
              <p className="mt-1 text-xs font-bold text-emerald-400">
                {formatINR(record.course.price)} paid
              </p>
            </div>
          </div>

          <div className="sv-panel flex items-center justify-between !py-3">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Razorpay Payment ID</p>
              <p className="truncate font-mono text-xs text-slate-300">
                {record.paymentId}
              </p>
            </div>
            <button
              type="button"
              onClick={copyPaymentId}
              className="sv-btn-ghost !px-3 !py-2 text-xs"
            >
              {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Save your Payment ID for refund or support requests.
          </p>
        </div>

        <div className="sv-modal-footer">
          <button type="button" onClick={onClose} className="sv-btn-ghost w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
