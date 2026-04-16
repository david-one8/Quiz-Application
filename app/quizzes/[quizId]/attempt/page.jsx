import AttemptQuizPage from "@/components/quiz/AttemptQuizPage";
import { requireInitializedApp } from "@/lib/bootstrap";

export default async function AttemptQuizRoutePage() {
  await requireInitializedApp();

  return <AttemptQuizPage />;
}
