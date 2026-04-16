import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SAFE_USER_SELECT } from "@/lib/constants";
import { getInitializationErrorResponse } from "@/lib/bootstrap";

export async function GET(_, { params }) {
  try {
    const initializationError = await getInitializationErrorResponse();

    if (initializationError) {
      return initializationError;
    }

    const { attemptId } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const attempt = await db.attempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            duration: true,
            createdById: true
          }
        },
        user: {
          select: SAFE_USER_SELECT
        }
      }
    });

    if (!attempt) {
      return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
    }

    const canView =
      session.user.role === "ADMIN" ||
      attempt.user.id === session.user.id ||
      (session.user.role === "TEACHER" && attempt.quiz.createdById === session.user.id);

    if (!canView) {
      return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
    }

    const { createdById, ...quiz } = attempt.quiz;

    return NextResponse.json({
      ...attempt,
      quiz
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch attempt" }, { status: 500 });
  }
}
