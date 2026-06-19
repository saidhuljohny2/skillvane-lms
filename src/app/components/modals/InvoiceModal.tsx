import { useState, useEffect } from "react";
import { CheckCircle2, Copy, Download, Mail, X } from "lucide-react";
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
  const [emailSent, setEmailSent] = useState<boolean | null>(
    null,
  );

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg bg-[#07111f] rounded-t-2xl sm:rounded-2xl border border-[#18c29c]/30 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(24,194,156,0.16),transparent_45%)]" />
        {/* Success header */}
        <div className="relative px-5 pt-7 pb-5 text-center border-b border-white/10 bg-[#18c29c]/5">
          <div className="w-14 h-14 rounded-xl bg-[#18c29c]/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#8df5d7]" />
          </div>
          <h2
            className="text-xl font-black text-white mb-1"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            Enrollment Successful!
          </h2>
          <p className="text-sm text-white/50">
            Welcome to SkillVane IT Academy,{" "}
            {record.student.name.split(" ")[0]}!
          </p>
          {emailSent === true && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <Mail className="w-3.5 h-3.5" /> Invoice sent to{" "}
              {record.student.email}
            </div>
          )}
          {emailSent === false && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-full">
              Invoice email setup pending - see guide below
            </div>
          )}
        </div>

        {/* Invoice body */}
        <div className="relative px-5 py-5 space-y-4">
          {/* Invoice number */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/8">
            <div>
              <p className="text-xs text-white/40 mb-0.5">
                Invoice Number
              </p>
              <p className="font-mono font-bold text-white text-sm">
                {record.invoiceNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 mb-0.5">
                Date & Time
              </p>
              <p className="text-xs text-white/70">
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

          {/* Student + Course */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/4 border border-white/8">
              <p className="text-xs text-white/40 mb-1">
                Student
              </p>
              <p className="text-sm font-semibold text-white">
                {record.student.name}
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                {record.student.email}
              </p>
              <p className="text-xs text-white/50">
                +91 {record.student.phone}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/4 border border-white/8">
              <p className="text-xs text-white/40 mb-1">
                Course Enrolled
              </p>
              <p className="text-sm font-semibold text-white">
                {record.course.title}
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                {record.course.subtitle}
              </p>
              <p className="text-xs font-bold text-emerald-400 mt-1">
                {formatINR(record.course.price)} paid
              </p>
            </div>
          </div>

          {/* Payment ID */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/8">
            <div>
              <p className="text-xs text-white/40 mb-0.5">
                Razorpay Payment ID
              </p>
              <p className="font-mono text-xs text-white/80">
                {record.paymentId}
              </p>
            </div>
            <button
              onClick={copyPaymentId}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/8 transition-all"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-xs text-white/30 text-center">
            Please save your Payment ID for any refund or
            support requests.
          </p>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-white/15 text-white/70 hover:bg-white/5 hover:text-white font-semibold text-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
