"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (values) => {
    try {
      setServerError("");
      await axios.post("/api/register", values);
      router.push("/login");
    } catch (error) {
      setServerError(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="surface w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Start using QuizNova in a few seconds.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Name" placeholder="Enter name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" placeholder="Enter email" error={errors.email?.message} {...register("email")} />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register("password")}
          />

          {serverError ? <p className="text-sm text-rose-500">{serverError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          New accounts are created as student accounts by default.
        </p>

        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
