import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import QuizForm from "@/components/quiz/QuizForm";
import { db } from "@/lib/db";
import { canManageQuiz, MANAGER_ROLES } from "@/lib/constants";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EditQuizPage({ params }) {
  const user = await requireRole(MANAGER_ROLES);
  const { quizId } = await params;

  const quiz = await db.quiz.findUnique({
    where: { id: quizId }
  });

  if (!quiz) notFound();
  if (!canManageQuiz(user, quiz)) notFound();

  return (
    <Card className="max-w-3xl">
      <h2 className="text-lg font-semibold">Edit quiz</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Update quiz content, duration, category, and publication state.
      </p>
      <div className="mt-6">
        <QuizForm initialData={quiz} />
      </div>
    </Card>
  );
}
