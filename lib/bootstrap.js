import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const SETUP_REQUIRED_MESSAGE =
  "App setup required. Create the first admin account before using QuizNova.";

export async function getSetupState() {
  const adminCount = await db.user.count({
    where: { role: "ADMIN" }
  });

  return {
    adminCount,
    initialized: adminCount > 0
  };
}

export async function hasAdminAccount() {
  const { initialized } = await getSetupState();
  return initialized;
}

export async function requireInitializedApp() {
  if (!(await hasAdminAccount())) {
    redirect("/setup");
  }
}

export async function redirectIfInitialized(destination = "/login") {
  if (await hasAdminAccount()) {
    redirect(destination);
  }
}

export async function getInitializationErrorResponse() {
  if (await hasAdminAccount()) {
    return null;
  }

  return NextResponse.json(
    {
      message: SETUP_REQUIRED_MESSAGE
    },
    { status: 503 }
  );
}

export function getSetupConflictResponse() {
  return NextResponse.json(
    {
      message: "Initial setup is already complete. Sign in to continue."
    },
    { status: 409 }
  );
}
