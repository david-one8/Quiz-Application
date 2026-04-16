import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getAuthSession();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(roles = []) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect("/forbidden");
  }
  return user;
}
