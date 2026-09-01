import { createAdminServerClient } from "@/lib/supabase/server-admin";
import StudentListClient from "@/components/admin/students/StudentListClient";

export default async function StudentsPage() {
  const supabase = await createAdminServerClient();

  const [studentsResult, coursesResult, certificatesResult] = await Promise.all([
    supabase
      .from("students")
      .select("*, courses(id, course_name, duration)")
      .order("created_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, course_name, duration")
      .order("course_name", { ascending: true }),
    supabase
      .from("certificates")
      .select("*")
      .eq("status", "Valid"),
  ]);

  if (studentsResult.error) {
    console.error("Admin StudentsPage fetch error:", studentsResult.error);
  }
  if (coursesResult.error) {
    console.error("Admin StudentsPage courses error:", coursesResult.error);
  }
  if (certificatesResult.error) {
    console.error("Admin StudentsPage certificates error:", certificatesResult.error);
  }

  return (
    <StudentListClient 
      initialStudents={studentsResult.data ?? []} 
      courses={coursesResult.data ?? []} 
      initialCertificates={certificatesResult.data ?? []}
    />
  );
}
