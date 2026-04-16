"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, CircleHelp, PenSquare, Trophy, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { DASHBOARD_LINKS } from "@/lib/constants";

const icons = {
  "/dashboard": LayoutDashboard,
  "/dashboard/quizzes": FileText,
  "/dashboard/questions": CircleHelp,
  "/dashboard/users": Users,
  "/dashboard/attempts": PenSquare,
  "/dashboard/results": Trophy
};

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role ?? "STUDENT";

  const items = DASHBOARD_LINKS.filter((item) => item.roles.includes(role));

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
      <div
        className={`grid gap-2 ${
          items.length >= 6
            ? "grid-cols-3"
            : items.length === 3
              ? "grid-cols-3"
              : items.length === 4
                ? "grid-cols-4"
                : "grid-cols-5"
        }`}
      >
        {items.map((item) => {
          const Icon = icons[item.href];
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[52px] flex-col items-center justify-center rounded-2xl text-[11px] font-medium",
                active ? "bg-teal-600 text-white" : "text-slate-500 dark:text-slate-400"
              )}
            >
              <Icon size={16} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
