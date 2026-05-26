import "./globals.css";

export const metadata = {
  title: "SkillVane IT academy",
  description: "GCP Data Engineering Training Program"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
