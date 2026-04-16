import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/shared/Logo";
import { requireInitializedApp } from "@/lib/bootstrap";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await requireInitializedApp();

  const [publishedQuizzes, questionCount, attemptCount, userCount] = await Promise.all([
    db.quiz.count({ where: { isPublished: true } }),
    db.question.count(),
    db.attempt.count(),
    db.user.count()
  ]);

  const stats = [
    [publishedQuizzes, "Published quizzes"],
    [questionCount, "Questions in bank"],
    [attemptCount, "Attempts recorded"],
    [userCount, "Registered users"]
  ];

  return (
    <main className="app-shell min-h-screen">
      <section className="container-app py-6 sm:py-8">
        <div className="surface p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
            </div>
          </div>
        </div>

        <div className="grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
          <div>
            <span className="inline-flex rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
              Smart quiz workflow for institutes and educators
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl">
              Create, publish, manage and evaluate quizzes with one seamless platform.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              QuizNova helps teachers, admins, and students manage the complete quiz lifecycle
              from quiz creation to attempts and results.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary">
                Get started
              </Link>
              <Link href="/quizzes" className="btn-secondary">
                Explore quizzes
              </Link>
            </div>
          </div>

          <div className="surface p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map(([value, label]) => (
                <div key={label} className="surface-muted p-5">
                  <p className="text-3xl font-black text-teal-600">{value}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
