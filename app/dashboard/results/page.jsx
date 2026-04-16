import ResultCard from "@/components/quiz/ResultCard";
import EmptyState from "@/components/shared/EmptyState";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { SAFE_USER_SELECT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
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
      user: {
        select: SAFE_USER_SELECT
      },
      quiz: {
        select: {
          id: true,
          title: true,
          category: true,
          difficulty: true,
          duration: true
        }
      }
    },
    orderBy: { submittedAt: "desc" }
  });

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Results</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Performance snapshots for submitted quizzes.
        </p>
      </div>

      {attempts.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {attempts.map((attempt) => (
            <ResultCard key={attempt.id} attempt={attempt} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No results yet"
          description="Submitted attempts will appear here once a quiz has been completed."
        />
      )}
    </div>
  );
}
