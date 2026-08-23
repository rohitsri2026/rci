"use client";

import CourseForm from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 font-display">Add New Course</h1>
        <p className="text-slate-500 mt-1">Publish a new program to the dynamic student enrollment registry.</p>
      </div>

      <CourseForm />
    </div>
  );
}
