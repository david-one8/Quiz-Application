import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { attemptSchema } from "@/lib/validations";
import { canManageQuiz, SAFE_USER_SELECT } from "@/lib/constants";
import { getInitializationErrorResponse } from "@/lib/bootstrap";
import { ZodError } from "zod";

export async function GET() {
  const initializationError = await getInitializationErrorResponse();

  if (initializationError) {
    return initializationError;
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const where =
    session.user.role === "ADMIN"
      ? {}
      : session.user.role === "TEACHER"
        ? {
            quiz: {
              createdById: session.user.id
            }
          }
        : {
            userId: session.user.id
          };

  const attempts = await db.attempt.findMany({
    where,
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          category: true,
          difficulty: true,
          duration: true
        }
      },
      user: {
        select: SAFE_USER_SELECT
      }
    },
    orderBy: { submittedAt: "desc" }
  });

  return NextResponse.json(attempts);
}

export async function POST(req) {
  try {
    const initializationError = await getInitializationErrorResponse();

    if (initializationError) {
      return initializationError;
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = attemptSchema.parse(body);

    const quiz = await db.quiz.findUnique({
      where: { id: validated.quizId },
      include: {
        questions: true
      }
    });

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    if (!quiz.isPublished && !canManageQuiz(session.user, quiz)) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    if (!quiz.questions.length) {
      return NextResponse.json({ message: "Quiz has no questions" }, { status: 400 });
    }

    let score = 0;
    let totalMarks = 0;

    quiz.questions.forEach((question) => {
      totalMarks += question.marks;
      if (validated.answers[question.id] === question.correctAnswer) {
        score += question.marks;
      }
    });

    const attempt = await db.attempt.create({
      data: {
        quizId: validated.quizId,
        userId: session.user.id,
        score,
        totalMarks,
        answers: validated.answers
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            duration: true
          }
        },
        user: {
          select: SAFE_USER_SELECT
        }
      }
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid attempt data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: error?.message || "Failed to submit attempt" }, { status: 500 });
  }
}
