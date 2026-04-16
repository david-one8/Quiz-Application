"use client";

export default function DashboardError({ error, reset }) {
  console.error(error);

  return (
    <div className="surface mx-auto max-w-2xl p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/10 text-rose-600">
        !
      </div>
      <h2 className="mt-4 text-xl font-bold">Dashboard failed to load</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Some dashboard content could not be rendered right now.
      </p>
      <button onClick={reset} className="btn-primary mt-6">
        Retry dashboard
      </button>
    </div>
  );
}