import QuizCard from "@/components/quiz/QuizCard";
import { requireInitializedApp } from "@/lib/bootstrap";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PublicQuizPage() {
  await requireInitializedApp();

  const quizzes = await db.quiz.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          questions: true,
          attempts: true
        }
      }
    }
  });

  return (
    <main className="app-shell min-h-screen">
      <section className="container-app py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Published quizzes</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Browse available quizzes and begin when ready.
          </p>
        </div>

        {quizzes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="surface flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-500/10 text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold">No quizzes found</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              There are no published quizzes available at the moment. Please check back later.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
