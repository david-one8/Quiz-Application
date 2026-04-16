"use client";

import ThemeToggle from "@/components/ui/ThemeToggle";
import { signOut, useSession } from "next-auth/react";

export default function Header({ title, description }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 sm:block">
            {session?.user?.name || "User"}{" "}
            {session?.user?.role ? (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({session.user.role})
              </span>
            ) : null}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
