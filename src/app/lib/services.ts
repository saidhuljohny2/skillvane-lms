import {
  ADMIN_DEFAULT_PASSWORD,
  EMAILJS_INVOICE_TEMPLATE_ID,
  EMAILJS_PASSWORD_OTP_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  GOOGLE_SHEET_WEBHOOK_URL,
} from "@/app/config";
import { formatINR } from "@/app/lib/format";
import type { EnrollmentRecord } from "@/app/types";

export async function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => {
      if ((window as any).Razorpay) resolve();
      else reject(new Error("Razorpay SDK failed to initialize"));
    };
    s.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(s);
  });
}

async function loadEmailJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).emailjs) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("EmailJS not loaded"));
    document.body.appendChild(s);
  });
}

export async function saveToGoogleSheet(record: EnrollmentRecord) {
  if (GOOGLE_SHEET_WEBHOOK_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL") return;
  await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invoice_no: record.invoiceNo,
      payment_id: record.paymentId,
      name: record.student.name,
      email: record.student.email,
      phone: record.student.phone,
      course: record.course.title,
      course_type: record.course.subtitle,
      course_id: record.course.id,
      amount: record.course.price,
      drive_access_required: Boolean(record.course.driveLink),
      drive_link: record.course.driveLink || "",
      drive_access_email: record.student.email,
      notes_access_required: Boolean(record.course.notesLink),
      notes_link: record.course.notesLink || "",
      notes_access_email: record.student.email,
      paid_at: record.paidAt.toISOString(),
    }),
  });
}

export async function sendInvoiceEmail(record: EnrollmentRecord) {
  if (EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID") return;
  await loadEmailJs();
  const ejs = (window as any).emailjs;
  ejs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_INVOICE_TEMPLATE_ID, {
    to_name: record.student.name,
    to_email: record.student.email,
    invoice_no: record.invoiceNo,
    payment_id: record.paymentId,
    course_name: `${record.course.title} - ${record.course.subtitle}`,
    amount: formatINR(record.course.price),
    paid_at: record.paidAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    academy_name: "SkillVane IT Academy",
  });
}

export function getAdminPassword() {
  return localStorage.getItem("skillvane_admin_password") || ADMIN_DEFAULT_PASSWORD;
}

export function getEmailJsErrorMessage(error: unknown) {
  if (typeof error === "object" && error) {
    const detail =
      "text" in error
        ? String((error as { text?: unknown }).text || "")
        : "message" in error
          ? String((error as { message?: unknown }).message || "")
          : "";
    if (detail) return detail;
  }
  if (error instanceof Error) return error.message;
  return "EmailJS could not send the OTP.";
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendOtpEmail(
  toEmail: string,
  toName: string,
  otp: string,
  purpose: string,
) {
  if (EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID") return;
  if (
    !EMAILJS_PASSWORD_OTP_TEMPLATE_ID ||
    EMAILJS_PASSWORD_OTP_TEMPLATE_ID === "template_password_otp"
  ) {
    throw new Error("Password OTP EmailJS template is not configured.");
  }
  await loadEmailJs();
  const ejs = (window as any).emailjs;
  ejs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_PASSWORD_OTP_TEMPLATE_ID, {
    to_name: toName,
    to_email: toEmail,
    email: toEmail,
    user_email: toEmail,
    reply_to: toEmail,
    otp,
    passcode: otp,
    verification_code: otp,
    purpose,
    academy_name: "SkillVane IT Academy",
    message: `Your SkillVane ${purpose} OTP is ${otp}. It is valid for 10 minutes.`,
  });
}
