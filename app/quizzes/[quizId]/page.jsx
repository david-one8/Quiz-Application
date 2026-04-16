import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { requireInitializedApp } from "@/lib/bootstrap";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function QuizDetailsPage({ params }) {
  await requireInitializedApp();
  const { quizId } = await params;

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      _count: {
        select: {
          questions: true
        }
      }
    }
  });

  if (!quiz || !quiz.isPublished) notFound();

  return (
    <main className="app-shell min-h-screen">
      <section className="container-app py-10">
        <Card className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary">{quiz.category}</Badge>
            <Badge variant="info">{quiz.difficulty}</Badge>
            <Badge variant="default">{quiz.duration} min</Badge>
          </div>

          <h1 className="mt-5 text-3xl font-black">{quiz.title}</h1>
          <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            {quiz.description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Questions</p>
              <p className="mt-2 text-xl font-black">{quiz._count.questions}</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Duration</p>
              <p className="mt-2 text-xl font-black">{quiz.duration} min</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Level</p>
              <p className="mt-2 text-xl font-black">{quiz.difficulty}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/quizzes/${quiz.id}/attempt`} className="btn-primary">
              Start quiz
            </Link>
            <Link href="/quizzes" className="btn-secondary">
              Back to quizzes
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
