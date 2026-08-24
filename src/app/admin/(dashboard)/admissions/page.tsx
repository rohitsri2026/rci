import { createClient } from "@/lib/supabase/server";
import AdmissionListClient from "@/components/admin/admissions/AdmissionListClient";

export default async function AdmissionsPage() {
  const supabase = await createClient();

  const [admissionsResult, studentsResult, coursesResult] = await Promise.all([
    supabase
      .from("admissions")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("students")
      .select("id, full_name, email, phone"),
    supabase
      .from("courses")
      .select("id, course_name")
      .order("course_name", { ascending: true }),
  ]);

  return (
    <AdmissionListClient
      initialAdmissions={admissionsResult.data ?? []}
      existingStudents={studentsResult.data ?? []}
      courses={coursesResult.data ?? []}
    />
  );
}
