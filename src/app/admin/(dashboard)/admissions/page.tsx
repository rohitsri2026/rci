import { createAdminServerClient } from "@/lib/supabase/server-admin";
import AdmissionListClient from "@/components/admin/admissions/AdmissionListClient";
import { verifyRole } from "@/lib/auth";

export default async function AdmissionsPage() {
  const supabase = await createAdminServerClient();

  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  const userRole = authCheck.role || "Staff";

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

  if (admissionsResult.error) {
    console.error("Admin AdmissionsPage fetch error:", admissionsResult.error);
  }
  if (studentsResult.error) {
    console.error("Admin AdmissionsPage students fetch error:", studentsResult.error);
  }
  if (coursesResult.error) {
    console.error("Admin AdmissionsPage courses fetch error:", coursesResult.error);
  }

  return (
    <AdmissionListClient
      initialAdmissions={admissionsResult.data ?? []}
      existingStudents={studentsResult.data ?? []}
      courses={coursesResult.data ?? []}
      userRole={userRole}
    />
  );
}
