import { escapeHtml } from "@/app/lib/services";
import { STORAGE_KEYS } from "@/app/lib/storage";

export type CertificateData = {
  studentName: string;
  completionDate: string; // YYYY-MM-DD
  courseTitle?: string;
  studentEmail?: string;
};

export type IssuedCertificate = CertificateData & {
  certificateId: string;
  issuedAt: string;
  courseTitle: string;
};

const CERT_STORAGE_KEY = STORAGE_KEYS.certificates;

export function formatCertificateDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function buildCertificateId(studentName: string, completionDate: string) {
  const slug = studentName.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  return `SV-GCP-${completionDate.replaceAll("-", "")}-${slug || "STUDENT"}`;
}

export function getIssuedCertificates(): Record<string, IssuedCertificate> {
  try {
    return JSON.parse(localStorage.getItem(CERT_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function issueCertificate(
  email: string,
  data: CertificateData,
  courseTitle = "GCP Data Engineering",
): IssuedCertificate {
  const certificateId = buildCertificateId(data.studentName, data.completionDate);
  const issued: IssuedCertificate = {
    ...data,
    studentEmail: email.toLowerCase(),
    courseTitle,
    certificateId,
    issuedAt: new Date().toISOString(),
  };
  const all = getIssuedCertificates();
  all[email.toLowerCase()] = issued;
  localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(all));
  return issued;
}

export function getStudentCertificate(email: string): IssuedCertificate | null {
  return getIssuedCertificates()[email.toLowerCase()] || null;
}

export function buildCertificatePrintHtml(
  data: CertificateData,
  logoUrl: string,
  courseTitle = "GCP Data Engineering",
) {
  const studentName = data.studentName.trim();
  const certificateDate = formatCertificateDate(data.completionDate);
  const certificateId = buildCertificateId(studentName, data.completionDate);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(studentName)} - SkillVane Certificate</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #050b14; font-family: "Space Grotesk", Arial, sans-serif; }
    .page {
      width: 297mm; height: 210mm; padding: 10mm;
      background:
        radial-gradient(circle at 12% 18%, rgba(66,133,244,0.22), transparent 34%),
        radial-gradient(circle at 88% 82%, rgba(52,168,83,0.18), transparent 30%),
        linear-gradient(135deg, #07111f 0%, #0a1628 38%, #f8fbff 38.2%, #ffffff 100%);
    }
    .frame {
      height: 100%; border: 2px solid #f2b84b; border-radius: 6px; position: relative; overflow: hidden;
      background: linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,251,255,0.96));
      box-shadow: inset 0 0 0 1px rgba(24,194,156,0.25);
    }
    .frame::before {
      content: ""; position: absolute; inset: 7mm; border: 1px solid rgba(66,133,244,0.22);
      border-radius: 4px; pointer-events: none;
    }
    .grid-bg {
      position: absolute; inset: 0; opacity: 0.05;
      background-image:
        linear-gradient(#4285f4 1px, transparent 1px),
        linear-gradient(90deg, #4285f4 1px, transparent 1px);
      background-size: 18px 18px;
    }
    .ribbon {
      position: absolute; left: -42mm; top: 16mm; width: 150mm; transform: rotate(-28deg);
      background: linear-gradient(90deg, #4285f4, #34a853, #fbbc04);
      color: white; text-align: center; font-size: 9px; font-weight: 800; letter-spacing: 3px;
      text-transform: uppercase; padding: 4px 0; opacity: 0.9;
    }
    .watermark {
      position: absolute; right: 8mm; bottom: 8mm; width: 52mm; opacity: 0.07;
    }
    .inner { position: relative; z-index: 1; height: 100%; padding: 14mm 16mm 12mm; display: flex; flex-direction: column; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand img { width: 16mm; height: 16mm; object-fit: contain; background: #fff; border-radius: 8px; padding: 1.5mm; border: 1px solid #e2e8f0; }
    .brand h1 { margin: 0; font-size: 17px; font-weight: 800; color: #07111f; }
    .brand p { margin: 3px 0 0; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #64748b; }
    .meta { text-align: right; font-family: "JetBrains Mono", monospace; font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; line-height: 1.6; }
    .meta strong { color: #07111f; font-size: 10px; }
    .content { flex: 1; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 4mm 8mm 0; }
    .eyebrow { color: #18a884; font-weight: 800; letter-spacing: 5px; text-transform: uppercase; font-size: 11px; }
    .title { margin: 6px 0 0; font-size: 42px; line-height: 1.05; font-weight: 800; color: #07111f; }
    .divider { width: 96px; height: 4px; margin: 10mm auto 7mm; border-radius: 999px; background: linear-gradient(90deg, #4285f4, #34a853, #fbbc04); }
    .copy { color: #64748b; font-size: 16px; margin: 0; }
    .name {
      margin: 5mm auto 4mm; color: #07111f; font-size: 36px; font-weight: 800;
      border-bottom: 2px solid #d4af37; width: 74%; padding-bottom: 3mm;
    }
    .course { margin: 0 auto; max-width: 720px; color: #475569; font-size: 15px; line-height: 1.7; }
    .course strong { color: #07111f; }
    .skills { margin-top: 5mm; display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; }
    .skill {
      font-family: "JetBrains Mono", monospace; font-size: 8px; font-weight: 700;
      letter-spacing: 0.5px; text-transform: uppercase; color: #334155;
      border: 1px solid #cbd5e1; border-radius: 999px; padding: 4px 10px; background: #f8fafc;
    }
    .footer { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 16px; margin-top: auto; }
    .field { border-top: 1.5px solid #94a3b8; padding-top: 7px; color: #475569; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; }
    .field strong { display: block; margin-top: 4px; color: #07111f; font-size: 12px; letter-spacing: 0; text-transform: none; }
    .seal {
      width: 30mm; height: 30mm; border-radius: 50%; border: 2px solid #f2b84b;
      display: grid; place-items: center; text-align: center; color: #07111f;
      font-size: 9px; font-weight: 800; line-height: 1.35; background: radial-gradient(circle at 30% 20%, #fff9e8, #fff7df);
      box-shadow: 0 0 0 4px rgba(242,184,75,0.15);
    }
    .signature { text-align: right; }
    .signature .sign { color: #07111f; font-family: Georgia, serif; font-size: 22px; font-style: italic; text-transform: none; letter-spacing: 0; margin-bottom: 4px; }
  </style>
</head>
<body>
  <main class="page">
    <section class="frame">
      <div class="grid-bg"></div>
      <div class="ribbon">Google Cloud Platform · Data Engineering</div>
      <img class="watermark" src="${logoUrl}" alt="" />
      <div class="inner">
        <div class="top">
          <div class="brand">
            <img src="${logoUrl}" alt="SkillVane" />
            <div>
              <h1>SkillVane IT Academy</h1>
              <p>Industry-focused cloud training</p>
            </div>
          </div>
          <div class="meta">
            Certificate ID<br><strong>${escapeHtml(certificateId)}</strong><br>
            Verify at skillvane.com
          </div>
        </div>
        <div class="content">
          <div class="eyebrow">Certificate of Completion</div>
          <div class="title">${escapeHtml(courseTitle)}</div>
          <div class="divider"></div>
          <p class="copy">This is to certify that</p>
          <div class="name">${escapeHtml(studentName)}</div>
          <p class="course">has successfully completed the <strong>${escapeHtml(courseTitle)}</strong> program, demonstrating proficiency in cloud data pipelines, BigQuery, Dataflow, Dataproc, Cloud Composer, Pub/Sub, and production-grade GCP projects.</p>
          <div class="skills">
            <span class="skill">BigQuery</span>
            <span class="skill">Dataflow</span>
            <span class="skill">Cloud Storage</span>
            <span class="skill">Composer</span>
            <span class="skill">PySpark</span>
            <span class="skill">Delta Lake</span>
          </div>
        </div>
        <div class="footer">
          <div class="field">Completion Date<strong>${escapeHtml(certificateDate)}</strong></div>
          <div class="seal">SkillVane<br>Verified<br>Certificate</div>
          <div class="field signature"><div class="sign">Shaik Saidhul</div>Lead Instructor · GCP Architect</div>
        </div>
      </div>
    </section>
  </main>
  <script>window.onload = () => { window.focus(); window.print(); }</script>
</body>
</html>`;
}

export function openCertificatePrint(
  data: CertificateData,
  logoUrl: string,
  courseTitle = "GCP Data Engineering",
) {
  const html = buildCertificatePrintHtml(data, logoUrl, courseTitle);
  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;
  printWindow.document.write(html);
  printWindow.document.close();
  return true;
}
