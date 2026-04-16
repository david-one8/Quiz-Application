import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/shared/EmptyState";
import { db } from "@/lib/db";
import { formatDateTime, getPercentage } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { SAFE_USER_SELECT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AttemptsPage() {
  const user = await requireUser();

  const attempts = await db.attempt.findMany({
    where:
      user.role === "ADMIN"
        ? {}
        : user.role === "TEACHER"
          ? {
              quiz: {
                createdById: user.id
              }
            }
          : {
              userId: user.id
            },
    include: {
      quiz: {
        select: {
          id: true,
          title: true
        }
      },
      user: {
        select: SAFE_USER_SELECT
      }
    },
    orderBy: {
      submittedAt: "desc"
    }
  });

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Attempt history</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review submitted quiz attempts from your accessible workspace.
        </p>
      </div>

      {attempts.length ? (
        <div className="space-y-4">
          {attempts.map((attempt) => {
            const percentage = getPercentage(attempt.score, attempt.totalMarks);

            return (
              <div
                key={attempt.id}
                className="surface-muted flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold">{attempt.user.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {attempt.quiz.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(attempt.submittedAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black text-teal-600">
                      {attempt.score}/{attempt.totalMarks}
                    </p>
                    <p className="text-xs text-slate-500">Score</p>
                  </div>
                  <Badge
                    variant={
                      percentage >= 75 ? "success" : percentage >= 40 ? "warning" : "danger"
                    }
                  >
                    {percentage}%
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No attempts yet"
          description="Attempt history will appear here after quizzes are submitted."
        />
      )}
    </Card>
  );
}
