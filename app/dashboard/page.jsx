import Card from "@/components/ui/Card";
import Link from "next/link";
import { db } from "@/lib/db";
import { isManager, SAFE_USER_SELECT } from "@/lib/constants";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const manager = isManager(user.role);

  const quizWhere = manager
    ? user.role === "ADMIN"
      ? {}
      : { createdById: user.id }
    : { isPublished: true };

  const questionWhere = manager
    ? user.role === "ADMIN"
      ? {}
      : {
          quiz: {
            createdById: user.id
          }
        }
    : {};

  const attemptWhere = manager
    ? user.role === "ADMIN"
      ? {}
      : {
          quiz: {
            createdById: user.id
          }
        }
    : { userId: user.id };

  const [quizCount, questionCount, attemptCount, userCount, recentAttempts, recentQuizzes, bestAttempt] =
    await Promise.all([
      db.quiz.count({ where: quizWhere }),
      db.question.count({ where: questionWhere }),
      db.attempt.count({ where: attemptWhere }),
      db.user.count({
        where: manager
          ? user.role === "ADMIN"
            ? {}
            : { role: "STUDENT" }
          : { id: user.id }
      }),
      db.attempt.findMany({
        where: attemptWhere,
        take: 5,
        orderBy: { submittedAt: "desc" },
        include: {
          user: {
            select: SAFE_USER_SELECT
          },
          quiz: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      db.quiz.findMany({
        where: manager ? quizWhere : { isPublished: true },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { questions: true, attempts: true }
          }
        }
      }),
      db.attempt.findFirst({
        where: { userId: user.id },
        orderBy: [
          { score: "desc" },
          { totalMarks: "desc" },
          { submittedAt: "desc" }
        ]
      })
    ]);

  const stats = manager
    ? [
        { title: "Total Quizzes", value: quizCount, color: "text-teal-600" },
        { title: "Questions", value: questionCount, color: "text-sky-600" },
        { title: "Attempts", value: attemptCount, color: "text-violet-600" },
        { title: "Users", value: userCount, color: "text-amber-600" }
      ]
    : [
        { title: "Published Quizzes", value: quizCount, color: "text-teal-600" },
        { title: "My Attempts", value: attemptCount, color: "text-violet-600" },
        {
          title: "Best Score",
          value: bestAttempt ? `${bestAttempt.score}/${bestAttempt.totalMarks}` : "N/A",
          color: "text-sky-600"
        },
        { title: "Role", value: user.role, color: "text-amber-600" }
      ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title}>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
            <p className={`mt-3 text-3xl font-black ${item.color}`}>{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {manager ? "Recent quizzes" : "Available quizzes"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {manager
                  ? "Newest quizzes from your workspace."
                  : "Published quizzes you can attempt right away."}
              </p>
            </div>
            <Link href={manager ? "/dashboard/quizzes" : "/quizzes"} className="btn-secondary">
              View all
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recentQuizzes.length ? (
              recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="surface-muted p-4">
                  <h3 className="font-semibold">{quiz.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {quiz.category} / {quiz.difficulty}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{quiz._count.questions} questions</span>
                    <span>{quiz._count.attempts} attempts</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="surface-muted p-4 text-sm text-slate-500 dark:text-slate-400">
                No quizzes available yet.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">{manager ? "Quick actions" : "Next steps"}</h2>
          <div className="mt-5 space-y-3">
            {manager ? (
              <>
                <Link href="/dashboard/quizzes/create" className="btn-primary w-full">
                  Create quiz
                </Link>
                <Link href="/dashboard/questions" className="btn-secondary w-full">
                  Add question
                </Link>
                <Link href="/dashboard/results" className="btn-secondary w-full">
                  Open results
                </Link>
              </>
            ) : (
              <>
                <Link href="/quizzes" className="btn-primary w-full">
                  Explore quizzes
                </Link>
                <Link href="/dashboard/attempts" className="btn-secondary w-full">
                  View attempts
                </Link>
                <Link href="/dashboard/results" className="btn-secondary w-full">
                  Check results
                </Link>
              </>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-teal-500/10 p-4 text-sm text-teal-700 dark:text-teal-300">
            {manager
              ? "Publish quizzes only after final question review so student attempts stay clean and consistent."
              : "Your latest attempts and scores stay available here after you submit a quiz."}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">
          {manager ? "Recent attempts" : "My recent attempts"}
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800">
              <tr>
                {manager ? <th className="px-3 py-3">Student</th> : null}
                <th className="px-3 py-3">Quiz</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentAttempts.length ? (
                recentAttempts.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-900">
                    {manager ? <td className="px-3 py-4">{item.user.name}</td> : null}
                    <td className="px-3 py-4">{item.quiz.title}</td>
                    <td className="px-3 py-4 font-semibold text-teal-600">{item.score}</td>
                    <td className="px-3 py-4">{item.totalMarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-3 py-4 text-slate-500 dark:text-slate-400"
                    colSpan={manager ? 4 : 3}
                  >
                    No attempts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
