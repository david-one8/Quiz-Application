import Link from "next/link";
import QuizCard from "@/components/quiz/QuizCard";
import EmptyState from "@/components/shared/EmptyState";
import { db } from "@/lib/db";
import { MANAGER_ROLES } from "@/lib/constants";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function QuizzesPage() {
  const user = await requireRole(MANAGER_ROLES);

  const quizzes = await db.quiz.findMany({
    where: user.role === "ADMIN" ? {} : { createdById: user.id },
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

  if (!quizzes.length) {
    return (
      <EmptyState
        title="No quizzes yet"
        description="Create your first quiz to start building the assessment workflow."
        action={
          <Link href="/dashboard/quizzes/create" className="btn-primary">
            Create first quiz
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">All quizzes</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage drafts, published quizzes, and activity counts.
          </p>
        </div>
        <Link href="/dashboard/quizzes/create" className="btn-primary">
          Create quiz
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} dashboard />
        ))}
      </div>
    </div>
  );
}
