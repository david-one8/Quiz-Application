import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questionSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageQuiz, isManager } from "@/lib/constants";
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
  if (!isManager(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const where =
    session.user.role === "ADMIN"
      ? {}
      : {
          quiz: {
            createdById: session.user.id
          }
        };

  const questions = await db.question.findMany({
    where,
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          createdById: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(questions);
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
    if (!isManager(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = questionSchema.parse(body);

    const quiz = await db.quiz.findUnique({
      where: { id: validated.quizId },
      select: {
        id: true,
        createdById: true
      }
    });

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    if (!canManageQuiz(session.user, quiz)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const question = await db.question.create({
      data: validated
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid question data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: error?.message || "Failed to add question" }, { status: 500 });
  }
}
