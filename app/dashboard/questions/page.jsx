import Card from "@/components/ui/Card";
import QuestionForm from "@/components/quiz/QuestionForm";
import DeleteQuestionButton from "@/components/quiz/DeleteQuestionButton";
import { db } from "@/lib/db";
import { MANAGER_ROLES } from "@/lib/constants";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const user = await requireRole(MANAGER_ROLES);

  const quizzes = await db.quiz.findMany({
    where: user.role === "ADMIN" ? {} : { createdById: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true
    }
  });

  const questions = await db.question.findMany({
    where:
      user.role === "ADMIN"
        ? {}
        : {
            quiz: {
              createdById: user.id
            }
          },
    include: {
      quiz: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
      <Card>
        <h2 className="text-lg font-semibold">Add question</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Attach new questions to any existing quiz.
        </p>
        <div className="mt-6">
          <QuestionForm quizzes={quizzes} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Question bank</h2>
        <div className="mt-5 space-y-4">
          {questions.map((item, index) => (
            <div key={item.id} className="surface-muted p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                    {item.quiz.title} / Q{index + 1}
                  </p>
                  <h3 className="mt-2 font-semibold">{item.question}</h3>
                  <div className="mt-3 grid gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <p>A. {item.optionA}</p>
                    <p>B. {item.optionB}</p>
                    <p>C. {item.optionC}</p>
                    <p>D. {item.optionD}</p>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-emerald-600">
                    Correct answer: {item.correctAnswer}
                  </p>
                </div>

                <DeleteQuestionButton questionId={item.id} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
