"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return <div className="h-11 w-11 rounded-2xl border border-slate-200 dark:border-slate-700" />;
  }

  const current = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      {current === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
