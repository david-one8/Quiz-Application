"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteQuestionButton({ questionId }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const ok = window.confirm("Delete this question?");
    if (!ok) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/questions/${questionId}`);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/40"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
