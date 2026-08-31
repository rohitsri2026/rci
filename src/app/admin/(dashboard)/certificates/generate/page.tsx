import { createAdminServerClient } from "@/lib/supabase/server-admin";
import GenerateForm from "@/components/certificates/GenerateForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";

export default async function GenerateCertificatePage() {
  const supabase = await createAdminServerClient();

  // Fetch all students
  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("id, full_name, email, phone, course_id, address, created_at")
    .order("full_name");

  if (studentError) {
    console.error("Failed to load students:", studentError);
  }

  // Fetch all courses
  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("id, course_name, duration, description, fees, created_at")
    .order("course_name");

  if (courseError) {
    console.error("Failed to load courses:", courseError);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/certificates" className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Generate Certificates</h1>
          <p className="text-slate-500 mt-1">Issue certifications to registered students in single or bulk operations.</p>
        </div>
      </div>

      <GenerateForm 
        students={students || []} 
        courses={courses || []} 
      />
    </div>
  );
}
