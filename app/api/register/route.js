import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { SAFE_USER_SELECT } from "@/lib/constants";
import { ZodError } from "zod";

export async function POST(req) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const exists = await db.user.findUnique({
      where: { email: validated.email }
    });

    if (exists) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: "STUDENT"
      },
      select: SAFE_USER_SELECT
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid registration data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
