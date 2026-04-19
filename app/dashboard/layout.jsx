import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { requireInitializedApp } from "@/lib/bootstrap";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  await requireInitializedApp();
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title="Quiz Management"
          description="A modern workspace for quiz operations and learner evaluation."
          user={user}
        />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
      <MobileNav role={user.role} />
    </div>
  );
}
