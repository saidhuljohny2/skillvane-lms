export interface CertificateData {
  studentName: string;
  completionDate: string;
  logoUrl: string;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatCertificateDate(isoDate: string) {
  if (!isoDate) return "";
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function buildCertificateId(studentName: string, completionDate: string) {
  if (!studentName || !completionDate) return "SV-GCP-READY";
  return `SV-GCP-${completionDate.replaceAll("-", "")}-${studentName
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 6)
    .toUpperCase()}`;
}

/** Ornate wax-seal SVG — used in print layout and on-screen preview */
export function getCertificateStampSvg(size = 120) {
  const r = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120" role="img" aria-label="SkillVane verified stamp">
  <defs>
    <radialGradient id="wax" cx="38%" cy="32%" r="68%">
      <stop offset="0%" stop-color="#ffe9a8"/>
      <stop offset="45%" stop-color="#f2b84b"/>
      <stop offset="100%" stop-color="#b8860b"/>
    </radialGradient>
    <filter id="stampShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#07111f" flood-opacity="0.35"/>
    </filter>
  </defs>
  <g filter="url(#stampShadow)">
    <circle cx="60" cy="60" r="54" fill="url(#wax)" stroke="#8b6914" stroke-width="2"/>
    ${Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      const x1 = 60 + Math.cos(a) * 48;
      const y1 = 60 + Math.sin(a) * 48;
      const x2 = 60 + Math.cos(a) * 56;
      const y2 = 60 + Math.sin(a) * 56;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8b6914" stroke-width="2.5" stroke-linecap="round"/>`;
    }).join("")}
    <circle cx="60" cy="60" r="38" fill="none" stroke="#7a5f10" stroke-width="1.5" stroke-dasharray="3 2"/>
    <text x="60" y="48" text-anchor="middle" font-family="Georgia,serif" font-size="9" font-weight="700" fill="#3d2e06" letter-spacing="2">SKILLVANE</text>
    <text x="60" y="66" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="900" fill="#1a1404">VERIFIED</text>
    <text x="60" y="80" text-anchor="middle" font-family="Arial,sans-serif" font-size="7" font-weight="800" fill="#4a3a0a" letter-spacing="1.5">GCP DE · 2026</text>
  </g>
</svg>`;
}

export function buildCertificatePrintHtml(data: CertificateData) {
  const name = data.studentName.trim();
  const date = formatCertificateDate(data.completionDate);
  const id = buildCertificateId(name, data.completionDate);
  const stamp = getCertificateStampSvg(140);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(name)} — SkillVane Certificate</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@500;700;800&display=swap" rel="stylesheet"/>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #e8eef5; font-family: Inter, system-ui, sans-serif; }
    .sheet {
      width: 297mm; height: 210mm; padding: 10mm;
      background: linear-gradient(135deg, #07111f 0%, #0d2238 28%, #f4f8ff 28.1%, #ffffff 100%);
    }
    .cert {
      position: relative; height: 100%; overflow: hidden;
      border: 3px double #c9a227;
      background:
        radial-gradient(circle at 12% 18%, rgba(24,194,156,0.07), transparent 22%),
        radial-gradient(circle at 88% 82%, rgba(47,128,237,0.06), transparent 24%),
        linear-gradient(160deg, #fffef9 0%, #f8fbff 55%, #fffdf6 100%);
      padding: 14mm 16mm 16mm;
      box-shadow: inset 0 0 0 1px rgba(24,194,156,0.25), inset 0 0 0 7mm rgba(201,162,39,0.08);
    }
    .cert::before {
      content: ""; position: absolute; inset: 5mm; pointer-events: none;
      border: 1px solid rgba(24,194,156,0.35);
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23e2e8f0' stroke-width='0.5'/%3E%3C/svg%3E") repeat;
      opacity: 0.35;
    }
    .watermark {
      position: absolute; right: -8mm; bottom: 8mm; width: 70mm; opacity: 0.06;
      transform: rotate(-18deg); pointer-events: none;
    }
    .top { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: flex-start; gap: 12mm; }
    .brand { display: flex; align-items: center; gap: 4mm; }
    .brand img { width: 16mm; height: 16mm; object-fit: contain; background: #fff; border-radius: 3mm; padding: 1.5mm; border: 1px solid #dbe4ef; }
    .brand h1 { margin: 0; font-size: 5.2mm; font-weight: 800; color: #07111f; letter-spacing: 0.3px; }
    .brand p { margin: 1mm 0 0; font-size: 2.8mm; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
    .meta { text-align: right; font-size: 2.6mm; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; line-height: 1.6; }
    .body { position: relative; z-index: 2; margin-top: 10mm; text-align: center; }
    .eyebrow { font-size: 3.2mm; font-weight: 800; letter-spacing: 5px; text-transform: uppercase; color: #18a884; }
    .title { margin: 3mm 0 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16mm; font-weight: 700; color: #07111f; line-height: 1.05; }
    .rule { width: 28mm; height: 1.2mm; margin: 6mm auto; border-radius: 99px; background: linear-gradient(90deg, #18c29c, #2f80ed, #f2b84b); }
    .copy { margin: 0; font-size: 4mm; color: #64748b; }
    .name {
      display: inline-block; margin: 5mm auto 4mm; padding-bottom: 3mm;
      font-family: 'Cormorant Garamond', Georgia, serif; font-size: 13mm; font-weight: 700; font-style: italic;
      color: #07111f; border-bottom: 2px solid #c9a227; min-width: 55%;
    }
    .desc { max-width: 170mm; margin: 0 auto; font-size: 3.6mm; line-height: 1.65; color: #475569; }
    .desc strong { color: #07111f; }
    .footer {
      position: absolute; left: 16mm; right: 16mm; bottom: 14mm; z-index: 2;
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 8mm;
    }
    .sig { border-top: 1.5px solid #94a3b8; padding-top: 2.5mm; font-size: 2.6mm; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #475569; }
    .sig .sign { display: block; margin-bottom: 1.5mm; font-family: Georgia, serif; font-size: 5.5mm; font-style: italic; font-weight: 400; text-transform: none; letter-spacing: 0; color: #07111f; }
    .stamp-wrap { position: relative; display: flex; justify-content: center; }
    .stamp-wrap::after {
      content: "AUTHENTIC"; position: absolute; bottom: -2mm; left: 50%; transform: translateX(-50%);
      font-size: 2mm; font-weight: 900; letter-spacing: 2px; color: #b8860b;
    }
    .ribbon {
      position: absolute; top: 12mm; right: -18mm; width: 70mm; transform: rotate(42deg);
      background: linear-gradient(90deg, #18c29c, #2f80ed); color: #fff; text-align: center;
      font-size: 2.4mm; font-weight: 800; letter-spacing: 2px; padding: 2mm 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
  </style>
</head>
<body>
  <main class="sheet">
    <article class="cert">
      <div class="ribbon">OFFICIAL COMPLETION</div>
      <img class="watermark" src="${escapeHtml(data.logoUrl)}" alt=""/>
      <header class="top">
        <div class="brand">
          <img src="${escapeHtml(data.logoUrl)}" alt="SkillVane"/>
          <div>
            <h1>SkillVane IT Academy</h1>
            <p>Industry-focused cloud training</p>
          </div>
        </div>
        <div class="meta">Certificate ID<br/><span style="color:#07111f">${escapeHtml(id)}</span></div>
      </header>
      <div class="body">
        <p class="eyebrow">Certificate of Completion</p>
        <h2 class="title">GCP Data Engineering</h2>
        <div class="rule"></div>
        <p class="copy">This is to certify that</p>
        <div class="name">${escapeHtml(name)}</div>
        <p class="desc">has successfully completed the <strong>GCP Data Engineering</strong> training program at SkillVane IT Academy, demonstrating proficiency in BigQuery, Dataflow, Dataproc, Cloud Composer, production pipelines, and real-world data engineering projects.</p>
      </div>
      <footer class="footer">
        <div class="sig">Completion Date<br/>${escapeHtml(date)}</div>
        <div class="stamp-wrap">${stamp}</div>
        <div class="sig" style="text-align:right"><span class="sign">Shaik Saidhul</span>Lead Instructor &amp; Founder</div>
      </footer>
    </article>
  </main>
  <script>window.onload=()=>{window.focus();window.print();}</script>
</body>
</html>`;
}

export function openCertificatePrintWindow(data: CertificateData) {
  const html = buildCertificatePrintHtml(data);
  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  return true;
}
