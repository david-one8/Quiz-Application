export const MANAGER_ROLES = ["ADMIN", "TEACHER"];
export const ALL_ROLES = ["ADMIN", "TEACHER", "STUDENT"];

export const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

export const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  role: true
};

export const DASHBOARD_LINKS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ALL_ROLES
  },
  {
    label: "Quizzes",
    href: "/dashboard/quizzes",
    roles: MANAGER_ROLES
  },
  {
    label: "Questions",
    href: "/dashboard/questions",
    roles: MANAGER_ROLES
  },
  {
    label: "Attempts",
    href: "/dashboard/attempts",
    roles: ALL_ROLES
  },
  {
    label: "Results",
    href: "/dashboard/results",
    roles: ALL_ROLES
  }
];

export function isManager(role) {
  return MANAGER_ROLES.includes(role);
}

export function canManageQuiz(user, quiz) {
  if (!user || !quiz) {
    return false;
  }

  return user.role === "ADMIN" || quiz.createdById === user.id;
}
