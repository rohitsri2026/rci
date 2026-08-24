"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, UserCheck, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import StudentForm from "@/components/admin/students/StudentForm";

export default function EditStudentPage() {
  const { id } = useParams() as { id: string };
  const [student, setStudent] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data, error: studentError } = await supabase
        .from("students")
        .select("*, courses(course_name)")
        .eq("id", id)
        .single();

      if (studentError) {
        setError("Failed to load student details. The student record may have been deleted.");
      } else if (data) {
        setStudent(data);
      }
      setInitialLoading(false);
    }
    loadData();
  }, [id]);

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs font-extrabold text-slate-600">Loading student details...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">Student Record Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{error || "Unable to locate the requested student profile."}</p>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>
      </div>
    );
  }

  const initials = student.full_name
    ? student.full_name
        .trim()
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Utility Header */}
      <div>
        <Link 
          href="/admin/students" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-600 hover:text-blue-600 transition-colors mb-3 px-2 py-1 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to Students</span>
        </Link>
        
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
                Edit Student Profile
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Update academic details and contact information for this student.
              </p>
            </div>
          </div>

          {/* Student Identity Pill */}
          <div className="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-2xl p-2 pr-4 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 leading-tight">{student.full_name}</p>
              <p className="text-[10.5px] font-bold text-blue-600">{student.courses?.course_name || "Enrolled Student"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Student Form Component */}
      <StudentForm
        mode="edit"
        studentId={id}
        initialData={{
          full_name: student.full_name || "",
          email: student.email || "",
          phone: student.phone || "",
          address: student.address || "",
          course_id: student.course_id || "",
        }}
      />
    </div>
  );
}
