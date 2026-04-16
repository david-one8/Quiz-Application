import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isManager, PUBLIC_USER_SELECT } from "@/lib/constants";
import { getInitializationErrorResponse } from "@/lib/bootstrap";
import { ZodError } from "zod";

export async function GET() {
  const initializationError = await getInitializationErrorResponse();

  if (initializationError) {
    return initializationError;
  }

  const session = await getServerSession(authOptions);
  const user = session?.user ?? null;

  const where = !user
    ? { isPublished: true }
    : user.role === "ADMIN"
      ? {}
      : isManager(user.role)
        ? {
            OR: [
              { isPublished: true },
              { createdById: user.id }
            ]
          }
        : { isPublished: true };

  const quizzes = await db.quiz.findMany({
    where,
    include: {
      createdBy: {
        select: PUBLIC_USER_SELECT
      },
      _count: {
        select: {
          questions: true,
          attempts: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(quizzes);
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
    const validated = quizSchema.parse(body);

    const quiz = await db.quiz.create({
      data: {
        ...validated,
        createdById: session.user.id
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid quiz data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error?.message || "Failed to create quiz" },
      { status: 500 }
    );
  }
}
