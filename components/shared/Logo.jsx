export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
          <path d="M4 7 12 4l8 3-8 3-8-3Z" />
          <path d="M6 10v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
          <path d="M20 7v6" />
        </svg>
      </div>
      <div>
        <p className="text-base font-bold tracking-tight">QuizNova</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage. Publish. Evaluate.</p>
      </div>
    </div>
  );
}