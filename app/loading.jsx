export default function Loading() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4">
      <div className="surface flex w-full max-w-md flex-col items-center justify-center p-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600 dark:border-slate-700 dark:border-t-teal-400" />
        <h2 className="mt-5 text-xl font-bold">Loading QuizNova</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Preparing your quiz workspace...
        </p>
      </div>
    </main>
  );
}