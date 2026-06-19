import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-slate-400 ${className}`}
      />
    );
  }

  const isDark = (resolvedTheme ?? theme) !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`theme-toggle flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-slate-300 transition-all hover:border-[#f2b84b]/40 hover:text-white ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
