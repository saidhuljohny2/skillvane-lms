import { SiteHeader } from '@/components/site-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
