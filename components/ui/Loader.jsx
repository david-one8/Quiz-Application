export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
      <p className="text-sm text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}