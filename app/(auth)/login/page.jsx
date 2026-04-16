import LoginForm from "@/components/auth/LoginForm";
import { requireInitializedApp } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  await requireInitializedApp();

  return <LoginForm />;
}
