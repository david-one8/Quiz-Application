import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageQuiz, isManager } from "@/lib/constants";
import { questionUpdateSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function GET(_, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!isManager(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const question = await db.question.findUnique({
      where: { id: params.questionId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            createdById: true
          }
        }
      }
    });

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }
    if (!canManageQuiz(session.user, question.quiz)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch question" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!isManager(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const existingQuestion = await db.question.findUnique({
      where: { id: params.questionId },
      include: {
        quiz: {
          select: {
            id: true,
            createdById: true
          }
        }
      }
    });

    if (!existingQuestion) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }
    if (!canManageQuiz(session.user, existingQuestion.quiz)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validated = questionUpdateSchema.parse(body);

    const updated = await db.question.update({
      where: { id: params.questionId },
      data: validated
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid question data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!isManager(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const existingQuestion = await db.question.findUnique({
      where: { id: params.questionId },
      include: {
        quiz: {
          select: {
            id: true,
            createdById: true
          }
        }
      }
    });

    if (!existingQuestion) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }
    if (!canManageQuiz(session.user, existingQuestion.quiz)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.question.delete({
      where: { id: params.questionId }
    });

    return NextResponse.json({ message: "Question deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete question" }, { status: 500 });
  }
}
