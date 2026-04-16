import RegisterForm from "@/components/auth/RegisterForm";
import { requireInitializedApp } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  await requireInitializedApp();

  return <RegisterForm />;
}
