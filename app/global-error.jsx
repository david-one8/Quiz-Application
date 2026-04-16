"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white">
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-500/10 text-rose-400">
              !
            </div>
            <h1 className="mt-5 text-2xl font-black">Critical application error</h1>
            <p className="mt-3 text-sm text-slate-400">
              QuizNova hit a fatal error while rendering the application shell.
            </p>
            <button onClick={reset} className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white">
              Retry application
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}