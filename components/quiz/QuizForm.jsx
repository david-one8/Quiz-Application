"use client";

import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema } from "@/lib/validations";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuizForm({ initialData }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      category: "",
      difficulty: "EASY",
      duration: 10,
      isPublished: false
    }
  });

  const onSubmit = async (values) => {
    try {
      setServerError("");
      if (initialData?.id) {
        await axios.put(`/api/quizzes/${initialData.id}`, values);
      } else {
        await axios.post("/api/quizzes", values);
      }
      router.push("/dashboard/quizzes");
      router.refresh();
    } catch (error) {
      setServerError(error?.response?.data?.message || "Failed to save quiz");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Quiz title" error={errors.title?.message} {...register("title")} />
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea rows="4" className="input" {...register("description")} />
        {errors.description?.message ? (
          <p className="text-sm text-rose-500">{errors.description.message}</p>
        ) : null}
      </div>
      <Input label="Category" error={errors.category?.message} {...register("category")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <select className="input" {...register("difficulty")}>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <Input label="Duration (minutes)" type="number" error={errors.duration?.message} {...register("duration")} />
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <input type="checkbox" {...register("isPublished")} />
        <span className="text-sm font-medium">Publish immediately</span>
      </label>
      {serverError ? <p className="text-sm text-rose-500">{serverError}</p> : null}
      <Button type="submit" loading={isSubmitting}>
        {initialData?.id ? "Update quiz" : "Create quiz"}
      </Button>
    </form>
  );
}
