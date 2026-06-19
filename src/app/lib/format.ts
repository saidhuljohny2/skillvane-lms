export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function generateInvoiceNo() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `SV-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
