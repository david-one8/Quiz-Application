import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSetupState } from "@/lib/bootstrap";
import { seedPlatform } from "@/lib/seed-data";

export async function POST() {
  try {
    const { initialized } = await getSetupState();

    if (!initialized) {
      return NextResponse.json({ message: "Platform must be initialized first" }, { status: 400 });
    }

    const firstAdmin = await db.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!firstAdmin) {
      return NextResponse.json({ message: "Admin account not found" }, { status: 400 });
    }

    const success = await seedPlatform(firstAdmin.id);

    if (!success) {
      return NextResponse.json({ message: "Platform already contains data" }, { status: 400 });
    }

    return NextResponse.json({ message: "Sample data seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ message: "Seeding failed" }, { status: 500 });
  }
}
