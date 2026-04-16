import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import DeleteQuizButton from "@/components/quiz/DeleteQuizButton";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { canManageQuiz, MANAGER_ROLES, SAFE_USER_SELECT } from "@/lib/constants";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function QuizDetailsDashboardPage({ params }) {
  const user = await requireRole(MANAGER_ROLES);

  const quiz = await db.quiz.findUnique({
    where: { id: params.quizId },
    include: {
      createdBy: {
        select: SAFE_USER_SELECT
      },
      questions: true,
      attempts: {
        include: {
          user: {
            select: SAFE_USER_SELECT
          }
        },
        orderBy: {
          submittedAt: "desc"
        }
      },
      _count: {
        select: {
          questions: true,
          attempts: true
        }
      }
    }
  });

  if (!quiz) notFound();
  if (!canManageQuiz(user, quiz)) notFound();

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="primary">{quiz.category}</Badge>
              <Badge variant={quiz.isPublished ? "success" : "warning"}>
                {quiz.isPublished ? "Published" : "Draft"}
              </Badge>
              <Badge variant="info">{quiz.difficulty}</Badge>
            </div>

            <h2 className="mt-4 text-2xl font-black">{quiz.title}</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              {quiz.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <div className="surface-muted p-4">
                <p className="text-xs text-slate-500">Questions</p>
                <p className="mt-2 text-xl font-black">{quiz._count.questions}</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs text-slate-500">Attempts</p>
                <p className="mt-2 text-xl font-black">{quiz._count.attempts}</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs text-slate-500">Duration</p>
                <p className="mt-2 text-xl font-black">{quiz.duration}m</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-xs text-slate-500">Created</p>
                <p className="mt-2 text-sm font-semibold">{formatDate(quiz.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/dashboard/quizzes/${quiz.id}/edit`} className="btn-primary">
              Edit quiz
            </Link>
            <DeleteQuizButton quizId={quiz.id} />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Questions</h3>
          <div className="mt-5 space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  Question {index + 1}
                </p>
                <h4 className="mt-2 font-semibold">{question.question}</h4>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Correct: {question.correctAnswer} / Marks: {question.marks}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">Attempts</h3>
          <div className="mt-5 space-y-4">
            {quiz.attempts.length ? (
              quiz.attempts.map((attempt) => (
                <div key={attempt.id} className="surface-muted p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{attempt.user.name}</h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {attempt.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-teal-600">
                        {attempt.score}/{attempt.totalMarks}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(attempt.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No attempts submitted yet.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
