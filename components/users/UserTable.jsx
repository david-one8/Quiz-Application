"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";
import { USER_ROLE_OPTIONS } from "@/lib/constants";

export default function UserTable({ users, currentUserId }) {
  const router = useRouter();
  const [draftRoles, setDraftRoles] = useState(
    Object.fromEntries(users.map((user) => [user.id, user.role]))
  );
  const [busyUserId, setBusyUserId] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleRoleChange = async (userId, role) => {
    const previousRole = draftRoles[userId];
    setDraftRoles((prev) => ({ ...prev, [userId]: role }));
    setBusyUserId(userId);
    setFeedback("");

    try {
      await axios.patch(`/api/users/${userId}`, { role });
      router.refresh();
    } catch (error) {
      setDraftRoles((prev) => ({ ...prev, [userId]: previousRole }));
      setFeedback(error?.response?.data?.message || "Failed to update role");
    } finally {
      setBusyUserId("");
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Delete this user account?");

    if (!confirmed) {
      return;
    }

    setBusyUserId(userId);
    setFeedback("");

    try {
      await axios.delete(`/api/users/${userId}`);
      router.refresh();
    } catch (error) {
      setFeedback(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setBusyUserId("");
    }
  };

  return (
    <div className="space-y-4">
      {feedback ? <p className="text-sm text-rose-500">{feedback}</p> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Joined</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isBusy = busyUserId === user.id;

              return (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-900">
                  <td className="px-3 py-4 align-top">
                    <p className="font-semibold">{user.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                    {isCurrentUser ? (
                      <p className="mt-2 text-xs font-medium text-teal-600">Current session</p>
                    ) : null}
                  </td>
                  <td className="px-3 py-4 align-top">
                    <div className="space-y-2">
                      <Badge
                        variant={
                          draftRoles[user.id] === "ADMIN"
                            ? "primary"
                            : draftRoles[user.id] === "TEACHER"
                              ? "info"
                              : "default"
                        }
                      >
                        {draftRoles[user.id]}
                      </Badge>
                      <select
                        className="input max-w-[180px]"
                        value={draftRoles[user.id]}
                        disabled={isCurrentUser || isBusy}
                        onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      >
                        {USER_ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-3 py-4 align-top text-slate-500 dark:text-slate-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-3 py-4 align-top">
                    <button
                      type="button"
                      disabled={isCurrentUser || isBusy}
                      onClick={() => handleDelete(user.id)}
                      className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900/40 dark:hover:bg-rose-950/40"
                    >
                      {isBusy ? "Working..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
