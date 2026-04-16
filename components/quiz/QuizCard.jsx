import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function QuizCard({ quiz, dashboard = false }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="primary">{quiz.category}</Badge>
          <h3 className="mt-3 text-lg font-bold">{quiz.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
            {quiz.description}
          </p>
        </div>
        <Badge variant={quiz.isPublished ? "success" : "warning"}>
          {quiz.isPublished ? "Published" : "Draft"}
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="surface-muted p-3 text-center">
          <p className="text-lg font-bold">{quiz._count?.questions || 0}</p>
          <p className="text-xs text-slate-500">Questions</p>
        </div>
        <div className="surface-muted p-3 text-center">
          <p className="text-lg font-bold">{quiz.duration}</p>
          <p className="text-xs text-slate-500">Minutes</p>
        </div>
        <div className="surface-muted p-3 text-center">
          <p className="text-lg font-bold">{quiz._count?.attempts || 0}</p>
          <p className="text-xs text-slate-500">Attempts</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {dashboard ? (
          <>
            <Link href={`/dashboard/quizzes/${quiz.id}`} className="btn-secondary flex-1">
              View
            </Link>
            <Link href={`/dashboard/quizzes/${quiz.id}/edit`} className="btn-primary flex-1">
              Edit
            </Link>
          </>
        ) : (
          <>
            <Link href={`/quizzes/${quiz.id}`} className="btn-secondary flex-1">
              Details
            </Link>
            <Link href={`/quizzes/${quiz.id}/attempt`} className="btn-primary flex-1">
              Start now
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}