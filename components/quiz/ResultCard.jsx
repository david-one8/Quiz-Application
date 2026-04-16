import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDateTime, getPercentage } from "@/lib/format";

export default function ResultCard({ attempt }) {
  const percentage = getPercentage(attempt.score, attempt.totalMarks);

  const variant =
    percentage >= 75 ? "success" : percentage >= 40 ? "warning" : "danger";

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{attempt.quiz.title}</p>
          <h3 className="mt-1 text-lg font-bold">{attempt.user.name}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Submitted on {formatDateTime(attempt.submittedAt)}
          </p>
        </div>
        <Badge variant={variant}>{percentage}%</Badge>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="surface-muted p-4 text-center">
          <p className="text-xl font-black text-teal-600">{attempt.score}</p>
          <p className="text-xs text-slate-500">Score</p>
        </div>
        <div className="surface-muted p-4 text-center">
          <p className="text-xl font-black">{attempt.totalMarks}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
        <div className="surface-muted p-4 text-center">
          <p className="text-xl font-black">{percentage}%</p>
          <p className="text-xs text-slate-500">Percent</p>
        </div>
      </div>
    </Card>
  );
}