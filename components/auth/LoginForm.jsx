"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = async (values) => {
    try {
      setServerError("");
      console.log("Attempting sign in with:", values.email);

      const res = await signIn("credentials", {
        ...values,
        redirect: false
      });

      console.log("Sign in response:", res);

      if (res?.error) {
        setServerError(res.error);
        return;
      }

      if (res?.ok) {
        console.log("Login successful, redirecting to dashboard...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login component error:", error);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="surface w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Login to manage quizzes and track performance.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" placeholder="Enter email" {...register("email")} />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />

          {serverError ? <p className="text-sm text-rose-500">{serverError}</p> : null}

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Login
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-teal-600">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
