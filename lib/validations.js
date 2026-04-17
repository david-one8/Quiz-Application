import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const setupSchema = registerSchema.extend({
  seed: z.boolean().optional()
});

export const userCreateSchema = registerSchema.extend({
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"])
});

export const userRoleSchema = z.object({
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"])
});

export const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  duration: z.coerce.number().min(1),
  isPublished: z.boolean().optional()
});

export const questionSchema = z.object({
  quizId: z.string().min(1),
  question: z.string().min(5),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  marks: z.coerce.number().min(1)
});

export const questionUpdateSchema = questionSchema.omit({ quizId: true }).partial();

export const attemptSchema = z.object({
  quizId: z.string().min(1),
  answers: z.record(z.string(), z.enum(["A", "B", "C", "D"])).default({})
});
