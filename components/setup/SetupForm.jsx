"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setupSchema } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SetupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(setupSchema)
  });

  const onSubmit = async (values) => {
    try {
      setServerError("");
      await axios.post("/api/setup", values);
      router.push("/login");
    } catch (error) {
      setServerError(error?.response?.data?.message || "Setup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <Input
        label="Admin name"
        placeholder="Enter full name"
        error={errors.name?.message}
        autoComplete="name"
        {...register("name")}
      />
      <Input
        label="Admin email"
        type="email"
        placeholder="Enter work email"
        error={errors.email?.message}
        autoComplete="email"
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Create password"
        error={errors.password?.message}
        autoComplete="new-password"
        {...register("password")}
      />

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          {...register("seed")}
        />
        <div>
          <p className="text-sm font-semibold">Populate with sample data</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automatically create demo quizzes and questions to explore the platform.
          </p>
        </div>
      </label>

      {serverError ? <p className="text-sm text-rose-500">{serverError}</p> : null}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Create first admin
      </Button>
    </form>
  );
}
