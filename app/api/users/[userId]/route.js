import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { userRoleSchema } from "@/lib/validations";
import { getInitializationErrorResponse } from "@/lib/bootstrap";

function serializeUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 })
    };
  }

  return { session };
}

export async function PATCH(req, { params }) {
  try {
    const initializationError = await getInitializationErrorResponse();

    if (initializationError) {
      return initializationError;
    }

    const { userId } = await params;

    const { session, error } = await requireAdminSession();

    if (error) {
      return error;
    }

    await connectToDatabase();
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = userRoleSchema.parse(body);

    if (String(existingUser._id) === session.user.id && validated.role !== existingUser.role) {
      return NextResponse.json(
        { message: "You cannot change your own role from the user dashboard." },
        { status: 400 }
      );
    }

    if (existingUser.role === "ADMIN" && validated.role !== "ADMIN") {
      const adminCount = await db.user.count({
        where: { role: "ADMIN" }
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "At least one admin must remain in the system." },
          { status: 400 }
        );
      }
    }

    existingUser.role = validated.role;
    await existingUser.save();

    return NextResponse.json(serializeUser(existingUser));
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid role update" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error?.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  const initializationError = await getInitializationErrorResponse();

  if (initializationError) {
    return initializationError;
  }

  const { userId } = await params;

  const { session, error } = await requireAdminSession();

  if (error) {
    return error;
  }

  await connectToDatabase();
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (String(existingUser._id) === session.user.id) {
    return NextResponse.json(
      { message: "You cannot delete your own account from the user dashboard." },
      { status: 400 }
    );
  }

  if (existingUser.role === "ADMIN") {
    const adminCount = await db.user.count({
      where: { role: "ADMIN" }
    });

    if (adminCount <= 1) {
      return NextResponse.json(
        { message: "At least one admin must remain in the system." },
        { status: 400 }
      );
    }
  }

  const [quizCount, attemptCount] = await Promise.all([
    db.quiz.count({
      where: { createdById: String(existingUser._id) }
    }),
    db.attempt.count({
      where: { userId: String(existingUser._id) }
    })
  ]);

  if (quizCount || attemptCount) {
    return NextResponse.json(
      {
        message:
          "This user still owns quizzes or attempts. Remove those records before deleting the account."
      },
      { status: 400 }
    );
  }

  await User.deleteOne({ _id: userId });

  return NextResponse.json({ message: "User deleted" });
}
