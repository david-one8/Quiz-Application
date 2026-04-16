"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AttemptQuestion from "@/components/quiz/AttemptQuestion";
import Loader from "@/components/ui/Loader";

export default function AttemptQuizPage() {
  const params = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getQuiz = async () => {
      try {
        setError("");
        const res = await axios.get(`/api/quizzes/${params.quizId}`);
        setQuiz(res.data);
        setTimeLeft((res.data.duration || 0) * 60);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    getQuiz();
  }, [params.quizId]);

  useEffect(() => {
    if (!timeLeft || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return;

    try {
      setSubmitting(true);
      setError("");

      await axios.post("/api/attempts", {
        quizId: quiz.id,
        answers
      });

      router.push("/dashboard/results");
      router.refresh();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to submit attempt");
      setSubmitting(false);
    }
  }, [answers, quiz, router, submitting]);

  useEffect(() => {
    if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [handleSubmit, timeLeft, quiz]);

  const handleSelect = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const formattedTime = useMemo(() => {
    if (timeLeft === null) return "00:00";
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }, [timeLeft]);

  if (loading) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center p-6">
        <Loader text="Loading quiz..." />
      </main>
    );
  }

  if (!quiz) {
    return <main className="p-6">{error || "Quiz not found"}</main>;
  }

  return (
    <main className="app-shell min-h-screen">
      <section className="container-app py-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Complete all questions before time runs out.
            </p>
          </div>
          <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-600">
            Time left: {formattedTime}
          </div>
        </div>

        <div className="space-y-5">
          {quiz.questions.map((question, index) => (
            <AttemptQuestion
              key={question.id}
              index={index}
              question={question}
              selectedAnswer={answers[question.id]}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
            {submitting ? "Submitting..." : "Submit attempt"}
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
            Answered {Object.keys(answers).length} / {quiz.questions.length}
          </div>
        </div>
      </section>
    </main>
  );
}
