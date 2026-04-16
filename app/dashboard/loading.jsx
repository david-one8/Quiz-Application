export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white xl:col-span-2 dark:border-slate-800 dark:bg-slate-900" />
        <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      </div>
    </div>
  );
}