import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4">
      <div className="surface max-w-lg p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-500/10 text-rose-600">
          404
        </div>
        <h1 className="mt-5 text-2xl font-black">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          The page you are trying to open does not exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}