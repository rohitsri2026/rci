"use client";

import CourseForm from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
          Add New Course
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Publish a new program to the institute course catalog and public admission registry.
        </p>
      </div>

      <CourseForm />
    </div>
  );
}
