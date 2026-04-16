"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4">
      <div className="surface w-full max-w-lg p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-500/10 text-rose-600">
          !
        </div>

        <h1 className="mt-5 text-2xl font-black">Something went wrong</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          An unexpected error occurred while loading this page.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}