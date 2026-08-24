"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import CourseForm from "@/components/admin/CourseForm";

export default function EditCoursePage() {
  const { id } = useParams() as { id: string };
  const [course, setCourse] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourse() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Failed to load course details.");
      } else if (data) {
        setCourse(data);
      }
      setInitialLoading(false);
    }
    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold max-w-2xl">
        {error || "Course record not found."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
          Edit Course Information
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Update fee structure, availability status, or curriculum details for "{course.course_name}".
        </p>
      </div>

      <CourseForm initialData={course} />
    </div>
  );
}
