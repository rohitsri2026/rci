"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function StudentActions({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this student? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/students/${studentId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
