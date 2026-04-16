import Card from "@/components/ui/Card";
import QuizForm from "@/components/quiz/QuizForm";
import { MANAGER_ROLES } from "@/lib/constants";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CreateQuizPage() {
  await requireRole(MANAGER_ROLES);

  return (
    <Card className="max-w-3xl">
      <h2 className="text-lg font-semibold">Create a new quiz</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Add the main quiz information first, then attach questions.
      </p>
      <div className="mt-6">
        <QuizForm />
      </div>
    </Card>
  );
}
