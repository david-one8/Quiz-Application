import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { SAFE_USER_SELECT } from "@/lib/constants";
import { setupSchema } from "@/lib/validations";
import { getSetupConflictResponse, getSetupState } from "@/lib/bootstrap";

export async function GET() {
  const { initialized, adminCount } = await getSetupState();

  return NextResponse.json({
    initialized,
    adminCount
  });
}

export async function POST(req) {
  try {
    const { initialized } = await getSetupState();

    if (initialized) {
      return getSetupConflictResponse();
    }

    const body = await req.json();
    const validated = setupSchema.parse(body);

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
        password: hashedPassword,
        role: "ADMIN"
      },
      select: SAFE_USER_SELECT
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid setup data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error?.message || "Failed to complete setup" },
      { status: 500 }
    );
  }
}
