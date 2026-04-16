"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

export default function DeleteQuizButton({ quizId }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this quiz?");
    if (!ok) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/quizzes/${quizId}`);
      router.push("/dashboard/quizzes");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
    >
      {deleting ? "Deleting..." : "Delete quiz"}
    </button>
  );
}
