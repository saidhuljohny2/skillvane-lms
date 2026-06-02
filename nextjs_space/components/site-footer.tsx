import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">SkillVane IT Academy</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SkillVane IT Academy
          </p>
        </div>
      </div>
    </footer>
  );
}
