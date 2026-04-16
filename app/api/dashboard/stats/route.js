import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInitializationErrorResponse } from "@/lib/bootstrap";

export async function GET() {
  try {
    const initializationError = await getInitializationErrorResponse();

    if (initializationError) {
      return initializationError;
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const quizWhere =
      session.user.role === "ADMIN"
        ? {}
        : session.user.role === "TEACHER"
          ? { createdById: session.user.id }
          : { isPublished: true };

    const questionWhere =
      session.user.role === "ADMIN"
        ? {}
        : session.user.role === "TEACHER"
          ? {
              quiz: {
                createdById: session.user.id
              }
            }
          : {
              quiz: {
                isPublished: true
              }
            };

    const attemptWhere =
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

    const userWhere =
      session.user.role === "ADMIN"
        ? {}
        : session.user.role === "TEACHER"
          ? {
              role: "STUDENT"
            }
          : {
              id: session.user.id
            };

    const [quizzes, questions, attempts, users] = await Promise.all([
      db.quiz.count({ where: quizWhere }),
      db.question.count({ where: questionWhere }),
      db.attempt.count({ where: attemptWhere }),
      db.user.count({ where: userWhere })
    ]);

    return NextResponse.json({
      quizzes,
      questions,
      attempts,
      users
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to load stats" }, { status: 500 });
  }
}
