"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, CircleHelp, PenSquare, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";
import Logo from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { DASHBOARD_LINKS } from "@/lib/constants";

const icons = {
  "/dashboard": LayoutDashboard,
  "/dashboard/quizzes": FileText,
  "/dashboard/questions": CircleHelp,
  "/dashboard/attempts": PenSquare,
  "/dashboard/results": Trophy
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role ?? "STUDENT";

  const items = DASHBOARD_LINKS.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200/70 bg-white/80 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 lg:block">
      <Logo />
      <nav className="mt-10 space-y-2">
        {items.map((item) => {
          const Icon = icons[item.href];
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
