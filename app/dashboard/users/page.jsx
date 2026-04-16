import Card from "@/components/ui/Card";
import UserForm from "@/components/users/UserForm";
import UserTable from "@/components/users/UserTable";
import { ADMIN_ROLES } from "@/lib/constants";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const currentUser = await requireRole(ADMIN_ROLES);

  const [users, adminCount, teacherCount, studentCount] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    }),
    db.user.count({ where: { role: "ADMIN" } }),
    db.user.count({ where: { role: "TEACHER" } }),
    db.user.count({ where: { role: "STUDENT" } })
  ]);

  const stats = [
    { label: "Admins", value: adminCount, color: "text-teal-600" },
    { label: "Teachers", value: teacherCount, color: "text-sky-600" },
    { label: "Students", value: studentCount, color: "text-violet-600" },
    { label: "Total users", value: users.length, color: "text-amber-600" }
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Create user</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create administrator, teacher, or student accounts directly from the
            control panel.
          </p>
          <div className="mt-6">
            <UserForm />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Workspace snapshot</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {stats.map((stat) => (
              <div key={stat.label} className="surface-muted p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className={`mt-2 text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">User directory</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage access levels and keep the admin team healthy so the platform
            always has an owner.
          </p>
        </div>

        <UserTable users={users} currentUserId={currentUser.id} />
      </Card>
    </div>
  );
}
