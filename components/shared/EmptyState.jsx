export default function EmptyState({ title, description, action }) {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-teal-600">
        <span className="text-2xl">?</span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}