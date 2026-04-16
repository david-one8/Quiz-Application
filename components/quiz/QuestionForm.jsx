"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuestionForm({ quizzes }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      correctAnswer: "A",
      marks: 1
    }
  });

  const onSubmit = async (values) => {
    try {
      setServerError("");
      await axios.post("/api/questions", values);
      reset();
      router.refresh();
    } catch (error) {
      setServerError(error?.response?.data?.message || "Failed to add question");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Quiz</label>
        <select className="input" {...register("quizId")}>
          <option value="">Select quiz</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title}
            </option>
          ))}
        </select>
        {errors.quizId?.message ? <p className="text-sm text-rose-500">{errors.quizId.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Question</label>
        <textarea rows="4" className="input" {...register("question")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Option A" {...register("optionA")} />
        <Input label="Option B" {...register("optionB")} />
        <Input label="Option C" {...register("optionC")} />
        <Input label="Option D" {...register("optionD")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Correct answer</label>
          <select className="input" {...register("correctAnswer")}>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>
        </div>
        <Input label="Marks" type="number" {...register("marks")} />
      </div>

      {serverError ? <p className="text-sm text-rose-500">{serverError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add question"}
      </Button>
    </form>
  );
}
