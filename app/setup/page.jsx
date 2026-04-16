import { redirect } from "next/navigation";
import SetupForm from "@/components/setup/SetupForm";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/shared/Logo";
import { getSetupState } from "@/lib/bootstrap";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const { initialized } = await getSetupState();

  if (initialized) {
    const user = await getCurrentUser();
    redirect(user ? "/dashboard" : "/login");
  }

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        <div className="surface mb-5 flex items-center justify-between gap-3 p-4">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="surface p-6 sm:p-8">
          <span className="inline-flex rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
            First-time setup
          </span>
          <h1 className="mt-5 text-3xl font-black">Create the first admin account</h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            QuizNova needs one administrator before the rest of the platform can be
            used. This account will be able to create teachers, review users, and
            configure the quiz workspace.
          </p>

          <SetupForm />
        </div>
      </div>
    </main>
  );
}
