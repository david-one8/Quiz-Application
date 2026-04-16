import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SAFE_USER_SELECT } from "@/lib/constants";
import { userCreateSchema } from "@/lib/validations";
import { getInitializationErrorResponse } from "@/lib/bootstrap";

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

export async function GET() {
  const initializationError = await getInitializationErrorResponse();

  if (initializationError) {
    return initializationError;
  }

  const { error } = await requireAdminSession();

  if (error) {
    return error;
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: SAFE_USER_SELECT
  });

  return NextResponse.json(users);
}

export async function POST(req) {
  try {
    const initializationError = await getInitializationErrorResponse();

    if (initializationError) {
      return initializationError;
    }

    const { error } = await requireAdminSession();

    if (error) {
      return error;
    }

    const body = await req.json();
    const validated = userCreateSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email: validated.email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await db.user.create({
      data: {
        ...validated,
        password: hashedPassword
      },
      select: SAFE_USER_SELECT
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid user data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
