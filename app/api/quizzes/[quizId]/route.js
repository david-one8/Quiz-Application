import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageQuiz, isManager, PUBLIC_USER_SELECT } from "@/lib/constants";
import { getInitializationErrorResponse } from "@/lib/bootstrap";
import { quizSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function GET(_, { params }) {
  try {
    const initializationError = await getInitializationErrorResponse();

    if (initializationError) {
      return initializationError;
    }

    const { quizId } = await params;

    const session = await getServerSession(authOptions);
    const user = session?.user ?? null;

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        createdBy: {
          select: PUBLIC_USER_SELECT
        },
        questions: true,
        _count: {
          select: {
            questions: true,
            attempts: true
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    const canViewDraft = canManageQuiz(user, quiz);

    if (!quiz.isPublished && !canViewDraft) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    if (!canViewDraft) {
      return NextResponse.json({
        ...quiz,
        questions: quiz.questions.map(({ correctAnswer, ...question }) => question)
      });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch quiz" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const initializationError = await getInitializationErrorResponse();

    if (initializationError) {
      return initializationError;
    }

    const { quizId } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!isManager(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const existingQuiz = await db.quiz.findUnique({
      where: { id: quizId },
      select: { id: true, createdById: true }
    });

    if (!existingQuiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    if (!canManageQuiz(session.user, existingQuiz)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = quizSchema.parse(body);

    const updated = await db.quiz.update({
      where: { id: quizId },
      data: {
        ...validated
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid quiz data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Failed to update quiz" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const initializationError = await getInitializationErrorResponse();

    if (initializationError) {
      return initializationError;
    }

    const { quizId } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!isManager(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const existingQuiz = await db.quiz.findUnique({
      where: { id: quizId },
      select: { id: true, createdById: true }
    });

    if (!existingQuiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    if (!canManageQuiz(session.user, existingQuiz)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.quiz.delete({
      where: { id: quizId }
    });

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete quiz" }, { status: 500 });
  }
}
