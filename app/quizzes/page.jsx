import QuizCard from "@/components/quiz/QuizCard";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PublicQuizPage() {
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>
    </main>
  );
}
