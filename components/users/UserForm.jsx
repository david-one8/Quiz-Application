"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { userCreateSchema } from "@/lib/validations";
import { USER_ROLE_OPTIONS } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function UserForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: "TEACHER"
    }
  });

  const onSubmit = async (values) => {
    try {
      setServerError("");
      await axios.post("/api/users", values);
      reset({
        name: "",
        email: "",
        password: "",
        role: "TEACHER"
      });
      router.refresh();
    } catch (error) {
      setServerError(error?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" error={errors.email?.message} {...register("email")} />
      <Input
        label="Temporary password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <select className="input" {...register("role")}>
          {USER_ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {serverError ? <p className="text-sm text-rose-500">{serverError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create user"}
      </Button>
    </form>
  );
}
