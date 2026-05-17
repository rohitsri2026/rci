"use client";

import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { deleteCourse } from "./course-actions-server";

export default function CourseActions({ courseId }: { courseId: string }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course? This cannot be undone.")) return;
    setDeleting(true);
    
    const result = await deleteCourse(courseId);
    
    if (!result.success) {
      alert("Failed to delete course: " + result.error);
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
      >
        <Edit className="w-3.5 h-3.5" />
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {deleting ? "..." : "Delete"}
      </button>
    </div>
  );
}
